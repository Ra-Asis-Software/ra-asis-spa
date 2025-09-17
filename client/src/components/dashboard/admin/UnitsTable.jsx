import { useState } from "react";
import styles from "./UnitsTable.module.css";
import tableStyles from "./UsersTable.module.css";
import Modal from "../../ui/Modal";
import { deleteUnit } from "../../../services/unitService";

const UnitsTable = ({ units, onEditUnit, onUnitUpdated }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});

  // Ensure units is always an array
  const safeUnits = Array.isArray(units) ? units : [];

  const handleDeleteClick = (unit) => {
    setSelectedUnit(unit);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUnit) return;

    setLoadingStates((prev) => ({ ...prev, [selectedUnit._id]: "deleting" }));

    try {
      await deleteUnit(selectedUnit._id);
      setResultMessage(`Unit ${selectedUnit.unitName} deleted successfully!`);
      setShowResultModal(true);
      setDeleteModalOpen(false);
      onUnitUpdated();
    } catch (err) {
      setResultMessage(err.message || "Failed to delete unit");
      setShowResultModal(true);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [selectedUnit._id]: null }));
      setSelectedUnit(null);
    }
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setResultMessage("");
  };

  if (safeUnits.length === 0) {
    return (
      <div className={styles.noUnits}>
        <p>No units found</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.unitsTableContainer} ${tableStyles.tableContainer}`}
    >
      <table className={`${styles.unitsTable} ${tableStyles.usersTable}`}>
        <thead>
          <tr>
            <th>Unit Code</th>
            <th>Unit Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {safeUnits.map((unit) => (
            <tr key={unit._id}>
              <td>{unit.unitCode}</td>
              <td>{unit.unitName}</td>
              <td>
                <div className={tableStyles.actionsCell}>
                  <button
                    onClick={() => onEditUnit(unit)}
                    className={tableStyles.editButton}
                    disabled={loadingStates[unit._id]}
                  >
                    <i className="fa-solid fa-edit" title="Edit unit" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(unit)}
                    className={tableStyles.deleteButton}
                    disabled={loadingStates[unit._id]}
                    title="Delete unit"
                  >
                    {loadingStates[unit._id] === "deleting" ? (
                      <video
                        src="/assets/spin_loader.mp4"
                        autoPlay
                        muted
                        loop
                        className={tableStyles.buttonLoader}
                      />
                    ) : (
                      <i className="fa-solid fa-trash" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className={tableStyles.deleteModal}>
          <h3>Confirm Deletion</h3>
          <p>
            Are you sure you want to delete the unit{" "}
            <strong>{selectedUnit?.unitName}</strong>? This action cannot be
            undone.
          </p>
          <div className={tableStyles.deleteModalActions}>
            <button
              onClick={handleConfirmDelete}
              className={tableStyles.confirmDeleteButton}
              disabled={loadingStates[selectedUnit?._id] === "deleting"}
            >
              {loadingStates[selectedUnit?._id] === "deleting"
                ? "Deleting..."
                : "Delete Unit"}
            </button>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className={tableStyles.cancelDeleteButton}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Result Modal */}
      <Modal isOpen={showResultModal} onClose={closeResultModal}>
        <div className={tableStyles.resultModal}>
          <h3>
            <i className="fa-solid fa-circle-check" />
            Operation Completed
          </h3>
          <p>{resultMessage}</p>
          <div className={tableStyles.resultModalActions}>
            <button
              onClick={closeResultModal}
              className={tableStyles.modalCloseBtn}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnitsTable;
