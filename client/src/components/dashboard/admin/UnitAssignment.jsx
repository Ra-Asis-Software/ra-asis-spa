import { useState, useEffect } from "react";
import styles from "./UnitAssignment.module.css";
import modalStyles from "./UsersTable.module.css";
import extraModalStyles from "./UnitRequestsTable.module.css";
import {
  assignUnit,
  getAvailableStudents,
  getAvailableTeachers,
  multipleAssignUnit,
} from "../../../services/unitService";
import Modal from "../../ui/Modal";

const UnitAssignment = ({ units, onAssignmentComplete }) => {
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);

  // Ensure units is always an array
  const safeUnits = Array.isArray(units) ? units : [];

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      const [teachersResponse, studentsResponse] = await Promise.all([
        getAvailableTeachers(),
        getAvailableStudents(),
      ]);

      setAvailableTeachers(teachersResponse.teachers || []);
      setAvailableStudents(studentsResponse.students || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Filter users who are not already in all selected units
  const getFilteredUsers = () => {
    const allUsers = [...availableTeachers, ...availableStudents];

    if (selectedUnits.length === 0) {
      // If no units selected, show all available users
      return allUsers
        .filter((user) => user && user.bio) // Filter out invalid users
        .map((user) => ({
          ...user,
          displayName: `${user.bio.firstName} ${user.bio.lastName} (${user.bio.role})`,
        }));
    }

    return allUsers
      .filter((user) => user && user.bio) // Filter out invalid users
      .filter((user) => {
        // Check if user is already in all selected units
        const userUnitIds = user.units
          ? user.units.map((unit) => unit._id.toString())
          : [];
        const isInAllSelectedUnits = selectedUnits.every((unitId) =>
          userUnitIds.includes(unitId.toString())
        );

        return !isInAllSelectedUnits;
      })
      .map((user) => ({
        ...user,
        displayName: `${user.bio.firstName} ${user.bio.lastName} (${user.bio.role})`,
      }));
  };

  const handleUnitSelection = (unitId) => {
    setSelectedUnits((prev) =>
      prev.includes(unitId)
        ? prev.filter((id) => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssignUsers = async () => {
    if (selectedUnits.length === 0 || selectedUsers.length === 0) {
      setResultMessage("Please select at least one unit and one user");
      setIsSuccess(false);
      setShowResultModal(true);
      return;
    }

    setLoading(true);

    try {
      // Get the actual user IDs from the bio field
      const selectedUserRecords = filteredUsers.filter((user) =>
        selectedUsers.includes(user._id)
      );

      const userIds = selectedUserRecords.map((user) => user.bio._id);

      // Prepare assignment data
      const assignmentData = {
        unitIds: selectedUnits,
        userIds: userIds,
      };

      await multipleAssignUnit(assignmentData);

      setResultMessage("Users assigned to units successfully!");
      setIsSuccess(true);
      setShowResultModal(true);
      setSelectedUnits([]);
      setSelectedUsers([]);
    } catch (err) {
      setResultMessage(err.message || "Failed to assign users to units");
      setIsSuccess(false);
      setShowResultModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setResultMessage("");
    setIsSuccess(true);
    onAssignmentComplete();
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className={styles.unitAssignmentContainer}>
      <div className={styles.assignmentGrid}>
        {/* Units Column */}
        <div className={styles.column}>
          <h4>Available Units ({safeUnits.length})</h4>
          <div className={styles.listContainer}>
            {safeUnits.map((unit) => (
              <div key={unit._id} className={styles.labelInputGroup}>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={selectedUnits.includes(unit._id)}
                    onChange={() => handleUnitSelection(unit._id)}
                  />
                  <span>
                    {unit.unitCode} - {unit.unitName}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Users Column */}
        <div className={styles.column}>
          <h4>Available Users ({filteredUsers.length})</h4>
          <div className={styles.listContainer}>
            {filteredUsers.map((user) => (
              <div key={user._id} className={styles.labelInputGroup}>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                  />
                  <span>{user.displayName}</span>
                  {user.bio.role === "teacher" && (
                    <span className={styles.unitCount}>
                      ({user.units ? user.units.length : 0}/5 units)
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      <div className={styles.selectionSummary}>
        <p>
          Selected: {selectedUnits.length} unit(s), {selectedUsers.length}{" "}
          user(s)
        </p>
      </div>

      {/* Action Button */}
      <div className={styles.actionSection}>
        <button
          onClick={handleAssignUsers}
          className={styles.assignButton}
          disabled={
            loading || selectedUnits.length === 0 || selectedUsers.length === 0
          }
        >
          {loading
            ? "Adding Users..."
            : `Add ${selectedUsers.length} User(s) to ${selectedUnits.length} Unit(s)`}
        </button>
      </div>

      {/* Result Modal */}
      <Modal isOpen={showResultModal} onClose={closeResultModal}>
        <div className={modalStyles.resultModal}>
          <h3
            className={
              isSuccess
                ? extraModalStyles.successHeading
                : extraModalStyles.errorHeading
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
              isSuccess
                ? extraModalStyles.successMessage
                : extraModalStyles.errorMessage
            }
          >
            {resultMessage}
          </p>
          <div className={modalStyles.resultModalActions}>
            <button
              onClick={closeResultModal}
              className={modalStyles.modalCloseBtn}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnitAssignment;
