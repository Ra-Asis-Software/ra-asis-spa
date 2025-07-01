import api from "./api";

const PROGRESS_PATH = "/progress";
const getProgressData = async () => {
  try {
    const response = await api.get(`${PROGRESS_PATH}`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export { getProgressData };
