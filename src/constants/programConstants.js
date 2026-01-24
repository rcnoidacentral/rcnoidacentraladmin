// constants/programConstants.js

export const PROGRAM_NAME_MAP = {
  "flexi-mou": "Flexi MOU",
  "b-voc": "B.Voc",
  "d-voc": "D.Voc",
  "nats": "NATS",
  "naps": "NAPS",
};

export const PROGRAM_ORDER = ["Flexi MOU", "B.Voc", "D.Voc", "NATS", "NAPS"];

export const PROGRAM_OPTIONS = [
  { value: "", label: "All Programs" },
  { value: "flexi-mou", label: "Flexi MOU" },
  { value: "b-voc", label: "B.Voc" },
  { value: "d-voc", label: "D.Voc" },
  { value: "nats", label: "NATS" },
  { value: "naps", label: "NAPS" },
];

// constants/statusConstants.js

// constants/statusConstants.js

export const APPLICATION_STATUS = {
  SUBMITTED: "submitted",
  REVIEWED: "reviewed",
  SHORTLISTED: "shortlisted",
  REJECTED: "rejected",
  HOLDED: "holded",
};

// Human-readable labels
export const STATUS_LABELS = {
  [APPLICATION_STATUS.SUBMITTED]: "Submitted",
  [APPLICATION_STATUS.REVIEWED]: "Reviewed",
  [APPLICATION_STATUS.SHORTLISTED]: "Shortlisted",
  [APPLICATION_STATUS.REJECTED]: "Rejected",
  [APPLICATION_STATUS.HOLDED]: "On Hold",
};

// Badge / UI colors
export const STATUS_COLORS = {
  [APPLICATION_STATUS.SUBMITTED]: "#6C757D",   // gray
  [APPLICATION_STATUS.REVIEWED]: "#17A2B8",    // blue
  [APPLICATION_STATUS.SHORTLISTED]: "#28A745", // green
  [APPLICATION_STATUS.REJECTED]: "#DC3545",    // red
  [APPLICATION_STATUS.HOLDED]: "#FFA500",      // orange
};

// Filters for dropdowns / tables
export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: APPLICATION_STATUS.SUBMITTED, label: "Submitted" },
  { value: APPLICATION_STATUS.REVIEWED, label: "Reviewed" },
  { value: APPLICATION_STATUS.SHORTLISTED, label: "Shortlisted" },
  { value: APPLICATION_STATUS.REJECTED, label: "Rejected" },
  { value: APPLICATION_STATUS.HOLDED, label: "On Hold" },
];
