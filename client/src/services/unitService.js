import api from "./api";

const UNITS_PATH = "/unit";
const addUnit = async () => {
  try {
    const response = await api.post(`${UNITS_PATH}/add-unit`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const assignUnit = async () => {
  try {
    const response = await api.patch(`${UNITS_PATH}/assign-unit`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const deleteUnit = async () => {
  try {
    const response = await api.delete(`${UNITS_PATH}/delete-unit`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const getStudentsOfUnit = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/get-students-by-unit`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const getTeachersOfUnit = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/get-teachers-by-unit`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const getAssignmentSummary = async (unitCode) => {
  try {
    const response = await api.get(
      `${UNITS_PATH}/assignment-summary/${unitCode}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const getAllUnits = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/get-all-units`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const enrollToUnit = async (unitCodes) => {
  try {
    const response = await api.patch(`${UNITS_PATH}/enroll-unit`, {
      unitCodes,
    });

    return response;
  } catch (error) {
    throw error.response?.data || { message: "Failed to enroll to units" };
  }
};

export {
  addUnit,
  assignUnit,
  deleteUnit,
  getStudentsOfUnit,
  getTeachersOfUnit,
  getAssignmentSummary,
  getAllUnits,
  enrollToUnit,
};
