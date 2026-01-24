// components/TopBar.jsx
import React from "react";
import styles from "../pages/Dashboard/Dashboard.module.css";

const TopBar = ({ 
  onDownloadAll, 
  onDownloadExcel, 
  onLogout, 
  totalCount = 0,
  filteredCount = 0
}) => {
  return (
    <div className={styles.topBar}>
      <div className={styles.headerLeft}>
        <h1 className={styles.heading}>📋 Applications Dashboard</h1>
        <div className={styles.counters}>
          <span className={styles.counter}>
            Total: <strong>{totalCount}</strong>
          </span>
          {filteredCount !== totalCount && (
            <span className={styles.counter}>
              Filtered: <strong>{filteredCount}</strong>
            </span>
          )}
        </div>
      </div>
      
      <div className={styles.buttonGroup}>
        <button 
          className={styles.downloadBtn} 
          onClick={onDownloadAll}
          title="Download all resumes as ZIP"
        >
          📦 Download Resumes
        </button>
        
        <button
          className={styles.downloadBtn}
          onClick={onDownloadExcel}
          title="Export to Excel spreadsheet"
        >
          📊 Export to Excel
        </button>
        
        <button 
          className={styles.logoutBtn} 
          onClick={onLogout}
          title="Logout from dashboard"
        >
          🔓 Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;