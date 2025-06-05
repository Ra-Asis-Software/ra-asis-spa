import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import RoleRestricted from "../components/ui/RoleRestricted";
import styles from "./Dashboard.module.css";
import StudentDashboard from "../components/dashboard/StudentDashboard";

const Dashboard = () => {
  const [user, setUser] = useState(null); // State to store data for a user
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate();

  // Fetch the user's data from the token
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Decode token to obtain user's data
        const decoded = jwtDecode(token);

        // Check if token is expired and logout if so
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }

        const { firstName, lastName, role } = decoded;

        // Set the user's data in state
        setUser({ firstName, lastName, role });
        setLoading(false);
      } catch (error) {
        setError(
          "Your details could not be found. Please try to log in again."
        );
        setLoading(false);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Either display loading or error state
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="loading-error">{error}</div>;
  }

  // Create role specific content
  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case "student":
        return (
          <p className={`${styles.UserSpecific} ${styles.StudentSpecific}`}>
            Welcome to your student dashboard! Here you can track your progress
            and access resources.
          </p>
          //  <RoleRestricted allowedRoles={["student"]}>
          //     <StudentDashboard />
          //  </RoleRestricted>
        );
      case "teacher":
        return (
          <p>
            Welcome to your teacher dashboard! Manage your classes and monitor
            student performance.
          </p>
        );
      case "parent":
        return (
          <p>
            Welcome to your parent dashboard! Stay updated on your child's
            progress and activities.
          </p>
        );
      default:
        return (
          <p>
            Welcome to your dashboard! That's strange...You do not have a
            specific role assigned on the system. Checking your details...
          </p>
        );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* <h2>Dashboard</h2>
      <h3>
        Hello {user?.lastName} or should I call you {user?.firstName} ?
      </h3> */}
      {/* {renderRoleSpecificContent()} */}
      <RoleRestricted allowedRoles={["administrator"]}>
        <p className={`${styles.userSpecific} ${styles.adminSpecific}`}>
          You are a {user?.role}. We are building this exciting new
          feature tailored specifically for you. Come back in a few days to
          explore and enjoy it!
        </p>
      </RoleRestricted>
      <RoleRestricted allowedRoles={["teacher"]}>
        <p className={`${styles.userSpecific} ${styles.teacherSpecific}`}>
          You are a {user?.role}. We are building this exciting new
          feature tailored specifically for you. Come back in a few days to
          explore and enjoy it!
        </p>
      </RoleRestricted>
      <RoleRestricted allowedRoles={["student"]}>
        {/* <p className={`${styles.userSpecific} ${styles.studentSpecific}`}>
          You are a {user?.role}. We are building this exciting new
          feature tailored specifically for you. Come back in a few days to
          explore and enjoy it!
        </p> */}
        <StudentDashboard />
        
      </RoleRestricted>
      <RoleRestricted allowedRoles={["parent"]}>
        <p className={`${styles.userSpecific} ${styles.parentSpecific}`}>
          You are a {user?.role}. We are building this exciting new
          feature tailored specifically for you. Come back in a few days to
          explore and enjoy it!
        </p>
      </RoleRestricted>
      {/* <button className={styles.logoutButton} onClick={handleLogout}>Logout</button> */}
    </div>
  );
};

export default Dashboard;