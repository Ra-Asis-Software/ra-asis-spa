import axios from "axios";

// const URL = '/api/'
const token = localStorage.getItem("authToken");

const getUserDetails = async (role, id) => {
  try {
    const response = await axios.get(`/api/users/${role}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
