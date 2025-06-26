import { useEffect, useState } from "react";
import styles from "./css/Units.module.css";
import { getAllUnits } from "../../services/unitsService";
import { getUserDetails } from "../../services/userService";
import RoleRestricted from "../ui/RoleRestricted";

const Units = ({ user }) => {
  const [allUnits, setAllUnits] = useState([]);
  const [units, setUnits] = useState([]);
  useEffect(() => {
    const fetchUnits = async () => {
      const unitsFetched = await getAllUnits();

      if (unitsFetched.data.success) {
        setAllUnits(unitsFetched.data.data);

        const myUnits = await getUserDetails(user.role, user.id);
        if (myUnits.data.data.units) {
          setUnits(myUnits.data.data.units);
        }
      }
    };
    fetchUnits();
  }, []);
  return (
    <div className={styles.hero}>
      <div className={styles.heroLeft}>
        <h3>Units</h3>
        <div className={styles.searchBox}>
          <i className={`fa-solid fa-search ${styles.faSearch}`}></i>
          <input type="text" placeholder="search unit" />
          <i className={`fa-solid fa-x ${styles.faCancel}`}></i>
        </div>
        <div className={styles.unitsBox}>
          <div className={styles.unitsHeader}>
            <h4>Unit</h4>
            <h4>Unit ID</h4>
          </div>
          <div className={styles.units}>
            {allUnits.map((unit) => {
              return (
                <div key={unit._id} className={styles.unit}>
                  <div className={styles.unitDetails}>
                    <input type="checkbox" />
                    <p>{unit.unitName}</p>
                  </div>
                  <p>{unit.unitCode}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.heroRight}>
        <h3>My Units</h3>
        <div className={styles.myUnitsBox}>
          <RoleRestricted allowedRoles={["teacher"]}>
            <h4>Assigned</h4>
          </RoleRestricted>
          <RoleRestricted allowedRoles={["student"]}>
            <h4>Enrolled</h4>
          </RoleRestricted>
          <div className={styles.assigned}>
            {units.map((unit) => {
              return (
                <div key={unit.id} className={styles.assignedUnit}>
                  {unit.name}
                </div>
              );
            })}
          </div>
          <h4>Selected</h4>
          <div className={styles.assigned}>
            <p>No units selected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Units;
