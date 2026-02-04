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
import { toast } from "react-hot-toast";

const ApplicationsTable = ({ applications, onViewDetails,  onStatusUpdated, }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

const handleStatusChange = async (appId, status, remarks = "") => {
  const toastId = toast.loading("Updating application status...");

  try {
    await updateApplicationStatus(appId, status, remarks);

    if (onStatusUpdated) {
      await onStatusUpdated(); // ⏳ wait till refresh finishes
    }

    toast.success("Status updated successfully", {
      id: toastId,
    });

    setActiveMenu(null);
  } catch (error) {
    console.error("Failed to update status:", error);

    toast.error("Failed to update status", {
      id: toastId,
    });
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
          {applications.map((app, index) => {
            const appId = app._id || app.id; // ✅ normalized ID

            return (
              <tr
                key={appId || index}
                className={styles.tableRow}
                onClick={() => setActiveMenu(null)} // auto close on row click
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSingleResume(app);
                      }}
                      className={styles.downloadResumeBtn}
                    >
                      📥 Download
                    </button>
                  ) : (
                    <span className={styles.noResume}>—</span>
                  )}
                </td>

                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(app);
                    }}
                    className={styles.viewBtn}
                  >
                    👁️ View
                  </button>
                </td>

                <td onClick={(e) => e.stopPropagation()}>
                  <ActionMenu
                    application={app}
                    isActive={activeMenu === appId}
                    onToggle={() =>
                      setActiveMenu(activeMenu === appId ? null : appId)
                    }
                    onStatusChange={handleStatusChange}
                    onClose={() => setActiveMenu(null)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;
