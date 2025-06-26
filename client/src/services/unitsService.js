import api from "./api";

const UNITS_PATH = "/unit";

const getAllUnits = async () => {
  try {
    const response = await api.get(`${UNITS_PATH}/get-all-units`);

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

export { getAllUnits };
