// components/ApplicationCard.jsx
import React from "react";
import styles from "./ApplicationCard.module.css";

const ApplicationCard = ({ data }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }

    return new Date(timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{data.fullName || "N/A"}</h2>
        {(data.resumeUrl || data.resume?.url) && (
          <a
            href={data.resumeUrl || data.resume?.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeBtn}
          >
            📄 View Resume
          </a>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <strong>Email:</strong> {data.email || "—"}
        </div>
        <div className={styles.field}>
          <strong>Phone:</strong> {data.phone || "—"}
        </div>
        <div className={styles.field}>
          <strong>DOB:</strong> {data.dateOfBirth || "—"}
        </div>
        <div className={styles.field}>
          <strong>City:</strong> {data.city || "—"}
        </div>
        <div className={styles.field}>
          <strong>State:</strong> {data.state || "—"}
        </div>
        <div className={styles.field}>
          <strong>Qualification:</strong> {data.qualification || "—"}
        </div>
        <div className={styles.field}>
          <strong>Year:</strong> {data.yearOfCompletion || "—"}
        </div>
        <div className={styles.field}>
          <strong>CGPA:</strong> {data.cgpa || "—"}
        </div>
        <div className={styles.field}>
          <strong>Experience:</strong> {data.experience || "—"}
        </div>
        <div className={styles.field}>
          <strong>Institution:</strong> {data.institution || "—"}
        </div>
        <div className={styles.field}>
          <strong>Program:</strong> {data.program || "—"}
        </div>
        <div className={styles.field}>
          <strong>Reference ID:</strong> {data.referenceId || "—"}
        </div>
        <div className={`${styles.field} ${styles.address}`}>
          <strong>Address:</strong> {data.address || "—"}
        </div>
        <div className={`${styles.field} ${styles.motivation}`}>
          <strong>Motivation:</strong> {data.motivation || "—"}
        </div>
      </div>

      <div className={styles.footer}>
        <small>Submitted on: {formatDate(data.submittedAt || data.createdAt)}</small>
      </div>
    </div>
  );
};

export default ApplicationCard;