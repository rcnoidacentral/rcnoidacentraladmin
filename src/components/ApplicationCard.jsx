import React from "react";
import styles from "./ApplicationCard.module.css";

const ApplicationCard = ({ data }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{data.fullName}</h2>
        <a
          href={data.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.resumeBtn}
        >
          📄 View Resume
        </a>
      </div>

      <div className={styles.grid}>
        <div><strong>Email:</strong> {data.email}</div>
        <div><strong>Phone:</strong> {data.phone}</div>
        <div><strong>DOB:</strong> {data.dateOfBirth}</div>
        <div><strong>City:</strong> {data.city}</div>
        <div><strong>State:</strong> {data.state}</div>
        <div><strong>Qualification:</strong> {data.qualification}</div>
        <div><strong>Year of Completion:</strong> {data.yearOfCompletion}</div>
        <div><strong>CGPA:</strong> {data.cgpa}</div>
        <div><strong>Experience:</strong> {data.experience}</div>
        <div><strong>Institution:</strong> {data.institution}</div>
        <div><strong>Program:</strong> {data.program}</div>
        <div><strong>Reference ID:</strong> {data.referenceId}</div>
        <div className={styles.address}><strong>Address:</strong> {data.address}</div>
        <div className={styles.motivation}><strong>Motivation:</strong> {data.motivation}</div>
      </div>

      <div className={styles.footer}>
        <small>
          Submitted on:{" "}
          {data.submittedAt?.seconds
            ? new Date(data.submittedAt.seconds * 1000).toLocaleString()
            : "N/A"}
        </small>
      </div>
    </div>
  );
};

export default ApplicationCard;
