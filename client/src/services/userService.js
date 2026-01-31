import api from "./api";

const USERS_PATH = "/users";

export const getUserDetails = async (role, id) => {
  try {
    const response = await api.get(`${USERS_PATH}/${role}/${id}`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const getParentDetails = async (parentId) => {
  try {
    const response = await api.get(`${USERS_PATH}/parent/${parentId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data };
    }
    return { error: "Failed to fetch parent details" };
  }
};

export const linkStudentToParent = async (parentId, studentId) => {
  try {
    const response = await api.patch(
      `${USERS_PATH}/parent/${parentId}/link-student`,
      { studentId }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data };
    }
    return { error: "Failed to link student" };
  }
};

export const getAllStudents = async (search = "") => {
  try {
    const response = await api.get(`${USERS_PATH}/students?search=${search}`);
    return response.data;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const searchStudentByEmail = async (email) => {
  try {
    const response = await api.get(
      `${USERS_PATH}/search-student?email=${email}`
    );
    return response.data;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const sendUserInquiry = async (data) => {
  try {
    const response = await api.post(`${USERS_PATH}/inquiry`, data);
    return response;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const downloadFile = async (filename, originalName = null) => {
  try {
    // Since files are served statically at /uploads, we create a direct link
    const fileUrl = `/uploads/${filename}`;

    // Fetch the file
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`File not found or server error: ${response.status}`);
    }

    // Create blob from response
    const blob = await response.blob();

    // Create object URL
    const url = window.URL.createObjectURL(blob);

    // Create temporary link element
    const link = document.createElement("a");
    link.href = url;

    // Set download filename (use original name if provided)
    const downloadName = originalName || filename;
    link.download = downloadName;

    // Append to body, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up URL object
    window.URL.revokeObjectURL(url);

    // Optional: Log the download for analytics
    console.log(`Downloaded: ${downloadName}`);

    return {
      success: true,
      message: "File downloaded successfully",
      filename: downloadName,
      url: fileUrl,
    };
  } catch (error) {
    console.error("Download service error:", error);

    return {
      success: false,
      error: "Failed to download file",
      details: error.message || "Network error or file not found",
    };
  }
};

// Alternative: Simple URL generator for direct linking
export const getFileUrl = (filename) => {
  if (!filename) return null;

  // Remove any path traversal attempts
  const safeFilename = filename.replace(/\.\.\//g, "");

  return `/uploads/${safeFilename}`;
};

// For direct anchor tag usage (simplest approach)
export const downloadFileDirect = (filename, originalName = null) => {
  const fileUrl = getFileUrl(filename);
  if (!fileUrl) return null;

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = originalName || filename;
  link.click();

  return true;
};
