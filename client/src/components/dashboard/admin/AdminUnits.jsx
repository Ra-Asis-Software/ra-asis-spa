import { useState, useEffect } from "react";
import styles from "./AdminUnits.module.css";
import sharedStyles from "./Users.module.css";
import { getUnitRequests, getAllUnits } from "../../../services/unitService";
import Modal from "../../ui/Modal";
import UnitsForm from "./UnitsForm";
import UnitRequestsTable from "./UnitRequestsTable";
import UnitsTable from "./UnitsTable";
import UnitAssignment from "./UnitAssignment";

const AdminUnits = () => {
  const [units, setUnits] = useState([]);
  const [unitRequests, setUnitRequests] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [unitsResponse, requestsResponse] = await Promise.all([
        getAllUnits(),
        getUnitRequests(),
      ]);

      setUnits(unitsResponse.data || []);
      setUnitRequests(requestsResponse.requests || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setUnits([]); // Ensure units is always an array
      setUnitRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUnit = () => {
    setEditingUnit(null);
    setIsFormModalOpen(true);
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = () => {
    setIsFormModalOpen(false);
    fetchData(); // Refresh data
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setEditingUnit(null);
  };

  if (loading) {
    return (
      <div className={sharedStyles.loadingContainer}>
        <video
          src="/assets/spin_loader.mp4"
          autoPlay
          muted
          loop
          className={sharedStyles.loadingVideo}
        />
      </div>
    );
  }

  return (
    <div className={styles.adminUnitsContainer}>
      <div className={sharedStyles.containerHeader}>
        <h2 className={sharedStyles.pageTitle}>Units Management</h2>
        <button
          className={sharedStyles.createButton}
          onClick={handleCreateUnit}
        >
          <i className="fa-solid fa-plus" /> Create New Unit
        </button>
      </div>

      {/* Unit Requests Table */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Pending Unit Assignment Requests
        </h3>
        <UnitRequestsTable
          requests={unitRequests}
          onRequestProcessed={fetchData}
        />
      </section>

      {/* Units Table */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>All Units</h3>
        <UnitsTable
          units={units}
          onEditUnit={handleEditUnit}
          onUnitUpdated={fetchData}
        />
      </section>

      {/* Unit Assignment */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Assign Users to Units</h3>
        <UnitAssignment units={units} onAssignmentComplete={fetchData} />
      </section>

      {/* Unit Form Modal */}
      <Modal isOpen={isFormModalOpen} onClose={handleFormCancel}>
        <UnitsForm
          unit={editingUnit}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          mode={editingUnit ? "edit" : "create"}
        />
      </Modal>
    </div>
  );
};

export default AdminUnits;
