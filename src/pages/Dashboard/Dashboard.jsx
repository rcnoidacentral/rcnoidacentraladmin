import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import styles from "./Dashboard.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ContactQueries from "../../components/ContactQueries/ContactQueries";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("fullName");
  const [program, setSelectedProgram] = useState("");

  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const handleDownloadExcel = () => {
    // Convert the filteredApps to a worksheet-friendly format
    const exportData = filteredApps.map((app) => ({
      "Full Name": app.fullName,
      Email: app.email,
      Phone: app.phone,
      City: app.city,
      program:
        programNameMap[app.program] || app.program,
      "Resume URL": app.resumeUrl,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

    XLSX.writeFile(workbook, "Applications_Report.xlsx");
  };
  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await signOut(auth);
      toast.success("🔒 Logged out", { id: toastId });
      navigate("/login");
    } catch (error) {
      toast.error("❌ Logout failed", { id: toastId });
    }
  };
  const programNameMap = {
    "flexi-mou": "Flexi MOU",
    "b-voc": "B.Voc",
    "d-voc": "D.Voc",
    nats: "NATS",
    naps: "NAPS",
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder("Resumes");

    const fetchAndAdd = async (app) => {
      const response = await fetch(app.resumeUrl);
      const blob = await response.blob();
      const ext = app.resumeUrl.split(".").pop().split("?")[0];
      const fileName = `${app.fullName.replace(/\s+/g, "_")}_Resume.${ext}`;
      folder.file(fileName, blob);
    };

    await Promise.all(applications.map(fetchAndAdd));
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "All_Resumes.zip");
  };

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "applications"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...applications];

    if (search.trim() !== "") {
      data = data.filter((app) =>
        Object.values(app).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Always sort by readable program name
    data.sort((a, b) => {
      const nameA = programNameMap[a.program] || "";
      const nameB = programNameMap[b.program] || "";
      return nameA.localeCompare(nameB);
    });

    setFilteredApps(data);
  }, [applications, search]);
  useEffect(() => {
    const programOrder = ["Flexi MOU", "B.Voc", "D.Voc", "NATS", "NAPS"];

    let data = [...applications];

    if (search.trim() !== "") {
      data = data.filter((app) =>
        Object.values(app).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Apply program filter if selected
    if (program) {
      data = data.filter((app) => app.program === program);
    }

    // Sort by predefined program order
    data.sort((a, b) => {
      const indexA = programOrder.indexOf(a.program);
      const indexB = programOrder.indexOf(b.program);
      return indexA - indexB;
    });

    setFilteredApps(data);
  }, [applications, search, program]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.topBar}>
        <h1 className={styles.heading}>📋 Applications</h1>
        <div className={styles.buttonGroup}>
          <button className={styles.downloadAllBtn} onClick={handleDownloadAll}>
            ⬇️ Download All
          </button>
          <button
            className={styles.downloadAllBtn}
            onClick={handleDownloadExcel}
          >
            📊 Export to Excel
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🔓 Logout
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search any field..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.sortRow}>
        <label htmlFor="programFilter">Filter by program:</label>
        <select
          id="programFilter"
          value={program}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="">All Programs</option>
          <option value="flexi-mou">Flexi MOU</option>
          <option value="b-voc">B.Voc</option>
          <option value="d-voc">D.Voc</option>
          <option value="nats">NATS</option>
          <option value="naps">NAPS</option>
        </select>
      </div>

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
            {filteredApps.map((app) => (
              <tr key={app.id}>
                <td>{app.fullName}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.city}</td>
                <td>{programNameMap[app.program] || app.program}</td>

                <td>
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className={styles.resumeLink}
                  >
                    ⬇️ Download
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

      {selectedApp && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedApp(null)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {selectedApp.fullName} <span>📄 Application Details</span>
              </h2>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedApp(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalGrid}>
              {Object.entries(selectedApp).map(
                ([key, value]) =>
                  key !== "resumeUrl" && (
                    <div
                      key={key}
                      className={
                        styles.fieldBox +
                        (key === "motivation" ? ` ${styles.longField}` : "")
                      }
                    >
                      <span>
                        <strong>{key}:</strong>
                      </span>
                      <p>
                        {typeof value === "object" && value?.seconds
                          ? new Date(value.seconds * 1000).toLocaleString()
                          : String(value)}
                      </p>
                    </div>
                  )
              )}
            </div>
            <div className={styles.modalFooter}>
              <a
                href={selectedApp.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.resumeBtn}
                download
              >
                View/Download Resume
              </a>
            </div>
          </div>
        </div>
      )}

      <ContactQueries></ContactQueries>
    </div>
  );
};

export default Dashboard;
