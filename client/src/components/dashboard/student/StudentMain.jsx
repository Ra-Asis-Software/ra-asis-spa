import { useEffect, useState } from "react";
import styles from "../css/StudentMain.module.css";
import AssignmentCard from "../AssignmentCard";
import CustomCalendar from "../CustomCalendar";
import DeadlineCard from "./DeadlineCard";
import Summary from "./Summary";
import Progress from "../Progress";
import RecentActivities from "../RecentActivities";
import { getUserDetails } from "../../../services/userService";
import WelcomeBoard from "../WelcomeBoard";

const StudentMain = ({
  showNav,
  units,
  selectedUnit,
  setUnits,
  profile,
  assignments,
  setAssignments,
}) => {
  const [deadlines, setDeadlines] = useState([]);
  const today = new Date();
  const todayTimeStamp = today.setHours(0, 0, 59, 999);

  useEffect(() => {
    const fetchData = async () => {
      const studentData = await getUserDetails(profile.role, profile.id);

      if (studentData.data.message) {
        const tempAssignments = studentData.data.data.assignments || [];
        setAssignments(tempAssignments);
        setUnits(studentData.data.data.units);

        const tempDeadlines = tempAssignments
          .filter((assignment) => {
            if (selectedUnit.id === "all") {
              return assignment;
            }
            return assignment.unit._id === selectedUnit.id;
          })
          .map((assignment) => {
            return {
              date:
                assignment.deadLine.slice(0, 10) === "T"
                  ? `${today.getFullYear()}-12-31`
                  : assignment.deadLine.slice(0, 10),
              event: assignment.title,
              time:
                assignment.deadLine.slice(11) === ""
                  ? "23:59"
                  : assignment.deadLine.slice(11),
            };
          });
        setDeadlines(tempDeadlines);
      }
    };
    fetchData();
  }, [selectedUnit]);

  const convertDateTime = (date, time) => {
    const fullDateTimeStr = `${date}T${time}:00`;
    const thatDate = new Date(fullDateTimeStr);
    return thatDate.getTime();
  };

  return (
    <>
      {units.length === 0 ? (
        <WelcomeBoard firstName={profile?.firstName} />
      ) : (
        <main
          className={`${styles.main} ${!showNav ? styles.mainCollapsed : ""}`}
        >
          <h3 className={styles.heading}>
            {selectedUnit.name
              ? `${selectedUnit.name} Assignments`
              : "Please select a subject"}
          </h3>

          <div className={styles.topRow}>
            <div className={styles.leftColumn}>
              {/* Map assignments for the selected unit */}
              <div className={styles.cardContainer}>
                {assignments.filter((assignment) => {
                  if (selectedUnit.id === "all") {
                    return assignment;
                  }
                  return assignment.unit._id === selectedUnit.id;
                }).length > 0 ? (
                  assignments
                    .filter((assignment) => {
                      if (selectedUnit.id === "all") {
                        return assignment;
                      }
                      return assignment.unit._id === selectedUnit.id;
                    })
                    .map((assignment) => (
                      <AssignmentCard
                        key={assignment._id}
                        unitName={assignment.unit.unitName}
                        title={assignment.title}
                        id={assignment._id}
                      />
                    ))
                ) : (
                  <p>No assignments for this subject.</p>
                )}
              </div>

              {/* Summary and Deadlines */}
              <div className={styles.summaryAndDeadlineRow}>
                <Summary />
                <DeadlineCard
                  unit={selectedUnit.name}
                  deadlines={deadlines.filter((event) => {
                    //filter only future dates
                    return (
                      convertDateTime(event.date, event.time) > todayTimeStamp
                    );
                  })}
                />
              </div>
            </div>

            <div className={styles.rightColumn}>
              <CustomCalendar {...{ deadlines }} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className={styles.bottomRow}>
            <Progress />
            <RecentActivities
              activities={deadlines.filter((event) => {
                //filter only past dates
                return (
                  convertDateTime(event.date, event.time) <= todayTimeStamp
                );
              })}
            />
          </div>
        </main>
      )}
    </>
  );
};

export default StudentMain;
