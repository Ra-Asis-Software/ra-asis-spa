import React, { useEffect, useState } from "react";
import styles from "../css/TeacherMain.module.css";
import "../css/TeacherMain.module.css";
import { getUserDetails } from "../../../services/user";
import Title from "../Title";
import UnitCard from "../UnitCard";
import AssignmentCard from "../AssignmentCard";
import CustomCalendar from "../CustomCalendar";
import { useNavigate } from "react-router-dom";

function TeacherMain({ showNav, profile }) {
  const [units, setUnits] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const deadlines = [
    { date: "2025-06-01", event: "Attachemnent", time: "08:30" },
    { date: "2025-06-15", event: "Attachemnent", time: "10:52" },
    { date: "2025-07-11", event: "Attachemnent", time: "14:52" },
    { date: "2025-06-22", event: "Attachemnent", time: "23:00" },
  ];

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
                <h4>Assignments</h4>
                <button
                  className={styles.addAssignment}
                  onClick={() => navigate("/dashboard/assignments?new=true")}
                >
                  <i className="fa-solid fa-plus"></i>
                  <p>Create</p>
                </button>
              </div>
              <div className={styles.units}>
                {assignments.map((assignment) => {
                  return (
                    <AssignmentCard
                      key={assignment._id}
                      unitName={assignment.unit.unitName}
                      title={assignment.title}
                    />
                  );
                })}
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
            {deadlines.map((item, index) => {
              return (
                <div className={styles.deadlineEvent} key={index}>
                  <h5>{item.date}</h5>
                  <p>{item.event}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.heroRight}>
        <CustomCalendar deadlines={deadlines} />
      </div>
    </div>
  );
}

export default TeacherMain;
