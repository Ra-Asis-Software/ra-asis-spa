import { downloadFile, getFileUrl } from "../services/userService.js";

// Utility function to handle file downloads with better UX
export const handleFileDownload = async (fileData, onSuccess, onError) => {
  if (!fileData) {
    const error = { error: "No file data provided" };
    onError && onError(error);
    return error;
  }

  // Extract filename and original name
  const filename = fileData.filename || fileData.fileName;
  const originalName =
    fileData.originalname || fileData.originalName || fileData.fileName;

  if (!filename) {
    const error = { error: "No filename provided" };
    onError && onError(error);
    return error;
  }

  try {
    const result = await downloadFile(filename, originalName);

    if (result.success) {
      onSuccess && onSuccess(result);
      return result;
    } else {
      onError && onError(result);
      return result;
    }
  } catch (error) {
    const errorResult = {
      success: false,
      error: "Download failed",
      details: error.message,
    };
    onError && onError(errorResult);
    return errorResult;
  }
};

// Get the direct URL for a file (useful for displaying previews)
export const getDirectFileUrl = (file) => {
  if (!file) return null;

  const filename =
    typeof file === "string" ? file : file.filename || file.fileName;
  return getFileUrl(filename);
};

// Get display name for a file
export const getDisplayName = (file) => {
  if (!file) return "Unknown File";

  if (typeof file === "string") return file;

  return file.fileName || file.filename || file.originalname || "Download";
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "Unknown size";

  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Get file icon based on extension
export const getFileIcon = (filename) => {
  if (!filename) return "fa-file";

  const extension = filename.split(".").pop().toLowerCase();

  const iconMap = {
    pdf: "fa-file-pdf",
    doc: "fa-file-word",
    docx: "fa-file-word",
    txt: "fa-file-text",
    jpg: "fa-file-image",
    jpeg: "fa-file-image",
    png: "fa-file-image",
    gif: "fa-file-image",
    xls: "fa-file-excel",
    xlsx: "fa-file-excel",
    ppt: "fa-file-powerpoint",
    pptx: "fa-file-powerpoint",
    zip: "fa-file-archive",
    rar: "fa-file-archive",
    mp3: "fa-file-audio",
    mp4: "fa-file-video",
    mov: "fa-file-video",
    avi: "fa-file-video",
  };

  return iconMap[extension] || "fa-file";
};

// Check if file type is viewable in browser
export const isViewableInBrowser = (filename) => {
  if (!filename) return false;

  const extension = filename.split(".").pop().toLowerCase();
  const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "txt"];

  return viewableExtensions.includes(extension);
};
