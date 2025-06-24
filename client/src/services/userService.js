import api from "./api";

const USERS_PATH = "/users";
const getUserDetails = async (role, id) => {
  try {
    const response = await api.get(`${USERS_PATH}/${role}/${id}`);

    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export { getUserDetails };
