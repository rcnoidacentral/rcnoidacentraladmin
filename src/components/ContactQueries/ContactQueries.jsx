import React, { useEffect, useState } from "react";
import styles from "./ContactQueries.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { toast } from "react-hot-toast";

const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const snap = await getDocs(collection(db, "contactMessages"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQueries(data);
      } catch (error) {
        toast.error("❌ Failed to fetch contact queries");
      }
    };
    fetchQueries();
  }, []);

  const filtered = queries.filter((q) =>
    Object.values(q).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className={styles.queryContainer}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Contact Form Queries</h1>
        <input
          type="text"
          placeholder="Search by name, email, subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id}>
                <td>{q.fullName}</td>
                <td>{q.email}</td>
                <td>{q.phone}</td>
                <td>{q.subject || "-"}</td>
                <td>
                  {q.message.length > 50
                    ? q.message.slice(0, 50) + "..."
                    : q.message}
                </td>
                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => setSelectedQuery(q)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuery && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedQuery(null)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedQuery.fullName} 🧾</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedQuery(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <p>
                <strong>Email:</strong> {selectedQuery.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedQuery.phone}
              </p>
              <p>
                <strong>Subject:</strong> {selectedQuery.subject}
              </p>
              <p>
                <strong>Message:</strong>
                <br />
                {selectedQuery.message}
              </p>
              <p>
                <strong>Submitted On:</strong>{" "}
                {selectedQuery.createdAt?.seconds
                  ? new Date(
                      selectedQuery.createdAt.seconds * 1000
                    ).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactQueries;
