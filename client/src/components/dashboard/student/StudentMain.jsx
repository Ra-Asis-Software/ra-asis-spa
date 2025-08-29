import { useEffect, useMemo } from "react";
import styles from "../css/StudentMain.module.css";
import AssignmentCard from "../assessments/AssignmentCard";
import CustomCalendar from "../CustomCalendar";
import DeadlineCard from "./DeadlineCard";
import Summary from "./Summary";
import Progress from "../Progress";
import RecentActivities from "../RecentActivities";
import { getUserDetails } from "../../../services/userService";
import WelcomeBoard from "../WelcomeBoard";

const today = new Date();
const todayTimeStamp = new Date(today).setHours(0, 0, 59, 999);

const convertDateTime = (date, time) => {
  const safeDate = date || `${today.getFullYear()}-01-01`;
  const safeTime = time || "00:00";
  const fullDateTimeStr = `${safeDate}T${safeTime}:00`;
  return new Date(fullDateTimeStr).getTime();
};

const StudentMain = ({
  showNav,
  units,
  selectedUnit,
  setUnits,
  profile,
  assignments,
  setAssignments,
  persistSelectedUnit,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      const studentData = await getUserDetails(profile.role, profile.id);

      // Check for valid data before setting state
      if (studentData?.data?.data) {
        setAssignments(studentData.data.data.assignments || []);
        setUnits(studentData.data.data.units || []);
        persistSelectedUnit();
      }
    };

    fetchData();
  }, [profile?.id, profile?.role]);

  const filteredAssignments = useMemo(() => {
    if (!assignments) return [];
    if (selectedUnit.id === "all") {
      return assignments;
    }
    return assignments.filter(
      (assignment) => assignment.unit._id === selectedUnit.id
    );
  }, [assignments, selectedUnit.id]);

  // `deadlines` are derived directly from filtered assignments
  const deadlines = useMemo(() => {
    return filteredAssignments.map((assignment) => {
      const deadLineStr = assignment.deadLine || "";
      return {
        date: deadLineStr.slice(0, 10),
        event: assignment.title,
        time: deadLineStr.slice(11, 16),
      };
    });
  }, [filteredAssignments]);

  if (units.length === 0) {
    return <WelcomeBoard firstName={profile?.firstName} />;
  }

  const upcomingDeadlines = deadlines.filter(
    (event) => convertDateTime(event.date, event.time) > todayTimeStamp
  );
  const pastActivities = deadlines.filter(
    (event) => convertDateTime(event.date, event.time) <= todayTimeStamp
  );

  return (
    <main className={`${styles.main} ${!showNav ? styles.mainCollapsed : ""}`}>
      <div className={styles.layoutGrid}>
        <div className={styles.mainContent}>
          <h3
            className={styles.heading}
          >{`${selectedUnit.name} Assignments`}</h3>
          <div className={styles.assignmentCardContainer}>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment._id}
                  unitName={assignment.unit.unitName}
                  title={assignment.title}
                  id={assignment._id}
                  role={profile.role}
                />
              ))
            ) : (
              <p>No assignments found for this selection.</p>
            )}
          </div>
          <div className={styles.summaryAndDeadlineRow}>
            <Summary selectedUnit={selectedUnit} />
            <DeadlineCard
              unit={selectedUnit.name}
              deadlines={upcomingDeadlines}
              role={profile.role}
            />
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.progressBox}>
            <Progress />
          </div>
        </div>

        <aside className={styles.rightSideBar}>
          <CustomCalendar deadlines={deadlines} />
          <div className={styles.recentsBox}>
            <RecentActivities activities={pastActivities} role={profile.role} />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default StudentMain;
