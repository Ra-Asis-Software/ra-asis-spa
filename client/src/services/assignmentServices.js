import api from "./api";

const ASSIGNMENTS_PATH = "/assignments";

const submitAssignment = async (data) => {
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

export { submitAssignment };
