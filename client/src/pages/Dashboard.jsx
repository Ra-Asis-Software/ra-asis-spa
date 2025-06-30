import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import RoleRestricted from "../components/ui/RoleRestricted";
import styles from "./Dashboard.module.css";
import Sidebar from "../components/dashboard/SideBar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TeacherMain from "../components/dashboard/teacher/TeacherMain";
import StudentMain from "../components/dashboard/student/StudentMain";
import Assignments from "../components/dashboard/Assignments";
import ProfileContent from "../components/dashboard/ProfileContent";

const Dashboard = () => {
  const [user, setUser] = useState(null); // State to store data for a user
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State for error handling
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({
    name: "All units",
    id: "all",
  });
  const [canEdit, setCanEdit] = useState(false);

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

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader
        profile={user}
        {...{ units, showNav, setShowNav, selectedUnit, setSelectedUnit }}
      />

      <div className={styles.content}>
        <Sidebar show={showNav} logout={handleLogout} />
        <div className={styles.dashboards}>
          {/* <Routes>
            <Route
              path="/"
              element={
                <>
                  <RoleRestricted allowedRoles={["student"]}>
                    <StudentMain
                      {...{
                        units,
                        selectedUnit,
                        setUnits,
                        assignments,
                        setAssignments,
                      }}
                      profile={user}
                    />
                  </RoleRestricted>

                  <RoleRestricted allowedRoles={["teacher"]}>
                    <TeacherMain
                      {...{
                        showNav,
                        units,
                        setUnits,
                        assignments,
                        setAssignments,
                        selectedUnit,
                        setCanEdit,
                      }}
                      profile={user}
                    />
                  </RoleRestricted> */}

                  {/* <RoleRestricted allowedRoles={["parent"]}> */}
                    {/* <ParentDashboard /> */}
                  {/* </RoleRestricted> */}

                  {/* <RoleRestricted allowedRoles={["administrator"]}> */}
                    {/* <ParentDashboard /> */}
                  {/* </RoleRestricted> */}
                {/* </>
              }
            />

            <Route
              path="/assignments"
              element={
                <Assignments
                  {...{
                    user,
                    selectedUnit,
                    setSelectedUnit,
                    assignments,
                    setAssignments,
                    setUnits,
                    canEdit,
                    setCanEdit,
                  }}
                />
              }
            />
          </Routes> */}

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <RoleRestricted allowedRoles={["student"]}>
                    <StudentMain
                      {...{
                        units,
                        selectedUnit,
                        setUnits,
                        assignments,
                        setAssignments,
                      }}
                      profile={user}
                    />
                  </RoleRestricted>

                  <RoleRestricted allowedRoles={["teacher"]}>
                    <TeacherMain
                      {...{
                        showNav,
                        units,
                        setUnits,
                        assignments,
                        setAssignments,
                        selectedUnit,
                        setCanEdit,
                      }}
                      profile={user}
                    />
                  </RoleRestricted>

                  <RoleRestricted allowedRoles={["parent"]}>
                    {/* <ParentDashboard /> */}
                  </RoleRestricted>

                  <RoleRestricted allowedRoles={["administrator"]}>
                    {/* <AdminDashboard /> */}
                  </RoleRestricted>
                </>
              }
            />

            <Route
              path="/assignments"
              element={
                <Assignments
                  {...{
                    user,
                    selectedUnit,
                    setSelectedUnit,
                    assignments,
                    setAssignments,
                    setUnits,
                    canEdit,
                    setCanEdit,
                  }}
                />
              }
            />

            <Route
              path="/profile"
              element={
                <ProfileContent
                  profile={user}
                  role={user.role}
                  canEdit={true}
                />
              }
            />
          </Routes>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
