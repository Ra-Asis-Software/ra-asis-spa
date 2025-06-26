import React, { useEffect } from "react";
import styles from "../css/TeacherMain.module.css";
import "../css/TeacherMain.module.css";
import { getUserDetails } from "../../../services/userService";
import Title from "../Title";
import AssignmentCard from "../AssignmentCard";
import CustomCalendar from "../CustomCalendar";
import { useNavigate } from "react-router-dom";

const TeacherMain = ({
  showNav,
  profile,
  units,
  setUnits,
  assignments,
  setAssignments,
  selectedUnit,
}) => {
  const navigate = useNavigate();
  const deadlines = [
    { date: "2025-03-01", event: "Go to space", time: "08:30" },
    {
      date: "2025-06-15",
      event: "Eat all the food in the fridge",
      time: "10:52",
    },
    {
      date: "2025-07-11",
      event: "Read the book River and the source",
      time: "14:52",
    },
    { date: "2025-05-22", event: "Go to a parents' meeting", time: "16:00" },
    {
      date: "2025-06-12",
      event: "Mark all Mathematics assignments",
      time: "23:00",
    },
    { date: "2025-08-29", event: "Sleep for 7 hours", time: "10:00" },
    { date: "2025-02-26", event: "Watch the series Foundation", time: "23:00" },
    { date: "2025-09-22", event: "Check status of ...", time: "19:00" },
    { date: "2025-06-10", event: "Do this that, that and that", time: "23:00" },
  ];

  //get today at midnight
  const today = new Date();
  const todayTimeStamp = today.setHours(23, 59, 59, 999);

  useEffect(() => {
    const fetchData = async () => {
      const teacherData = await getUserDetails(profile.role, profile.id);

      if (teacherData.data.message) {
        setAssignments(teacherData.data.data.assignments);
        setUnits(teacherData.data.data.units);
      }
    };
    fetchData();
  }, []);

  const convertDateTime = (date, time) => {
    const fullDateTimeStr = `${date}T${time}:00`;
    const thatDate = new Date(fullDateTimeStr);
    return thatDate.getTime();
  };

  return (
    <div className={`${styles.hero} ${showNav ? "" : styles.marginCollapsed}`}>
      <div className={styles.heroLeft}>
        <Title />
        <div className={styles.assignmentsOverview}>
          {units.length === 0 ? (
            <div className={styles.noUnits}>
              <h4>NO UNITS</h4>
              <div className={styles.message}>
                <p>You don't have any units assigned to you</p>
                <p>The admin is yet to assign them to you</p>
              </div>
            </div>
          ) : (
            <div className={styles.unitsBox}>
              <div className={styles.assignmentsTitle}>
                <h4>{selectedUnit.name} Assignments</h4>
                <button
                  className={styles.addAssignment}
                  onClick={() => navigate("/dashboard/assignments?new=true")}
                >
                  <i className="fa-solid fa-plus"></i>
                  <p>Create</p>
                </button>
              </div>
              <div className={styles.units}>
                {/* map assignments for the selected unit only */}
                {assignments
                  .filter(
                    (assignment) => assignment.unit._id === selectedUnit.id
                  )
                  .map((assignment) => {
                    return (
                      <AssignmentCard
                        key={assignment._id}
                        unitName={assignment.unit.unitName}
                        title={assignment.title}
                        id={assignment._id}
                      />
                    );
                  })}

                {/* return a message if no assignment exists for the unit selected */}
                {assignments.filter(
                  (assignment) => assignment.unit._id === selectedUnit.id
                ).length === 0 && (
                  <div className={styles.message}>
                    <p>You don't have any existing assignments for this unit</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.submissions}>
          <h3>Submissions</h3>
          <div className={styles.submissionsBox}>
            <table>
              <thead>
                <tr>
                  <td>Assignment title</td>
                  <td>Sumission status</td>
                  <td>Evaluation status</td>
                  <td>Date assigned</td>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => {
                  return (
                    <tr key={assignment._id}>
                      <td>{assignment.title}</td>
                      <td>40/60</td>
                      <td>Completed</td>
                      <td>01/01/2024</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.deadlines}>
          <h3>Deadlines</h3>
          <div className={styles.deadlineBox}>
            {deadlines
              .filter((event) => {
                //filter only future dates
                return convertDateTime(event.date, event.time) > todayTimeStamp;
              })
              .map((item, index) => {
                return (
                  <div className={styles.deadlineEvent} key={index}>
                    <p>{item.event}</p>
                    <p>{item.date}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={styles.progress}>
          <h3>Progress</h3>
        </div>
      </div>
      <div className={styles.heroRight}>
        <CustomCalendar deadlines={deadlines} />
        <div className={styles.recentActivities}>
          <h4>Recent Activities</h4>
          <div className={styles.recentActivitiesBox}>
            {deadlines
              .filter((event) => {
                //filter only past dates
                return (
                  convertDateTime(event.date, event.time) <= todayTimeStamp
                );
              })
              .map((item, index) => {
                return (
                  <div className={styles.deadlineEventRecent} key={index}>
                    <p>{item.event}</p>
                    <p>{item.date}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMain;
