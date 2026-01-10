import { useEffect, useMemo, useState } from "react";
import styles from "../css/TeacherMain.module.css";
import { sortAssessmentsByDeadline } from "../../../utils/assessments.js";
import { getUserDetails } from "../../../services/userService.js";
import AssessmentCard from "../assessments/AssessmentCard.jsx";
import CustomCalendar from "../CustomCalendar.jsx";
import RecentActivities from "../RecentActivities.jsx";
import WelcomeBoard from "../WelcomeBoard.jsx";
import Progress from "../Progress.jsx";
import Modal from "../../ui/Modal.jsx";
import CreateOptionsContent from "../CreateOptionsContent.jsx";

const TeacherMain = ({
  showNav,
  profile,
  units,
  setUnits,
  assessments,
  setAssessments,
  selectedUnit,
  setCanEdit,
  persistSelectedUnit,
}) => {
  const [newAssessment, setNewAssessment] = useState(false);

  //get today at midnight
  const today = new Date();
  const todayTimeStamp = today.setHours(0, 0, 59, 999);

  useEffect(() => {
    const fetchData = async () => {
      const teacherData = await getUserDetails(profile.role, profile.id);

      if (teacherData.data.message) {
        const tempAssessments = sortAssessmentsByDeadline(
          teacherData.data.data.assignments || [],
          teacherData.data.data.quizzes || []
        );

        setAssessments(tempAssessments);
        setUnits(teacherData.data.data.units);
        persistSelectedUnit();
      }
    };
    fetchData();
  }, []);

  const filteredAssignments = useMemo(() => {
    if (selectedUnit.id === "all" || !selectedUnit.id) {
      return assessments;
    }
    return assessments.filter(
      (assessment) => assessment.unit._id === selectedUnit.id
    );
  }, [assessments, selectedUnit.id]);

  const convertDateTime = (date, time) => {
    const fullDateTimeStr = `${date}T${time}:00`;
    const thatDate = new Date(fullDateTimeStr);
    return thatDate.getTime();
  };

  const events = useMemo(() => {
    return filteredAssignments.map((assignment) => {
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
  }, [filteredAssignments]);

  const upcomingDeadlines = events.filter(
    (event) => convertDateTime(event.date, event.time) > todayTimeStamp
  );
  const pastActivities = events.filter(
    (event) => convertDateTime(event.date, event.time) <= todayTimeStamp
  );

  const handleChooseNewAssessment = () => {
    setCanEdit(true);
    setNewAssessment(true);
  };

  return (
    <>
      <Modal isOpen={newAssessment} onClose={() => setNewAssessment(false)}>
        <CreateOptionsContent />
      </Modal>
      {units.length === 0 ? (
        <WelcomeBoard firstName={profile?.firstName} />
      ) : (
        <div
          className={`${styles.teacherContainer} ${
            showNav ? "" : styles.marginCollapsed
          }`}
        >
          <div className={styles.containerLeft}>
            <div className={styles.assignmentsOverview}>
              {units.length === 0 ? (
                <div className={styles.noUnits}>
                  <h4>NO UNITS</h4>
                  <div className={styles.message}>
                    <p>
                      You don't have any units assigned to you. You can request
                      to be assigned a unit on the Units page
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.assignmentsBox}>
                  <div className={styles.assignmentsTitle}>
                    <h4>{selectedUnit.name} Assessments</h4>
                    <button
                      className={styles.addAssignment}
                      onClick={handleChooseNewAssessment}
                    >
                      <i className="fa-solid fa-plus"></i>
                      <p>Create</p>
                    </button>
                  </div>
                  <div className={styles.assignments}>
                    {filteredAssignments.map((assignment) => {
                      return (
                        <AssessmentCard
                          key={assignment._id}
                          unitName={assignment.unit.unitName}
                          title={assignment.title}
                          id={assignment._id}
                          role={profile.role}
                          dueDate={assignment.deadLine}
                          type={assignment.type}
                        />
                      );
                    })}

                    {/* return a message if no assignment exists for the unit selected */}
                    {filteredAssignments.length === 0 && (
                      <div className={styles.message}>
                        <p>
                          You don't have any existing assessments for this unit
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.submissions}>
              <h3>Submissions</h3>
              <div className={styles.submissionsBox}>
                <table className={styles.submissionsTable}>
                  <thead>
                    <tr>
                      <th>Assignment Title</th>
                      <th>Sumission Status</th>
                      <th>Evaluation Status</th>
                      <th>Date Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.map((assignment) => {
                      return (
                        <tr key={assignment._id}>
                          <td>{assignment.title}</td>
                          <td>
                            {assignment.submissionCount}/
                            {assignment.enrolledStudentsCount}
                          </td>
                          <td>{assignment.status}</td>
                          <td>
                            {assignment?.createdAt?.slice(0, 10) || "N/A"}
                          </td>
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
                {upcomingDeadlines.map((item, index) => {
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
              <Progress />
            </div>
          </div>
          <div className={styles.containerRight}>
            <CustomCalendar deadlines={events} />
            <RecentActivities
              activities={pastActivities}
              subject={selectedUnit.name}
              role={profile.role}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherMain;
