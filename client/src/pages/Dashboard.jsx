import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import RoleRestricted from "../components/ui/RoleRestricted";
import styles from "./Dashboard.module.css";
import Sidebar from "../components/dashboard/SideBar";
import Header from "../components/dashboard/Header";
import TeacherMain from "../components/dashboard/teacher/TeacherMain";
import StudentMain from "../components/dashboard/student/StudentMain";
import Assignments from "../components/dashboard/Assignments";

const Dashboard = () => {
  const [user, setUser] = useState(null); // State to store data for a user
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State for error handling
  const [showNav, setShowNav] = useState(false);
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

        const { firstName, lastName, role, id } = decoded;

        // Set the user's data in state
        setUser({ firstName, lastName, role, id });
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
          <RoleRestricted allowedRoles={["student"]}>
            <StudentMain subject={"Mathematics"} profile={user} />
          </RoleRestricted>
        );
      case "teacher":
        return (
          <RoleRestricted allowedRoles={["teacher"]}>
            <TeacherMain {...{ showNav }} profile={user} />
          </RoleRestricted>
        );
      case "parent":
        return (
          <RoleRestricted allowedRoles={["teacher"]}>
            {/* <ParentDashboard /> */}
          </RoleRestricted>
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
      <Header
        profile={user}
        setShowNav={setShowNav}
        showNav={showNav}
        // selectedSubject={selectedSubject}
        // setSelectedSubject={setSelectedSubject}
      />

      <div className={styles.content}>
        <Sidebar show={showNav} />
        <div className={styles.dashboards}>
          <Routes>
            <Route path="/" element={renderRoleSpecificContent()} />

            <Route
              path="/assignments"
              element={<Assignments {...{ user }} />}
            />

            <Route path="/assignments/:id" />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
