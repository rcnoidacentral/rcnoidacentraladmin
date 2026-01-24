// pages/Dashboard/Dashboard.jsx
import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

// Import components
import ApplicationsTable from "../../components/ApplicationsTable";
import ApplicationModal from "../../components/ApplicationModal";
import ContactQueries from "../../components/ContactQueries/ContactQueries";
import TopBar from "../../components/TopBar";
import SearchAndFilter from "../../components/SearchAndFilter";

// Import utilities
import { downloadExcel, downloadResumesZip } from "../../utils/downloadUtils.js";
import { useApplicationFilters, useApplications } from "../../hooks/useApplications.jsx";

const Dashboard = () => {
  const navigate = useNavigate();

  // Custom hooks
  const { applications, loading, error, refetch } = useApplications();
  const {
    filteredApps,
    search,
    setSearch,
    program,
    setProgram,
    statusFilter,
    setStatusFilter,
  } = useApplicationFilters(applications);

  const [selectedApp, setSelectedApp] = useState(null);

  // Handle logout
  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await signOut(auth);
      toast.success("Logged out successfully", { id: toastId });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout", { id: toastId });
    }
  };

  // Download handlers
  const handleDownloadExcel = () => {
    try {
      downloadExcel(filteredApps, statusFilter);
      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("Failed to download Excel file");
    }
  };

  const handleDownloadAll = async () => {
    try {
      const toastId = toast.loading("Preparing resumes for download...");
      await downloadResumesZip(filteredApps, statusFilter);
      toast.success("Resumes downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Resume download error:", error);
      toast.error("Failed to download resumes");
    }
  };

  // Handle modal close and refresh
  const handleModalClose = () => {
    setSelectedApp(null);
    // Optionally refetch data if updates were made
    if (refetch) {
      refetch();
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.emptyIcon}>⏳</div>
          <p className={styles.emptyText}>Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          <div className={styles.emptyIcon}>⚠️</div>
          <p className={styles.emptyText}>Error loading applications</p>
          <p className={styles.emptySubtext}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <TopBar
        onDownloadAll={handleDownloadAll}
        onDownloadExcel={handleDownloadExcel}
        onLogout={handleLogout}
        totalCount={applications.length}
        filteredCount={filteredApps.length}
      />

      <SearchAndFilter
        search={search}
        setSearch={setSearch}
        program={program}
        setProgram={setProgram}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <ApplicationsTable
        applications={filteredApps}
        onViewDetails={setSelectedApp}
      />

      {selectedApp && (
        <ApplicationModal
          application={selectedApp}
          onClose={handleModalClose}
        />
      )}

      <ContactQueries />
    </div>
  );
};

export default Dashboard;