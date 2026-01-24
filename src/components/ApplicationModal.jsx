// components/ApplicationModal.jsx
import React, { useState } from "react";
import styles from "../pages/Dashboard/Dashboard.module.css";
import { PROGRAM_NAME_MAP, STATUS_LABELS, APPLICATION_STATUS } from "../constants/programConstants";
import { uploadOfferLetter } from "../utils/applicationUtils";

const ApplicationModal = ({ application, onClose }) => {
  const [offerLetterFile, setOfferLetterFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const formatValue = (key, value) => {
    if (!value) return "—";

    // Format timestamps
    if (key.includes("At") || key.includes("Date") || key === "createdAt") {
      if (value?.seconds) {
        return new Date(value.seconds * 1000).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      }
      if (value instanceof Date || typeof value === "string") {
        return new Date(value).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      }
    }

    // Format program
    if (key === "program") {
      return PROGRAM_NAME_MAP[value] || value;
    }

    // Format status
    if (key === "status") {
      return STATUS_LABELS[value] || "Pending";
    }

    // Handle objects (but not null)
    if (typeof value === "object" && value !== null) {
      // Don't stringify resume objects
      if (key === "resume" && value.url) {
        return "Uploaded";
      }
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  const handleOfferLetterUpload = async () => {
    if (!offerLetterFile) {
      setUploadError("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const url = await uploadOfferLetter(
        offerLetterFile,
        application._id || application.id,
        application.fullName
      );

      if (url) {
        setOfferLetterFile(null);
        // Refresh could be handled by parent component
      } else {
        setUploadError("Upload failed. Please try again.");
      }
    } catch (error) {
      setUploadError(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isShortlisted = application.status === APPLICATION_STATUS.SHORTLISTED;

  // Fields to exclude from display
  const excludeFields = ["_id", "id", "resumeUrl", "offerLetterUrl", "resume"];

  // Format field labels
  const formatFieldLabel = (key) => {
    return key
      .charAt(0)
      .toUpperCase()
      + key.slice(1).replace(/([A-Z])/g, " $1");
  };

  const resumeUrl = application.resumeUrl || application.resume?.url;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2>{application.fullName || "Application Details"}</h2>
            <p className={styles.modalSubtitle}>
              {application.program ? PROGRAM_NAME_MAP[application.program] || application.program : ""}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.modalContent}>
          <div className={styles.modalGrid}>
            {Object.entries(application).map(([key, value]) => {
              if (excludeFields.includes(key)) return null;

              return (
                <div
                  key={key}
                  className={`${styles.fieldBox} ${
                    key === "motivation" || key === "address" ? styles.longField : ""
                  }`}
                >
                  <span className={styles.fieldLabel}>
                    {formatFieldLabel(key)}:
                  </span>
                  <p className={styles.fieldValue}>{formatValue(key, value)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Offer Letter Section - Only for Shortlisted */}
        {isShortlisted && (
          <div className={styles.offerLetterSection}>
            <h3 className={styles.sectionTitle}>📄 Offer Letter</h3>

            {application.offerLetterUrl ? (
              <div className={styles.offerLetterExists}>
                <p className={styles.successText}>✅ Offer letter uploaded</p>
                <a
                  href={application.offerLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewOfferBtn}
                >
                  View Offer Letter
                </a>
              </div>
            ) : (
              <div className={styles.offerLetterUpload}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    setOfferLetterFile(e.target.files[0]);
                    setUploadError(null);
                  }}
                  className={styles.fileInput}
                  id="offerLetterInput"
                />
                <label htmlFor="offerLetterInput" className={styles.fileLabel}>
                  {offerLetterFile ? (
                    <>📎 {offerLetterFile.name}</>
                  ) : (
                    <>📄 Choose file (PDF, DOC, DOCX)</>
                  )}
                </label>

                {offerLetterFile && (
                  <button
                    onClick={handleOfferLetterUpload}
                    disabled={uploading}
                    className={styles.uploadBtn}
                  >
                    {uploading ? "⏳ Uploading..." : "📤 Upload"}
                  </button>
                )}

                {uploadError && (
                  <p className={styles.errorText}>⚠️ {uploadError}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeBtn}
            >
              📄 View Resume
            </a>
          )}

          <button onClick={onClose} className={styles.closeModalBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;