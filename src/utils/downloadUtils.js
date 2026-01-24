import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";

import { PROGRAM_NAME_MAP, STATUS_LABELS } from "../constants/programConstants";

/**
 * Format date (Mongo ISO string or Firestore legacy)
 */
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

/**
 * Download applications as Excel file
 */
export const downloadExcel = (applications, statusFilter = "all") => {
  if (!applications.length) {
    toast.error("No applications to download");
    return;
  }

  const toastId = toast.loading("Generating Excel file...");

  try {
   const exportData = applications.map((app, index) => ({
  "S.No": index + 1,
  "Reference ID": app.referenceId,
  "Full Name": app.fullName,
  "Email": app.email || "N/A",
  "Phone": app.phone,
  "City": app.city || "N/A",
  "State": app.state || "N/A",
  "Date of Birth": app.dateOfBirth || "N/A",
  "Qualification": app.qualification || "N/A",
  "Institution": app.institution || "N/A",
  "Year of Completion": app.yearOfCompletion || "N/A",
  "CGPA": app.cgpa || "N/A",
  "Experience": app.experience || "N/A",
  "Program": PROGRAM_NAME_MAP[app.program] || app.program,
  "Status": STATUS_LABELS[app.status] || "Submitted",
  "Applied On": formatDate(app.createdAt),
  "Last Updated": formatDate(app.updatedAt),
  "Resume File": app.resume?.fileName || "N/A",
  "Resume URL": app.resume?.url || "N/A",
  "Motivation": app.motivation || "N/A",
}));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 22 },
      { wch: 50 },
      { wch: 40 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

    const statusSuffix = statusFilter !== "all" ? `_${statusFilter}` : "";
    const dateStr = new Date().toISOString().split("T")[0];

    XLSX.writeFile(
      workbook,
      `Applications${statusSuffix}_${dateStr}.xlsx`
    );

    toast.success("📊 Excel downloaded", { id: toastId });
  } catch (err) {
    console.error(err);
    toast.error("Failed to download Excel", { id: toastId });
  }
};

/**
 * Download all resumes as ZIP
 */
export const downloadResumesZip = async (applications, statusFilter = "all") => {
  if (!applications.length) {
    toast.error("No resumes to download");
    return;
  }

  const toastId = toast.loading("Downloading resumes...");

  try {
    const zip = new JSZip();
    const folder = zip.folder("Resumes");

    let completed = 0;

    await Promise.all(
      applications.map(async (app, index) => {
        if (!app.resume?.url) return;

        const res = await fetch(app.resume.url);
        const blob = await res.blob();

        const ext =
          app.resume.fileName?.split(".").pop() ||
          blob.type.includes("pdf")
            ? "pdf"
            : "docx";

        const safeName = app.fullName.replace(/[^a-zA-Z0-9]/g, "_");
        folder.file(`${index + 1}_${safeName}.${ext}`, blob);

        completed++;
        toast.loading(`Downloading ${completed}/${applications.length}`, {
          id: toastId,
        });
      })
    );

    const content = await zip.generateAsync({ type: "blob" });

    const dateStr = new Date().toISOString().split("T")[0];
    saveAs(
      content,
      `Resumes_${statusFilter !== "all" ? statusFilter + "_" : ""}${dateStr}.zip`
    );

    toast.success("✅ ZIP downloaded", { id: toastId });
  } catch (err) {
    console.error(err);
    toast.error("Failed to download resumes", { id: toastId });
  }
};

/**
 * Download single resume
 */
export const downloadSingleResume = (application) => {
  try {
    if (!application?.resume?.url) {
      throw new Error("Resume not available");
    }

    const { url, fileName } = application.resume;

    triggerDownload(url, fileName || url.split("/").pop());
  } catch (err) {
    console.error("Resume download error:", err);
    alert("Resume not available");
  }
};

const triggerDownload = (url, fileName) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
