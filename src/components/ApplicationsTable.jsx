// components/ApplicationsTable.jsx
import React, { useState } from "react";
import styles from "../pages/Dashboard/Dashboard.module.css";
import {
  PROGRAM_NAME_MAP,
  STATUS_LABELS,
  STATUS_COLORS,
} from "../constants/programConstants";
import { downloadSingleResume } from "../utils/downloadUtils";
import { updateApplicationStatus } from "../utils/applicationUtils";
import ActionMenu from "./ActionMenu";

const ApplicationsTable = ({ applications, onViewDetails }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    // Firestore timestamp support
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    // ISO string or Date object support
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleStatusChange = async (appId, status, remarks = "") => {
    try {
      await updateApplicationStatus(appId, status, remarks);
      setActiveMenu(null);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const currentStatus = status || "submitted";
    const label = STATUS_LABELS[currentStatus] || "Pending";
    const color = STATUS_COLORS[currentStatus] || "#6B7280";

    return (
      <span className={styles.statusBadge} style={{ backgroundColor: color }}>
        {label}
      </span>
    );
  };

  if (!applications || applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📭</div>
        <p className={styles.emptyText}>No applications found</p>
        <p className={styles.emptySubtext}>
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Program</th>
            <th>Submitted On</th>
            <th>Status</th>
            <th>Resume</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr key={app._id || app.id || index} className={styles.tableRow}>
              <td>{index + 1}</td>
              <td className={styles.nameCell}>{app.fullName || "—"}</td>
              <td>{app.email || "—"}</td>
              <td>{app.phone || "—"}</td>
              <td>{app.city || "—"}</td>
              <td>
                <span className={styles.programBadge}>
                  {PROGRAM_NAME_MAP[app.program] || app.program || "—"}
                </span>
              </td>
              <td>{formatDate(app.createdAt)}</td>
              <td>{getStatusBadge(app.status)}</td>
              <td>
                {app.resume?.url || app.resumeUrl ? (
                  <button
                    onClick={() => downloadSingleResume(app)}
                    className={styles.downloadResumeBtn}
                    title="Download resume"
                  >
                    📥 Download
                  </button>
                ) : (
                  <span className={styles.noResume}>—</span>
                )}
              </td>
              <td>
                <div className={styles.actionsCell}>
                  <button
                    onClick={() => onViewDetails(app)}
                    className={styles.viewBtn}
                    title="View full details"
                  >
                    👁️ View
                  </button>


                </div>
              </td>
              <td>                  <ActionMenu
                    application={app}
                    isActive={activeMenu === app._id}
                    onToggle={() =>
                      setActiveMenu(activeMenu === app._id ? null : app._id)
                    }
                    onStatusChange={handleStatusChange}
                    onClose={() => setActiveMenu(null)}
                  /></td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;