import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getParentDetails } from "../../../services/userService";
import StudentMain from "../student/StudentMain";
import WelcomeBoard from "../WelcomeBoard";

const ParentMain = ({ user, ...props }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const location = useLocation();

  // Debuggers
  useEffect(() => {
    console.log("ParentMain mounted");
    return () => console.log("ParentMain unmounted");
  }, []);

  useEffect(() => {
    console.log("linkedStudents updated:", linkedStudents);
  }, [linkedStudents]);

  useEffect(() => {
    console.log("selectedStudent updated:", selectedStudent);
  }, [selectedStudent]);

  // End Debuggers Set

  // Fetch parent's students and set initial selected student
  useEffect(() => {
    console.log("ParentMain mounting or updating"); // Debugger
    const fetchParentData = async () => {
      try {
        setLoading(true);
        console.log("Fetching parent data..."); // Debugger
        const parentData = await getParentDetails(user.id);
        console.log("Parent data response:", parentData); // Debugger
        const students = parentData.data?.children || [];
        setLinkedStudents(students);

        // Check for student ID in location state or localStorage
        const studentFromState = location.state?.selectedStudentId;
        const storedStudentId = localStorage.getItem("parentSelectedStudentId");

        console.log("Student from state:", studentFromState); // Debugger
        console.log("Student from localStorage:", storedStudentId); // Debugger

        const studentId =
          location.state?.selectedStudentId ||
          localStorage.getItem("parentSelectedStudentId") ||
          students[0]?.id ||
          null;

        if (studentId) {
          const student = students.find((s) => s.id === studentId);
          if (student) {
            setSelectedStudent(student);
            localStorage.setItem("parentSelectedStudentId", studentId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch parent data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [user.id, location.state]);

  // If loading, show loading state
  if (loading) {
    return <div>Loading student data...</div>;
  }

  // If no students linked, show WelcomeBoard component
  if (linkedStudents.length === 0) {
    return <WelcomeBoard firstName={user.firstName} />;
  }

  // If no student selected (shouldn't happen but just in case, you never know...)
  if (!selectedStudent) {
    return <div>No student selected</div>;
  }

  // Render StudentMain with selected student's data
  return (
    <StudentMain
      {...props}
      profile={{
        ...user,
        id: selectedStudent.id,
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
      }}
    />
  );
};

export default ParentMain;
