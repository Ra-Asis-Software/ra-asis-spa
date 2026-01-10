import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SystemOverview.module.css";
import { animateCounter } from "../../../utils/counterUtils.js";
import { getUsers } from "../../../services/adminService.js";
import {
  getAllUnits,
  getPendingUnitRequestsCount,
} from "../../../services/unitService.js";

const SystemOverview = () => {
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [parentsCount, setParentsCount] = useState(0);
  const [unitsCount, setUnitsCount] = useState(0);
  const [pendingUnitRequestsCount, setPendingUnitRequestsCount] = useState(0);
  const [displayAllUsersCount, setDisplayAllUsersCount] = useState(0);
  const [displayTeachersCount, setDisplayTeachersCount] = useState(0);
  const [displayStudentsCount, setDisplayStudentsCount] = useState(0);
  const [displayParentsCount, setDisplayParentsCount] = useState(0);
  const [displayUnitsCount, setDisplayUnitsCount] = useState(0);
  const [displayPendingUnitRequestsCount, setDisplayPendingUnitRequestsCount] =
    useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch system overview counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);

        // Fetch total users count
        const totalUsersResponse = await getUsers();
        setAllUsersCount(totalUsersResponse.data.count);

        // Fetch total teachers count
        const teachersResponse = await getUsers({ role: "teacher" });
        setTeachersCount(teachersResponse.data.count);

        // Fetch total students count
        const studentsResponse = await getUsers({ role: "student" });
        setStudentsCount(studentsResponse.data.count);

        // Fetch total parents count
        const parentsResponse = await getUsers({ role: "parent" });
        setParentsCount(parentsResponse.data.count);

        // Fetch total units count
        const unitsResponse = await getAllUnits();
        setUnitsCount(unitsResponse.count || 0);

        // Fetch pending unit requests count
        const pendingRequestsResponse = await getPendingUnitRequestsCount();
        setPendingUnitRequestsCount(pendingRequestsResponse.count || 0);
      } catch (err) {
        setError("Failed to load system overview");
        console.error("Error fetching counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Animate counters when data loads
  useEffect(() => {
    if (!loading) {
      // Animate total users count
      animateCounter(allUsersCount, setDisplayAllUsersCount, 2000);

      // Animate teachers count
      animateCounter(teachersCount, setDisplayTeachersCount, 2000);

      // Animate students count
      animateCounter(studentsCount, setDisplayStudentsCount, 2000);

      // Animate parents count
      animateCounter(parentsCount, setDisplayParentsCount, 2000);

      // Animate units count
      animateCounter(unitsCount, setDisplayUnitsCount, 2000);

      // Animate pending unit requests count
      animateCounter(
        pendingUnitRequestsCount,
        setDisplayPendingUnitRequestsCount,
        2000
      );
    }
  }, [
    loading,
    allUsersCount,
    teachersCount,
    studentsCount,
    parentsCount,
    unitsCount,
    pendingUnitRequestsCount,
  ]);

  // Handle loading state
  if (loading) {
    return (
      <div className={styles.overviewContainer}>
        <h3 className={styles.sectionTitle}>System Overview</h3>
        <div className={styles.statCards}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className={styles.statCard}>
              <p className={styles.statLabel}>Loading...</p>
              <p className={styles.statValue}>-</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error states
  if (error) {
    return (
      <div className={styles.overviewContainer}>
        <h3 className={styles.sectionTitle}>System Overview</h3>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.overviewContainer}>
      <h3 className={styles.sectionTitle}>System Overview</h3>
      <div className={styles.statCards}>
        <div className={styles.statCard}>
          <h4 className={styles.statLabel}>Total System Users</h4>
          <p className={styles.statValue}>
            {displayAllUsersCount.toLocaleString()}
          </p>
          <Link to="/dashboard/users" className={styles.statLink}>
            Go To Users
          </Link>
        </div>
        <div className={styles.statCard}>
          <h4 className={styles.statLabel}>Number of Teachers</h4>
          <p className={styles.statValue}>
            {displayTeachersCount.toLocaleString()}
          </p>
          <Link to="/dashboard/users" className={styles.statLink}>
            View Teachers
          </Link>
        </div>
        <div className={styles.statCard}>
          <h4 className={styles.statLabel}>Number of Students</h4>
          <p className={styles.statValue}>
            {displayStudentsCount.toLocaleString()}
          </p>
          <Link to="/dashboard/users" className={styles.statLink}>
            View Students
          </Link>
        </div>
        <div className={styles.statCard}>
          <h4 className={styles.statLabel}>Number of Parents</h4>
          <p className={styles.statValue}>
            {displayParentsCount.toLocaleString()}
          </p>
          <Link to="/dashboard/users" className={styles.statLink}>
            View Parents
          </Link>
        </div>
        <div className={styles.statCard}>
          <h4 className={styles.statLabel}>Total Active Units</h4>
          <p className={styles.statValue}>
            {displayUnitsCount.toLocaleString()}
          </p>
          <Link to="/dashboard/units" className={styles.statLink}>
            Go To Units
          </Link>
        </div>
        <div className={styles.statCard}>
          <h4 className={styles.statLabel}>Pending Unit Requests</h4>
          <p className={styles.statValue}>
            {displayPendingUnitRequestsCount.toLocaleString()}
          </p>
          <Link to="/dashboard/units" className={styles.statLink}>
            View Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
