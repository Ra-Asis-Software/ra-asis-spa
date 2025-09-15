import { useState, useEffect } from "react";
import styles from "./Users.module.css";
import { getUsers } from "../../../services/adminService";
import Modal from "../../ui/Modal";
import UsersTable from "./UsersTable";
import UserForm from "./UserForm";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    count: 0,
  });

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await getUsers({ page, limit });
      setUsers(response.data.users);
      setPagination({
        currentPage: page,
        totalPages: response.data.totalPages,
        count: response.data.count || response.data.users.length,
      });
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormModalOpen(false);
    fetchUsers(pagination.currentPage); // Refresh the current page
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setEditingUser(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <video
          src="/assets/spin_loader.mp4"
          autoPlay
          muted
          loop
          className={styles.loadingVideo}
        />
      </div>
    );
  }

  return (
    <div className={styles.usersContainer}>
      <div className={styles.containerHeader}>
        <h2 className={styles.pageTitle}>Users</h2>
        <button className={styles.createButton} onClick={handleCreateUser}>
          <i className="fa-solid fa-user-plus" /> Create New User
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <UsersTable
        users={users}
        onEditUser={handleEditUser}
        onUserUpdated={() => fetchUsers(pagination.currentPage)}
        loading={loading}
        pagination={pagination}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        handlePageChange={handlePageChange}
      />

      <Modal isOpen={isFormModalOpen} onClose={handleFormCancel}>
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          mode={editingUser ? "edit" : "create"}
        />
      </Modal>
    </div>
  );
};

export default Users;
