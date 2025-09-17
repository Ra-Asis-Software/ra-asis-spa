import { useState } from "react";
import styles from "./UsersTable.module.css";
import Modal from "../../ui/Modal";
import {
  deleteUser,
  toggleUserActivation,
} from "../../../services/adminService";

const UsersTable = ({
  users,
  onEditUser,
  onUserUpdated,
  loading,
  pagination,
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});

  const handleToggleActivation = async (user) => {
    setLoadingStates((prev) => ({ ...prev, [user._id]: "activation" }));

    try {
      const action = user.isActive ? "deactivate" : "activate";
      await toggleUserActivation(user._id, action);
      onUserUpdated(); // Refresh the user list
    } catch (err) {
      console.error("Failed to toggle user activation:", err);
      // Show error in result modal
      setResultMessage(
        err.response?.data?.message || "Failed to update user status"
      );
      setShowResultModal(true);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [user._id]: null }));
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setLoadingStates((prev) => ({ ...prev, [selectedUser._id]: "deletion" }));

    try {
      const response = await deleteUser(selectedUser._id);
      onUserUpdated(); // Refresh the user list

      // Show success modal and close delete modal
      setResultMessage(
        response.data?.message || "The user was deleted successfully!"
      );
      setIsSuccess(true);
      setShowResultModal(true);
      setDeleteModalOpen(false);
    } catch (err) {
      // Show error in result modal
      setResultMessage(err.response?.data?.message || "Failed to delete user");
      setIsSuccess(false);
      setShowResultModal(true);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [selectedUser._id]: null }));
      setSelectedUser(null);
    }
  };

  // Handle closing result modal
  const closeResultModal = () => {
    setShowResultModal(false);
    setResultMessage("");
    setIsSuccess(true);
  };

  return (
    <div className={styles.tableContainer}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <video
            src="/assets/spin_loader.mp4"
            autoPlay
            muted
            loop
            className={styles.containerLoader}
          />
          <span>Loading users...</span>
        </div>
      ) : (
        <>
          <div className={`${styles.tableSummary} ${styles.tableHelpTexts}`}>
            *Showing page {currentPage} of {totalPages} pages*
          </div>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className={styles.noWrap}>Created By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noUsers}>
                    No users found, try refreshing...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className={`${styles.name} ${styles.noWrap}`}>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>
                      <a
                        href={`mailto:${user.email}`}
                        className={styles.emailLink}
                      >
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <span className={styles.role}>
                        {user.role?.charAt(0).toUpperCase() +
                          user.role?.slice(1)}
                      </span>
                    </td>
                    <td>
                      {user.createdBy
                        ? `${user.createdBy.firstName} ${user.createdBy.lastName}`
                        : "System"}
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          user.isActive ? styles.active : styles.inactive
                        }`}
                        onClick={() => handleToggleActivation(user)}
                        disabled={loadingStates[user._id]}
                        title={
                          user.isActive ? "Deactivate user" : "Activate user"
                        }
                      >
                        {loadingStates[user._id] === "activation"
                          ? "Processing..."
                          : user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsCell}>
                        <button
                          onClick={() => onEditUser(user)}
                          className={styles.editButton}
                          disabled={loadingStates[user._id]}
                        >
                          <i className="fa-solid fa-edit" title="Edit user"></i>
                        </button>

                        <button
                          onClick={() => handleToggleActivation(user)}
                          className={
                            user.isActive
                              ? styles.activateButton
                              : styles.deactivateButton
                          }
                          disabled={loadingStates[user._id]}
                        >
                          {loadingStates[user._id] === "activation" ? (
                            <video
                              src="/assets/spin_loader.mp4"
                              autoPlay
                              muted
                              loop
                              className={styles.buttonLoader}
                            />
                          ) : user.isActive ? (
                            <i
                              className="fa-solid fa-user-check"
                              title="Deactivate user"
                            ></i>
                          ) : (
                            <i
                              className="fa-solid fa-user-slash"
                              title="Activate user"
                            ></i>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteClick(user)}
                          className={styles.deleteButton}
                          disabled={loadingStates[user._id]}
                          title="Delete user"
                        >
                          {loadingStates[user._id] === "deletion" ? (
                            <video
                              src="/assets/spin_loader.mp4"
                              autoPlay
                              muted
                              loop
                              className={styles.buttonLoader}
                            />
                          ) : (
                            <i className="fa-solid fa-trash"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${
                      currentPage === page ? styles.active : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          <div
            className={`${styles.rotateScreenText} ${styles.tableHelpTexts}`}
          >
            <p>*Rotate screen to view full table*</p>
          </div>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
          >
            <div className={styles.deleteModal}>
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete user{" "}
                <strong>
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </strong>
                ? This action cannot be undone.
              </p>
              <div className={styles.deleteModalActions}>
                <button
                  onClick={handleConfirmDelete}
                  className={styles.confirmDeleteButton}
                  disabled={loadingStates[selectedUser?._id] === "deletion"}
                >
                  {loadingStates[selectedUser?._id] === "deletion"
                    ? "Deleting..."
                    : "Delete User"}
                </button>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className={styles.cancelDeleteButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>

          {/* Delete Result Modal */}
          <Modal isOpen={showResultModal} onClose={closeResultModal}>
            <div className={styles.resultModal}>
              <h3
                className={
                  isSuccess ? styles.successHeading : styles.errorHeading
                }
              >
                <i
                  className={
                    isSuccess
                      ? "fa-solid fa-circle-check"
                      : "fa-solid fa-circle-exclamation"
                  }
                />
                {isSuccess ? "Operation Completed" : "Operation Failed"}
              </h3>
              <p
                className={
                  isSuccess ? styles.successMessage : styles.errorMessage
                }
              >
                {resultMessage}
              </p>
              <div className={styles.resultModalActions}>
                <button
                  onClick={closeResultModal}
                  className={styles.modalCloseBtn}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default UsersTable;
