import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getUserDetails,
  getParentDetails,
} from "../../../services/userService.js";
import StudentMain from "../student/StudentMain.jsx";
import WelcomeBoard from "../shared/WelcomeBoard.jsx";

const ParentMain = ({ profile, setParentStudentData, onSelectUnit }) => {
  const [searchParams] = useSearchParams();
  const [studentData, setStudentData] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const studentId = searchParams.get("student");
  const navigate = useNavigate();

  // Safe JSON parse helper
  const safeJsonParse = (str) => {
    try {
      return str ? JSON.parse(str) : null;
    } catch (e) {
      return null;
    }
  };

  // Load parent's students and selected student data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get parent's linked students
        const parentResult = await getParentDetails(profile.id);
        if (parentResult.error) {
          throw new Error(
            parentResult.error.message || "Failed to load parent data"
          );
        }

        setLinkedStudents(parentResult.data?.children || []);

        // If no students linked to our current parent... return early
        if (parentResult.data?.children?.length === 0) {
          setLoading(false);
          return;
        }

        // Determine which student to load
        let studentToLoad = studentId;
        if (!studentToLoad) {
          // Try to load last viewed student from localStorage
          const lastStudent = localStorage.getItem("parentFocusStudent");
          if (
            lastStudent &&
            parentResult.data.children.some((s) => s.id === lastStudent)
          ) {
            studentToLoad = lastStudent;
          } else {
            // Default to first linked student
            studentToLoad = parentResult.data.children[0]?.id;
          }
          if (studentToLoad) {
            navigate(`/dashboard?student=${studentToLoad}`);
          }
        }

        if (!studentToLoad) {
          setLoading(false);
          return;
        }

        // Load student data
        const studentResult = await getUserDetails("student", studentToLoad);
        if (studentResult.error) {
          throw new Error(
            studentResult.error.message || "Failed to load student data"
          );
        }

        setStudentData(studentResult.data.data);
        setParentStudentData(studentResult.data.data);

        // Set unit selection
        const lastUnit = safeJsonParse(localStorage.getItem("focusUnit"));
        if (lastUnit) {
          setSelectedUnit(lastUnit);
          onSelectUnit(lastUnit); // Notify parent component
        } else if (studentResult.data.data?.units?.length > 0) {
          const firstUnit = studentResult.data.data.units[0];
          setSelectedUnit(firstUnit);
          onSelectUnit(firstUnit);
        } else {
          const allUnits = { id: "all", name: "All Units" };
          setSelectedUnit(allUnits);
          onSelectUnit(allUnits);
        }
      } catch (err) {
        console.error("Error in ParentMain:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [profile.id, studentId, navigate, setParentStudentData, onSelectUnit]);

  const persistSelections = (unit) => {
    try {
      localStorage.setItem("focusUnit", JSON.stringify(unit));
      if (studentId) {
        localStorage.setItem("parentFocusStudent", studentId);
      }
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  };

  if (loading) {
    // Will replace with actual loading media asset
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (linkedStudents.length === 0) {
    return <WelcomeBoard firstName={profile?.firstName} />;
  }

  if (!studentData) {
    return <WelcomeBoard firstName={profile?.firstName} />;
  }

  return (
    <StudentMain
      showNav={true}
      units={studentData.units || []}
      selectedUnit={selectedUnit}
      setSelectedUnit={setSelectedUnit}
      profile={{
        ...profile,
        id: studentData.profile._id,
        role: "student", // Temporary override for view compatibility
      }}
      assessments={studentData.assignments || []}
      setAssessments={() => {}}
      setUnits={() => {}}
      persistSelectedUnit={persistSelections}
    />
  );
};

export default ParentMain;
