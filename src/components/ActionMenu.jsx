// components/ActionMenu.jsx
import React, { useRef, useEffect } from "react";
import styles from "../pages/Dashboard/Dashboard.module.css";
import { APPLICATION_STATUS } from "../constants/programConstants";

const ActionMenu = ({
  application,
  isActive,
  onToggle,
  onStatusChange,
  onClose,
}) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isActive, onClose]);

  const currentStatus = application.status || APPLICATION_STATUS.SUBMITTED;

  const actions = [
    {
      label: "🕵️ Mark Reviewed",
      value: APPLICATION_STATUS.REVIEWED,
      color: "#17A2B8",
      disabled: currentStatus === APPLICATION_STATUS.REVIEWED,
    },
    {
      label: "✅ Shortlist",
      value: APPLICATION_STATUS.SHORTLISTED,
      color: "#28A745",
      disabled: currentStatus === APPLICATION_STATUS.SHORTLISTED,
    },
    {
      label: "❌ Reject",
      value: APPLICATION_STATUS.REJECTED,
      color: "#DC3545",
      disabled: currentStatus === APPLICATION_STATUS.REJECTED,
    },
    {
      label: "⏸️ Put On Hold",
      value: APPLICATION_STATUS.HOLDED,
      color: "#FFA500",
      disabled: currentStatus === APPLICATION_STATUS.HOLDED,
    },
  ];

  const handleActionClick = async (actionValue) => {
    if (onStatusChange) {
      await onStatusChange(application._id || application.id, actionValue);
    }
  };

  return (
    <div className={styles.actionMenuWrapper} ref={menuRef}>
      <button
        className={styles.actionMenuBtn}
        onClick={onToggle}
        title="More actions"
        aria-expanded={isActive}
        aria-haspopup="true"
      >
        ⚙️ Actions {isActive ? "▲" : "▼"}
      </button>

      {isActive && (
        <div className={styles.actionMenu} role="menu">
          <div className={styles.actionMenuHeader}>Change Status</div>

          {actions.map((action) => (
            <button
              key={action.value}
              className={styles.actionMenuItem}
              onClick={() => handleActionClick(action.value)}
              disabled={action.disabled}
              role="menuitem"
              style={{
                color: action.disabled ? "#999" : action.color,
                cursor: action.disabled ? "not-allowed" : "pointer",
              }}
            >
              {action.label}
              {action.disabled && " (Current)"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;