import api from "./api";

const ASSIGNMENTS_PATH = "/assignments";

const createAssignment = async (data) => {
  try {
    const response = await api.post(`${ASSIGNMENTS_PATH}`, data);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        error: error.response.data.error.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const getAssignmentsForUnit = async (unitId) => {
  try {
    const response = await api.get(`${ASSIGNMENTS_PATH}/${unitId}/assignments`);

    return response;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch assignments for the unit",
      }
    );
  }
};

const getAssignmentDetails = async (assignmentId) => {
  try {
    const response = await api.get(
      `${ASSIGNMENTS_PATH}/${assignmentId}/details`
    );

    return response;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch assignment details" }
    );
  }
};

const deleteAssignment = async (assignmentId) => {
  try {
    const response = await api.delete(`${ASSIGNMENTS_PATH}/${assignmentId}`);

    return response;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete assignment" };
  }
};

const getAssignmentSubmissions = async (assignmentId) => {
  try {
    const response = await api.get(
      `${ASSIGNMENTS_PATH}/${assignmentId}/submissions`
    );

    return response;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to get assignment submissions",
      }
    );
  }
};

export default {
  createAssignment,
  getAssignmentsForUnit,
  getAssignmentDetails,
  deleteAssignment,
  getAssignmentSubmissions,
};
