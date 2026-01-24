// components/SearchAndFilter.jsx
import React from "react";
import styles from "../pages/Dashboard/Dashboard.module.css";
import { PROGRAM_OPTIONS, STATUS_FILTER_OPTIONS } from "../constants/programConstants";

const SearchAndFilter = ({
  search,
  setSearch,
  program,
  setProgram,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className={styles.filtersSection}>
      {/* Search Input */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="🔍 Search by name, email, phone, city..."
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

      {/* Filters Row */}
      <div className={styles.filtersRow}>
        {/* Program Filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="programFilter">Program:</label>
          <select
            id="programFilter"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className={styles.filterSelect}
          >
            {PROGRAM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className={styles.filterGroup}>
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Button
        {(program || statusFilter !== "all" || search) && (
          <button
            className={styles.resetBtn}
            onClick={() => {
              setProgram("");
              setStatusFilter("all");
              setSearch("");
            }}
            title="Reset all filters"
          >
            🔄 Reset Filters
          </button>
        )} */}
      </div>
    </div>
  );
};

export default SearchAndFilter;