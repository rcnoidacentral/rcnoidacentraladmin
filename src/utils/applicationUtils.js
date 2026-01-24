
import apiService from "../api/adminApi.service";
import { toast } from "react-hot-toast";
import imagekitService from "../api/imageKit.service.js";

/**
 * Update application status
 */
export const updateApplicationStatus = async (
  applicationId,
  status,
  remarks = ""
) => {
  const toastId = toast.loading("Updating status...");
console.log("applicaion id", applicationId);
  try {
    await apiService.updateApplicationStatus(applicationId, {
      status,
      remarks,
    });

    toast.success(`Status updated to: ${status}`, { id: toastId });
    return true;
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("Failed to update status", { id: toastId });
    return false;
  }
};

/**
 * Upload offer letter (ImageKit)
 */
export const uploadOfferLetter = async (
  file,
  applicationId,
  candidateName
) => {
  const toastId = toast.loading("Uploading offer letter...");

  try {
    if (!file) throw new Error("No file selected");

    const safeName = candidateName.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `${safeName}_OfferLetter_${Date.now()}_${file.name}`;

    // 🔹 Upload to ImageKit
    const uploadResult = await imagekitService.uploadFile(
      file,
      fileName
    );
console.log("applkcation id", applicationId);
    // 🔹 Save URL in backend
    await apiService.attachOfferLetter(applicationId, {
      offerLetter: uploadResult,
    });

    toast.success("Offer letter uploaded successfully!", { id: toastId });
    return uploadResult;
  } catch (error) {
    console.error("Error uploading offer letter:", error);
    toast.error(error.message || "Failed to upload offer letter", {
      id: toastId,
    });
    return null;
  }
};

/**
 * Bulk update application statuses
 */
export const bulkUpdateStatus = async (applicationIds, status) => {
  const toastId = toast.loading(
    `Updating ${applicationIds.length} applications...`
  );

  try {
    await apiService.bulkUpdateStatus({
      applicationIds,
      status,
    });

    toast.success(`${applicationIds.length} applications updated`, {
      id: toastId,
    });
    return true;
  } catch (error) {
    console.error("Error in bulk update:", error);
    toast.error("Failed to update applications", { id: toastId });
    return false;
  }
};

/**
 * Delete application (soft delete)
 */
export const deleteApplication = async (applicationId) => {
  const toastId = toast.loading("Deleting application...");

  try {
    await apiService.deleteApplication(applicationId);

    toast.success("Application deleted", { id: toastId });
    return true;
  } catch (error) {
    console.error("Error deleting application:", error);
    toast.error("Failed to delete application", { id: toastId });
    return false;
  }
};
