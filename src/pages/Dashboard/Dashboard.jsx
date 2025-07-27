import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom"; // already used in Login
import { toast } from "react-hot-toast";

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();
    
    const [selectedApp, setSelectedApp] = useState(null);

const handleLogout = async () => {
  const loggingOut = toast.loading("Logging out...");
  try {
    await signOut(auth);
    toast.success("🔒 Logged out", { id: loggingOut });
    navigate("/login");
  } catch (error) {
    toast.error("❌ Logout failed", { id: loggingOut });
  }
};


  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "applications"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.dashboard}>
        <div className={styles.topBar}>
  <h1 className={styles.heading}>All Applications</h1>
  <button className={styles.logoutBtn} onClick={handleLogout}>
    🔓 Logout
  </button>
</div>

      <h1 className={styles.heading}>All Applications</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Program</th>
              <th>Resume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.fullName}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.city}</td>
                <td>{app.selectedProgram}</td>
                <td>
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resumeLink}
                  >
                    View PDF
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className={styles.viewBtn}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

{/* Modal */}
{selectedApp && (
  <div className={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
    <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h2>
          {selectedApp.fullName} <span>📄 Application Details</span>
        </h2>
        <button className={styles.closeBtn} onClick={() => setSelectedApp(null)}>✕</button>
      </div>
<div className={styles.modalGrid}>
  <div className={styles.fieldBox}>
    <span>📧 <strong>Email:</strong></span>
    <p>{selectedApp.email}</p>
  </div>
  <div className={styles.fieldBox}>
    <span>📞 <strong>Phone:</strong></span>
    <p>{selectedApp.phone}</p>
  </div>

  <div className={styles.fieldBox}>
    <span>🏙️ <strong>City:</strong></span>
    <p>{selectedApp.city}</p>
  </div>
  <div className={styles.fieldBox}>
    <span>🗺️ <strong>State:</strong></span>
    <p>{selectedApp.state}</p>
  </div>

  <div className={styles.fieldBox}>
    <span>🎓 <strong>Qualification:</strong></span>
    <p>{selectedApp.qualification}</p>
  </div>
  <div className={styles.fieldBox}>
    <span>📊 <strong>Percentage:</strong></span>
    <p>{selectedApp.percentage}</p>
  </div>

  <div className={styles.fieldBox}>
    <span>🏫 <strong>Institution:</strong></span>
    <p>{selectedApp.institution}</p>
  </div>
  <div className={styles.fieldBox}>
    <span>📚 <strong>Program:</strong></span>
    <p>{selectedApp.selectedProgram}</p>
  </div>

  <div className={styles.fieldBox}>
    <span>🆔 <strong>Reference ID:</strong></span>
    <p>{selectedApp.referenceId}</p>
  </div>
  <div className={styles.fieldBox}>
    <span>📬 <strong>Postal Code:</strong></span>
    <p>{selectedApp.postalCode}</p>
  </div>

  <div className={styles.fieldBox}>
    <span>📍 <strong>Address:</strong></span>
    <p>{selectedApp.address}</p>
  </div>
  <div className={styles.fieldBox + ' ' + styles.longField}>
    <span>📝 <strong>Motivation:</strong></span>
    <p>{selectedApp.motivation}</p>
  </div>
</div>


      <div className={styles.modalFooter}>
        <a
          href={selectedApp.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.resumeBtn}
        >
          View Resume
        </a>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
