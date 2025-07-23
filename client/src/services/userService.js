import api from "./api";

const USERS_PATH = "/users";
const getUserDetails = async (role, id) => {
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

const getParentDetails = async (parentId) => {
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

const linkStudentToParent = async (parentId, studentId) => {
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

const getAllStudents = async (search = "") => {
  try {
    const response = await api.get(`${USERS_PATH}/students?search=${search}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        error: error.response.data.message || error.response.data.error.message,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const searchStudentByEmail = async (email) => {
  try {
    const response = await api.get(
      `${USERS_PATH}/search-student?email=${email}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        error: error.response.data.message || error.response.data.error.message,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export {
  getUserDetails,
  getParentDetails,
  linkStudentToParent,
  getAllStudents,
  searchStudentByEmail,
};
