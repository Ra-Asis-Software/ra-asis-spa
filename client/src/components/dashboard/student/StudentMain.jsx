import React, { useEffect } from "react";
import styles from "../css/StudentMain.module.css";
import Title from "../Title";
import AssignmentCard from "../AssignmentCard";
import CustomCalendar from "../CustomCalendar";
import DeadlineCard from "./DeadlineCard";
import Summary from "./Summary";
import Progress from "../Progress";
import RecentActivities from "../RecentActivities";
import { getUserDetails } from "../../../services/userService";

const assignmentsData = {
  Mathematics: [
    { title: "Algebra Homework", unit: "Science", status: "Completed" },
    { title: "Geometry Worksheet", unit: "English", status: "Pending" },
    { title: "Geometry Worksheet", unit: "Kiswahili", status: "Not Started" },
  ],
  Chemistry: [{ title: "Lab Report", unit: "Mathematics", status: "Graded" }],
};

const deadlinesData = {
  Mathematics: [
    { title: "Algebra Assignment", dueDate: "2025-06-10", note: "Chapter 1–3" },
    { title: "Geometry Project", dueDate: "2025-06-14" },
  ],
  Chemistry: [
    { title: "Lab Report", dueDate: "2025-06-08", note: "Submit on LMS" },
  ],
};

const recentActivitiesData = {
  Mathematics: [
    {
      type: "Submitted",
      item: "Algebra Homework",
      date: "2025-06-03",
      time: "10:00 AM",
    },
    {
      type: "Marked",
      item: "Geometry Worksheet",
      date: "2025-06-02",
      time: "2:30 PM",
    },
  ],
  Chemistry: [
    {
      type: "Feedback",
      item: "Lab Report",
      date: "2025-06-01",
      time: "11:00 AM",
    },
  ],
};

const StudentMain = ({
  showNav,
  units,
  selectedUnit,
  setUnits,
  profile,
  assignments,
  setAssignments,
}) => {
  const deadlines = deadlinesData[selectedUnit.name] || [];
  const activities = recentActivitiesData[selectedUnit.name] || [];

  useEffect(() => {
    const fetchData = async () => {
      const studentData = await getUserDetails(profile.role, profile.id);

      if (studentData.data.message) {
        setAssignments(studentData.data.data.assignments);
        setUnits(studentData.data.data.units);
      }
    };
    fetchData();
  }, []);

  return (
    <main className={`${styles.main} ${!showNav ? styles.mainCollapsed : ""}`}>
      <Title page="Dashboard" />
      <h2 className={styles.heading}>
        {selectedUnit.name
          ? `${selectedUnit.name} Assignments`
          : "Please select a subject"}
      </h2>

      <div className={styles.topRow}>
        <div className={styles.leftColumn}>
          {/* Assignment Cards */}
          <div className={styles.cardContainer}>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment._id}
                  unitName={assignment.unit.unitName}
                  title={assignment.title}
                />
              ))
            ) : (
              <p>No assignments for this subject.</p>
            )}
          </div>

          {/* Summary and Deadlines */}
          <div className={styles.summaryAndDeadlineRow}>
            <Summary />
            <DeadlineCard subject={"Mathematics"} deadlines={deadlines} />
          </div>
        </div>

        <div className={styles.rightColumn}>
          <CustomCalendar
            deadlines={[
              { date: "2025-06-10" },
              { date: "2025-06-12" },
              { date: "2025-08-15" },
            ]}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        <Progress />
        <RecentActivities subject={selectedUnit.name} activities={activities} />
      </div>
    </main>
  );
};

export default StudentMain;
