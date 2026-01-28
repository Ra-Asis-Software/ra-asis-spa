import { useEffect, useMemo, useState } from "react";
import styles from "../css/TeacherMain.module.css";
import { sortAssessmentsByDeadline } from "../../../utils/assessments.js";
import { getUserDetails } from "../../../services/userService.js";
import { getAssignmentSubmissions } from "../../../services/assignmentService.js";
import { getSubmissionsForQuiz } from "../../../services/quizService.js";
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
  const [submissionStatuses, setSubmissionStatuses] = useState({});

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

  // Fetch submissions for all assessments when assessments change
  useEffect(() => {
    const fetchAllSubmissions = async () => {
      if (!assessments.length) return;

      const statuses = {};

      for (const assessment of assessments) {
        try {
          const response =
            assessment.type === "assignment"
              ? await getAssignmentSubmissions(assessment._id, 1)
              : await getSubmissionsForQuiz(assessment._id, 1);

          if (!response.error && response.data) {
            const submissions = response.data;

            // Count grading statuses
            const counts = {
              graded: 0,
              inProgress: 0,
              submitted: 0,
              pending: 0,
              total: submissions.length,
            };

            submissions.forEach((sub) => {
              if (sub.gradingStatus === "graded") counts.graded++;
              else if (sub.gradingStatus === "in-progress") counts.inProgress++;
              else if (sub.gradingStatus === "submitted") counts.submitted++;
              else if (sub.gradingStatus === "pending") counts.pending++;
            });

            statuses[assessment._id] = counts;
          }
        } catch (error) {
          console.error(
            `Error fetching submissions for ${assessment._id}:`,
            error
          );
          statuses[assessment._id] = {
            graded: 0,
            inProgress: 0,
            submitted: 0,
            pending: 0,
            total: 0,
          };
        }
      }

      setSubmissionStatuses(statuses);
    };

    fetchAllSubmissions();
  }, [assessments]);

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

  // Calculate evaluation status based on actual submission counts
  const getEvaluationStatus = (assessment) => {
    const status = submissionStatuses[assessment._id];
    if (!status) return "Loading...";

    const totalStudents = assessment.enrolledStudentsCount || 0;
    const totalSubmissions = status.total || 0;

    // No submissions
    if (totalSubmissions === 0) {
      return "No Submissions";
    }

    // All students graded
    if (status.graded === totalStudents && totalStudents > 0) {
      return "Fully Graded";
    }

    // Some graded
    if (status.graded > 0) {
      return `${status.graded}/${totalSubmissions} Graded`;
    }

    // Some in progress
    if (status.inProgress > 0) {
      return `${status.inProgress} In Progress`;
    }

    // Only submitted/pending (not graded or in-progress)
    return "Awaiting Grading";
  };

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
                {filteredAssignments.length === 0 ? (
                  <div className={styles.message}>
                    <p>There are no submissions to view at the moment</p>
                  </div>
                ) : (
                  <table className={styles.submissionsTable}>
                    <thead>
                      <tr>
                        <th>Assessment Title</th>
                        <th>Submission Count</th>
                        <th>Evaluation Status</th>
                        <th>Date Assigned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((assignment) => {
                        const evaluationStatus =
                          getEvaluationStatus(assignment);
                        const status = submissionStatuses[assignment._id];

                        return (
                          <tr key={assignment._id}>
                            <td>{assignment.title}</td>
                            <td>
                              {assignment.submissionCount || 0}/
                              {assignment.enrolledStudentsCount || 0}
                            </td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  evaluationStatus.includes("Fully Graded")
                                    ? styles.graded
                                    : evaluationStatus.includes("Graded")
                                    ? styles.partialGraded
                                    : evaluationStatus.includes("In Progress")
                                    ? styles.inProgress
                                    : evaluationStatus.includes("Awaiting")
                                    ? styles.awaiting
                                    : styles.noSubmissions
                                }`}
                              >
                                {evaluationStatus}
                              </span>
                            </td>
                            <td>
                              {assignment?.createdAt?.slice(0, 10) || "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className={styles.deadlines}>
              <h3>Deadlines</h3>
              <div className={styles.deadlineBox}>
                {upcomingDeadlines.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    <p>There are no upcoming deadlines</p>
                  </div>
                ) : (
                  upcomingDeadlines.map((item, index) => {
                    return (
                      <div className={styles.deadlineEvent} key={index}>
                        <p>{item.event}</p>
                        <p>{item.date}</p>
                      </div>
                    );
                  })
                )}
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
