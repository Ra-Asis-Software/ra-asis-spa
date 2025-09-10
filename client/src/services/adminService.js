import api from "./api";

const ADMIN_PATH = "/admin";

export const createUser = (userData) => api.post(ADMIN_PATH, userData);

export const getUsers = (params = {}) => api.get(ADMIN_PATH, { params });

export const updateUser = (userId, userData) =>
  api.put(`${ADMIN_PATH}/updateuser/${userId}`, userData);

export const toggleUserActivation = async (userId, action) => {
  const { data } = await api.patch(
    `${ADMIN_PATH}/toggle-activation/${userId}`,
    {
      action,
    }
  );
  return data;
};

export const deleteUser = (userId) =>
  api.delete(`${ADMIN_PATH}/deleteuser/${userId}`);

export default {
  createUser,
  getUsers,
  updateUser,
  toggleUserActivation,
  deleteUser,
};
