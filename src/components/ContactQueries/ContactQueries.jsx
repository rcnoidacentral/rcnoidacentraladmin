// components/ContactQueries/ContactQueries.jsx
import React, { useEffect, useState } from "react";
import styles from "./ContactQueries.module.css";
import { toast } from "react-hot-toast";
import apiService from "../../api/contactQueries.service";
const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllContactQueries({
      });
console.log("response", response);
      setQueries(response?.data?.data || []);
      toast.success(`Loaded ${response.data?.data?.length || 0} contact queries`);
    } catch (error) {
      console.error("Failed to fetch queries:", error);
      toast.error("Failed to fetch contact queries");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await apiService.updateContactQueryStatus(id, { status: newStatus });
      toast.success("Status updated successfully");
      // Update local state
      setQueries((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
      );
      if (selectedQuery && selectedQuery._id === id) {
        setSelectedQuery((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) {
      return;
    }

    try {
      await apiService.deleteContactQuery(id);
      toast.success("Query deleted successfully");
      // Remove from local state
      setQueries((prev) => prev.filter((q) => q._id !== id));
      if (selectedQuery && selectedQuery._id === id) {
        setSelectedQuery(null);
      }
    } catch (error) {
      console.error("Failed to delete query:", error);
      toast.error("Failed to delete query");
    }
  };

  const filtered = queries?.filter((q) => {
    const matchesSearch =
      !search ||
      (q.fullName && q.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (q.email && q.email.toLowerCase().includes(search.toLowerCase())) ||
      (q.phone && String(q.phone).includes(search)) ||
      (q.subject && q.subject.toLowerCase().includes(search.toLowerCase())) ||
      (q.message && q.message.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || q.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const truncateMessage = (message, maxLength = 60) => {
    if (!message) return "—";
    if (message.length <= maxLength) return message;
    return message.slice(0, maxLength) + "...";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { label: "New", color: "#2563eb" },
      read: { label: "Read", color: "#06b6d4" },
      replied: { label: "Replied", color: "#10b981" },
      archived: { label: "Archived", color: "#6b7280" },
    };

    const config = statusConfig[status] || statusConfig.new;

    return (
      <span
        className={styles.statusBadge}
        style={{ backgroundColor: config.color }}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.queryContainer}>
        <div className={styles.loading}>
          <div className={styles.loadingIcon}>📨</div>
          <p className={styles.loadingText}>Loading contact queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.queryContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>📧 Contact Form Queries</h1>
          <p className={styles.subtitle}>
            Total Queries: <strong>{queries.length}</strong>
            {(search || statusFilter !== "all") && (
              <>
                {" • "}
                Filtered: <strong>{filtered.length}</strong>
              </>
            )}
          </p>
        </div>

        <div className={styles.controls}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            {/* <option value="replied">Replied</option> */}
            <option value="archived">Archived</option>
          </select>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="🔍 Search queries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearch("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>
            {queries.length === 0
              ? "No contact queries yet"
              : "No queries match your filters"}
          </p>
          {(search || statusFilter !== "all") && (
            <p className={styles.emptySubtext}>
              Try adjusting your search or filters
            </p>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, index) => (
                <tr key={q._id} className={styles.tableRow}>
                  <td>{index + 1}</td>
                  <td className={styles.nameCell}>{q.fullName || "—"}</td>
                  <td>{q.email || "—"}</td>
                  <td>{q.phone || "—"}</td>
                  <td className={styles.subjectCell}>{q.subject || "—"}</td>
                  <td className={styles.messageCell}>
                    {truncateMessage(q.message)}
                  </td>
                  <td>{getStatusBadge(q.status)}</td>
                  <td>{formatDate(q.createdAt)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.viewBtn}
                        onClick={() => setSelectedQuery(q)}
                        title="View full query"
                      >
                        👁️
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(q._id)}
                        title="Delete query"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedQuery && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedQuery(null)}
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{selectedQuery.fullName || "Contact Query"}</h2>
                <p className={styles.modalSubtitle}>Query Details</p>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedQuery(null)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.modalGrid}>
                <div className={styles.fieldBox}>
                  <span className={styles.fieldLabel}>Full Name:</span>
                  <p className={styles.fieldValue}>
                    {selectedQuery.fullName || "—"}
                  </p>
                </div>

                <div className={styles.fieldBox}>
                  <span className={styles.fieldLabel}>Email:</span>
                  <p className={styles.fieldValue}>
                    <a href={`mailto:${selectedQuery.email}`}>
                      {selectedQuery.email || "—"}
                    </a>
                  </p>
                </div>

                <div className={styles.fieldBox}>
                  <span className={styles.fieldLabel}>Phone:</span>
                  <p className={styles.fieldValue}>
                    {selectedQuery.phone ? (
                      <a href={`tel:${selectedQuery.phone}`}>
                        {selectedQuery.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>

                <div className={styles.fieldBox}>
                  <span className={styles.fieldLabel}>Status:</span>
                  <p className={styles.fieldValue}>
                    {getStatusBadge(selectedQuery.status)}
                  </p>
                </div>

                <div className={`${styles.fieldBox} ${styles.longField}`}>
                  <span className={styles.fieldLabel}>Subject:</span>
                  <p className={styles.fieldValue}>
                    {selectedQuery.subject || "—"}
                  </p>
                </div>

                <div className={`${styles.fieldBox} ${styles.longField}`}>
                  <span className={styles.fieldLabel}>Message:</span>
                  <p className={styles.fieldValue}>
                    {selectedQuery.message || "—"}
                  </p>
                </div>

                <div className={styles.fieldBox}>
                  <span className={styles.fieldLabel}>Submitted On:</span>
                  <p className={styles.fieldValue}>
                    {formatDate(selectedQuery.createdAt)}
                  </p>
                </div>

                {selectedQuery.repliedAt && (
                  <div className={styles.fieldBox}>
                    <span className={styles.fieldLabel}>Replied On:</span>
                    <p className={styles.fieldValue}>
                      {formatDate(selectedQuery.repliedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update Section */}
              <div className={styles.statusUpdateSection}>
                <h3>Update Status</h3>
                <div className={styles.statusButtons}>
                  {["new", "read", "replied", "archived"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusUpdate(selectedQuery._id, status)
                      }
                      className={`${styles.statusBtn} ${
                        selectedQuery.status === status ? styles.active : ""
                      }`}
                      disabled={selectedQuery.status === status}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              {/* <a
                href={`mailto:${selectedQuery.email}?subject=Re: ${
                  selectedQuery.subject || "Your Query"
                }`}
                className={styles.replyBtn}
              >
                📧 Reply via Email
              </a> */}
              <button
                onClick={() => setSelectedQuery(null)}
                className={styles.closeModalBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactQueries;