import api from "./api";

const UNITS_PATH = "/unit";
const addUnit = async (unitData) => {
  try {
    const response = await api.post(`${UNITS_PATH}/add-unit`, unitData);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "Sorry, an unexpected error occurred" };
    }
  }
};

const getAvailableTeachers = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/available-teachers`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch available teachers" }
    );
  }
};

const getAvailableStudents = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/available-students`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch available students" }
    );
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

const multipleAssignUnit = async (assignmentData) => {
  try {
    const response = await api.patch(
      `${UNITS_PATH}/multiple-assign-unit`,
      assignmentData
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "Sorry, an unexpected error occurred" };
    }
  }
};

const updateUnit = async (unitId, unitData) => {
  try {
    const response = await api.put(
      `${UNITS_PATH}/update-unit/${unitId}`,
      unitData
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "Sorry, an unexpected error occurred" };
    }
  }
};

const deleteUnit = async (unitId) => {
  try {
    const response = await api.delete(`${UNITS_PATH}/delete-unit/${unitId}`);

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

const getUnitsForUser = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/get-units-by-user`);

    return response;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

const getAllUnits = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/get-all-units`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "Sorry, an unexpected error occurred" };
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

const getUnitRequests = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/requests`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch unit requests" };
  }
};

const getPendingUnitRequestsCount = async () => {
  try {
    const response = await api.get(
      `${UNITS_PATH}/requests?countOnly=true&status=pending`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch pending unit requests count",
      }
    );
  }
};

const createUnitRequest = async (unitCode) => {
  try {
    const response = await api.post(`${UNITS_PATH}/requests`, { unitCode });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create unit request" };
  }
};

const approveUnitRequest = async (requestId) => {
  try {
    const response = await api.patch(
      `${UNITS_PATH}/requests/${requestId}/approve`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to approve request" };
  }
};

const rejectUnitRequest = async (requestId) => {
  try {
    const response = await api.patch(
      `${UNITS_PATH}/requests/${requestId}/reject`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reject request" };
  }
};

export {
  addUnit,
  getAvailableStudents,
  getAvailableTeachers,
  assignUnit,
  multipleAssignUnit,
  updateUnit,
  deleteUnit,
  getStudentsOfUnit,
  getTeachersOfUnit,
  getAssignmentSummary,
  getAllUnits,
  enrollToUnit,
  getUnitsForUser,
  getUnitRequests,
  getPendingUnitRequestsCount,
  createUnitRequest,
  approveUnitRequest,
  rejectUnitRequest,
};
