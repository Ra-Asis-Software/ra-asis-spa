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
