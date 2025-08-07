import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserDetails } from "../../../services/userService";
import StudentMain from "../student/StudentMain";
import WelcomeBoard from "../WelcomeBoard";

const ParentMain = ({ profile }) => {
  const [searchParams] = useSearchParams();
  const [studentData, setStudentData] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState({
    id: "all",
    name: "All Units",
  });
  const studentId = searchParams.get("student");

  useEffect(() => {
    const fetchStudentData = async () => {
      if (studentId) {
        const result = await getUserDetails("student", studentId);
        if (!result.error) {
          setStudentData(result.data.data);
          // Set the first unit as default for now if available
          if (result.data.data?.units?.length > 0) {
            setSelectedUnit(result.data.data.units[0]);
          }
        }
      }
    };
    fetchStudentData();
  }, [studentId]);

  if (!studentData) {
    return <WelcomeBoard firstName={profile?.firstName} />;
  }

  // Dummy placeholder persist function
  const dummyPersist = () => {};

  return (
    <StudentMain
      showNav={true}
      units={studentData.units || []}
      selectedUnit={selectedUnit}
      setSelectedUnit={setSelectedUnit}
      profile={{
        ...profile,
        id: studentData.profile._id,
        role: "student", // Temporarily override role to use student view
      }}
      assignments={studentData.assignments || []}
      setAssignments={() => {}}
      setUnits={() => {}}
      persistSelectedUnit={dummyPersist}
    />
  );
};

export default ParentMain;
