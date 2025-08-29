import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import RoleRestricted from "../components/ui/RoleRestricted";
import styles from "./Dashboard.module.css";
import Sidebar from "../components/dashboard/SideBar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TeacherMain from "../components/dashboard/teacher/TeacherMain";
import StudentMain from "../components/dashboard/student/StudentMain";
import Students from "../components/dashboard/parent/Students";
import Assessments from "../components/dashboard/assessments/Assessments";
import Units from "../components/dashboard/Units";
import ProfileContent from "../components/dashboard/ProfileContent";
import ParentMain from "../components/dashboard/parent/ParentMain";
import { getParentDetails } from "../services/userService";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNav, setShowNav] = useState(() => window.innerWidth > 768);
  const [units, setUnits] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [parentStudentData, setParentStudentData] = useState(null);
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

  useEffect(() => {
    if (user?.role === "parent") {
      const fetchStudents = async () => {
        const result = await getParentDetails(user.id);
        if (!result.error) {
          setLinkedStudents(result.data?.children || []);
        }
      };
      fetchStudents();
    }
  }, [user?.id, user?.role]);

  //set selected unit in localStorage
  const persistSelectedUnit = () => {
    const storedUnit = localStorage.getItem("focusUnit");
    setSelectedUnit(
      storedUnit ? JSON.parse(storedUnit) : units.length > 0 && units[0]
    );
  };

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
        {...{
          units:
            user.role === "parent" ? parentStudentData?.units || [] : units,
          showNav,
          setShowNav,
          selectedUnit,
          setSelectedUnit,
          linkedStudents,
        }}
      />

      <div className={styles.content}>
        <Sidebar show={showNav} logout={handleLogout} role={user?.role} />
        <div className={styles.dashboards}>
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
                        persistSelectedUnit,
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
                        persistSelectedUnit,
                      }}
                      profile={user}
                    />
                  </RoleRestricted>

                  <RoleRestricted allowedRoles={["parent"]}>
                    <ParentMain
                      profile={user}
                      setParentStudentData={setParentStudentData}
                      onSelectUnit={setSelectedUnit}
                    />
                  </RoleRestricted>

                  <RoleRestricted allowedRoles={["administrator"]}>
                    {/* AdminMain will go here later on */}
                  </RoleRestricted>
                </>
              }
            />

            <Route
              path="/assessments"
              element={
                <Assessments
                  {...{
                    user,
                    selectedUnit,
                    setSelectedUnit,
                    assignments,
                    setAssignments,
                    setUnits,
                    canEdit,
                    setCanEdit,
                    persistSelectedUnit,
                  }}
                />
              }
            />

            <Route path="/units" element={<Units {...{ user }} />} />

            <Route path="/students" element={<Students {...{ user }} />} />

            <Route path="/profile" element={<ProfileContent {...{ user }} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
