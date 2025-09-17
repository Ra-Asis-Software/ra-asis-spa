import { useEffect, useState } from "react";
import styles from "./css/Units.module.css";
import { studentBar, teacherBar } from "./css/SideBarStyles.module.css";
import {
  createUnitRequest,
  enrollToUnit,
  getAllUnits,
} from "../../services/unitService";
import { getUserDetails } from "../../services/userService";
import RoleRestricted from "../ui/RoleRestricted";
import { useNavigate } from "react-router-dom";

const Units = ({ user }) => {
  const [allUnits, setAllUnits] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [unitsHolder, setUnitsHolder] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      //fetch all units
      const unitsFetched = await getAllUnits();

      if (unitsFetched) {
        const tempAllUnits = unitsFetched.data;

        //get units i already have
        const myUnits = await getUserDetails(user.role, user.id);
        if (myUnits.data.data.units) {
          const tempMyUnits = myUnits.data.data.units;

          setUnits(myUnits.data.data.units);
          //we want to exclude units that are already assigned to me
          const myUnitsCodes = new Set(tempMyUnits.map((unit) => unit.code));
          const allOtherUnits = tempAllUnits.filter(
            (unit) => !myUnitsCodes.has(unit.unitCode)
          );
          setAllUnits(allOtherUnits);
          setUnitsHolder(allOtherUnits);
        }
      }
    };
    fetchUnits();
  }, [trigger]);

  useEffect(() => {
    const handleSearchUnit = () => {
      if (searchParam === "") {
        setAllUnits(unitsHolder);
      } else {
        const searchResults = unitsHolder.filter((unit) => {
          return (
            unit.unitCode.toLowerCase().includes(searchParam.toLowerCase()) ||
            unit.unitName.toLowerCase().includes(searchParam.toLowerCase())
          );
        });

        setAllUnits(searchResults);
      }
    };
    handleSearchUnit();
  }, [searchParam]);

  const handleSelectUnit = (e, unit) => {
    //check the current number of units first
    const totalUnits = units.length + selectedUnits.length;
    if (totalUnits >= 5 && user.role === "teacher") {
      if (e.target.checked) {
        setMessage("You can only have a maximum of 5 units");
        setTimeout(() => {
          setMessage("");
        }, 5000);
      }

      e.target.checked = false;
    } else {
      //if unit already is selected, do not add
      if (e.target.checked) {
        if (!selectedUnits.includes(unit.unitCode)) {
          setSelectedUnits((prev) => [...prev, unit.unitCode]);
        }
      }
    }
    if (!e.target.checked) {
      //if target is unchecked, check if it exists first
      if (selectedUnits.includes(unit.unitCode)) {
        const tempArray = selectedUnits.filter(
          (item) => item !== unit.unitCode
        );
        setSelectedUnits(tempArray);
      }
    }
  };

  const handleEnrollToUnit = async () => {
    await enrollToUnit(selectedUnits);
    setSelectedUnits([]);
    setTrigger(!trigger);
  };

  // Handle creating unit assignment requests
  const handleRequestUnits = async (unitCodes) => {
    try {
      setLoading(true);
      for (const unitCode of unitCodes) {
        await createUnitRequest(unitCode);
      }
      setMessage("");
      setSuccessMessage("Unit assignment request submitted successfully!");
      setSelectedUnits([]);
      setTrigger(!trigger);
    } catch (error) {
      setSuccessMessage("");
      setMessage(error.message || "Failed to submit unit requests");
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      setSuccessMessage("");
      setMessage("");
    }, 5000);
  };

  const handleClickUnit = async (unit) => {
    localStorage.setItem("focusUnit", JSON.stringify(unit));
    navigate("/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        <h3>Units</h3>
        <div className={styles.searchBox}>
          <i className={`fa-solid fa-search ${styles.faSearch}`}></i>
          <input
            type="text"
            placeholder="search unit"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
          <i
            className={`fa-solid fa-xmark ${styles.faCancel}`}
            onClick={() => setSearchParam("")}
          ></i>
        </div>
        <div className={styles.unitsBox}>
          <div className={styles.unitsHeader}>
            <h4>Unit</h4>
            <h4>Unit ID</h4>
          </div>
          <div className={styles.units}>
            {allUnits.map((unit) => {
              return (
                <div
                  key={unit._id}
                  className={`${styles.unit} ${
                    user.role === "teacher" ? styles.teacherUnit : ""
                  }`}
                >
                  <div className={styles.unitDetails}>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectUnit(e, unit)}
                      id={`${unit.unitCode}`}
                    />
                    <p>{unit.unitName}</p>
                  </div>
                  <p>{unit.unitCode}</p>
                </div>
              );
            })}
            {allUnits.length === 0 && (
              <p className={styles.noUnitsMessage}>
                No units available at the moment!
              </p>
            )}
          </div>

          {selectedUnits.length !== 0 && (
            <>
              <RoleRestricted allowedRoles={["teacher"]}>
                <button
                  onClick={() => handleRequestUnits(selectedUnits)}
                  className={`${styles.requestUnits} ${teacherBar} ${styles.teacherBtn}`}
                >
                  {loading ? "Requesting..." : "Request Units"}
                </button>
              </RoleRestricted>
              <RoleRestricted allowedRoles={["student"]}>
                <button
                  onClick={handleEnrollToUnit}
                  className={`${styles.requestUnits} ${studentBar} ${styles.studentBtn}`}
                >
                  Enroll
                </button>
              </RoleRestricted>
            </>
          )}
          {message !== "" && <p className={styles.pRed}>{message}</p>}
          {successMessage && <p className={styles.pGreen}>{successMessage}</p>}
        </div>
      </div>
      <div className={styles.containerRight}>
        <h3>Your Units</h3>
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
                <button
                  key={unit.id}
                  className={`${styles.assignedUnit} ${
                    user.role === "student"
                      ? studentBar
                      : user.role === "teacher"
                      ? teacherBar
                      : ""
                  }`}
                  onClick={() => handleClickUnit(unit)}
                >
                  {unit.name}
                </button>
              );
            })}
            {units.length === 0 && <p>You don't have any units yet</p>}
          </div>
          <h4>Selected</h4>
          <div className={styles.assigned}>
            {selectedUnits.length === 0 ? (
              <p>No units selected</p>
            ) : (
              selectedUnits.map((unit) => {
                return (
                  <div
                    key={unit}
                    className={`${styles.selectedUnit} ${
                      user.role === "student"
                        ? studentBar
                        : user.role === "teacher"
                        ? teacherBar
                        : ""
                    }`}
                  >
                    {unit}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Units;
