import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/Grade.module.css";
import {
  getAssignmentDetails,
  getAssignmentsForUnit,
  getAssignmentSubmissions,
} from "../../../services/assignmentService";
import {
  getQuizDetails,
  getQuizzesForUnit,
  getSubmissionsForQuiz,
} from "../../../services/quizService";
import {
  getAssessmentType,
  handleDueDate,
  pushUrlParams,
  removeUrlParams,
  useUrlParams,
} from "../../../utils/assessments";
import {
  unitDropdown,
  unitButton,
  dropdownMenu,
  dropdownOption,
} from "../../dashboard/css/DashboardHeader.module.css";
import Grade from "./Grade";

const Submissions = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [assessmentsHolder, setAssessmentsHolder] = useState({
    assignments: [],
    quizzes: [],
  });
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [openSubmissions, setOpenSubmissions] = useState(false);
  const [gradeNow, setGradeNow] = useState(false);
  const selectedUnit = JSON.parse(localStorage.getItem("focusUnit"));
  const { type, isOpened, submission } = useUrlParams();

  //useEffect to fetch assessments when component mounts
  useEffect(() => {
    const fetchAssessments = async () => {
      const assignments = await getAssignmentsForUnit(selectedUnit.id);
      const quizzes = await getQuizzesForUnit(selectedUnit.id);

      const tempHolder = {
        assignments: !assignments.error ? assignments.data : [],
        quizzes: !quizzes.error ? quizzes.data : [],
      };
      setAssessmentsHolder(tempHolder);

      setAssessments(
        type === "assignment" ? tempHolder.assignments : tempHolder.quizzes
      );
    };
    fetchAssessments();
  }, []);

  //useEffect to fetch submissions when selectedAssessment changes
  useEffect(() => {
    const fetchSubmissions = async () => {
      let id = selectedAssessment?._id || isOpened;
      //isOpened here is for assessments opened from another page, like SubmissionDetails.jsx

      if (id) {
        if (!selectedAssessment) {
          // when opened from another page, fetch the assessment details
          const assessment =
            type === "assignment"
              ? assessments.find((assessment) => assessment._id === id) ||
                (await getAssignmentDetails(id))
              : assessments.find((assessment) => assessment._id === id) ||
                (await getQuizDetails(id));

          if (!assessment.error) {
            handleOpenSubmissions(assessment.data);
          }
        }

        // Fetch submissions for the selected assessment
        const submissions =
          type === "assignment"
            ? await getAssignmentSubmissions(id, submissionsPage)
            : await getSubmissionsForQuiz(id, submissionsPage);

        //this runs if the page is reloaded while grading a submission
        //we assign the selected submission based on the url param
        if (submission && !selectedSubmission && !submissions.error) {
          const tempSubmission = submissions.data.find(
            (sub) => sub._id === submission
          );

          if (tempSubmission) {
            setSelectedSubmission(tempSubmission);
            setGradeNow(true);
          }
        }

        setSubmissions(!submissions.error ? submissions.data : []);
      }
    };
    fetchSubmissions();
  }, [selectedAssessment, submissionsPage]);

  //useEffect to update assessments when type changes
  useEffect(() => {
    setAssessments(
      type === "assignment"
        ? assessmentsHolder.assignments
        : assessmentsHolder.quizzes
    );
  }, [type]);

  const getProgressPercentage = (gradedCount, totalStudents) => {
    const fraction = gradedCount / totalStudents;
    return Math.round(fraction * 100);
  };

  const handleOpenSubmissions = (assessment) => {
    setSelectedAssessment(assessment);
    !isOpened && pushUrlParams("open", assessment._id);
    setOpenSubmissions(true);
  };

  const handleCloseSubmissions = () => {
    navigate(`/dashboard/grading?type=${type}`);
    setSelectedAssessment(null);
    setOpenSubmissions(false);
    setSubmissions([]);
    setSubmissionsPage(1);
  };

  const handleGetAssessments = (assessmentType) => {
    navigate(`/dashboard/grading?type=${assessmentType}`);
    setShowTypeDropdown(false);
  };

  const handleOpenForGrading = (submission) => {
    setSelectedSubmission(submission);
    pushUrlParams("submission", submission._id);
    setGradeNow(true);
  };

  const handleCloseGradingSession = () => {
    removeUrlParams("submission");
    setSelectedSubmission(null);
    setGradeNow(false);
  };

  return (
    <>
      {gradeNow ? (
        <Grade
          {...{
            selectedAssessment,
            selectedSubmission,
            handleCloseGradingSession,
          }}
        />
      ) : (
        <div className={styles.gradingContainer}>
          <div className={styles.left}>
            <div className={styles.header}>
              <h2>Grade {getAssessmentType(type)}</h2>
              {!openSubmissions ? (
                <div className={unitDropdown}>
                  <button
                    className={`${unitButton} ${styles.filterAssessments}`}
                    onClick={() => setShowTypeDropdown((prev) => !prev)}
                  >
                    {getAssessmentType(type)} ▾
                  </button>
                  {showTypeDropdown && (
                    <div className={dropdownMenu}>
                      <div
                        className={dropdownOption}
                        onClick={() => handleGetAssessments("assignment")}
                      >
                        Assignments
                      </div>
                      <div
                        className={dropdownOption}
                        onClick={() => handleGetAssessments("quiz")}
                      >
                        Quizzes
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className={styles.closeSubmissions}
                  onClick={handleCloseSubmissions}
                >
                  <i className="fa-solid fa-left-long"></i>
                  <p>Back</p>
                </button>
              )}
            </div>

            {/* Assignments List */}
            <div className={styles.assignmentsSection}>
              <h3>{openSubmissions && selectedAssessment.title}</h3>
              <div className={styles.assignmentsList}>
                {!openSubmissions &&
                  assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className={`${styles.assignmentCard} ${
                        selectedAssessment?.id === assessment.id
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleOpenSubmissions(assessment)}
                    >
                      <div className={styles.assignmentHeader}>
                        <h3>{assessment.title}</h3>
                      </div>
                      <div className={styles.assignmentDetails}>
                        <div className={styles.progress}>
                          <div className={styles.progressBar}>
                            <div
                              className={`${styles.progressFill} ${
                                getProgressPercentage(
                                  assessment.gradedCount,
                                  assessment.enrolledStudentsCount
                                ) < 40
                                  ? styles.sunBackground
                                  : getProgressPercentage(
                                      assessment.gradedCount,
                                      assessment.enrolledStudentsCount
                                    ) < 100
                                  ? styles.ceruleanBackground
                                  : styles.pineBackground
                              }`}
                              style={{
                                width: `${getProgressPercentage(
                                  assessment.gradedCount,
                                  assessment.enrolledStudentsCount
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className={styles.progressText}>
                            <span className={styles.gradedCount}>
                              {assessment.gradedCount}
                            </span>
                            /{assessment.enrolledStudentsCount} graded
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {openSubmissions && (
                  <div className={styles.extraDetails}>
                    <div className={styles.extraItem}>
                      <h4>Submissions : </h4>{" "}
                      <p>
                        {selectedAssessment.submissionCount}/
                        {selectedAssessment.enrolledStudentsCount}
                      </p>
                    </div>
                    <div className={styles.extraItem}>
                      <h4>Time to deadline : </h4>{" "}
                      <p>{handleDueDate(selectedAssessment.deadLine)}</p>
                    </div>
                    <div className={styles.extraItem}>
                      <h4>Status : </h4>{" "}
                      <p>
                        {handleDueDate(selectedAssessment.deadLine) !==
                        "Overdue"
                          ? "Not ready for marking"
                          : "Ready for marking"}
                      </p>
                    </div>
                    <div className={styles.extraItem}>
                      <h4>Marked : </h4> <p>{selectedAssessment.gradedCount}</p>
                    </div>
                    <div className={styles.extraItem}>
                      <h4>Not marked : </h4>{" "}
                      <p>
                        {selectedAssessment.enrolledStudentsCount -
                          selectedAssessment.gradedCount -
                          selectedAssessment.inProgressCount}
                      </p>
                    </div>
                    <div className={styles.extraItem}>
                      <h4>In Progress : </h4>{" "}
                      <p>{selectedAssessment.inProgressCount}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.header}>
              <h3>Submissions</h3>
              {openSubmissions && (
                <select
                  className={styles.filterAssessments}
                  defaultValue={"all"}
                >
                  <option>All</option>
                  <option>Not marked</option>
                  <option>Marked</option>
                  <option>In progress</option>
                </select>
              )}
            </div>
            {/* Student Submissions */}
            <div className={styles.submissionsSection}>
              {!selectedAssessment && (
                <div className={styles.emptyState}>
                  <i className="fas fa-clipboard-check"></i>
                  <p>
                    Select an assessment from the list to view student
                    submissions
                  </p>
                </div>
              )}
              {selectedAssessment && (
                <div className={styles.submissionsList}>
                  {submissions.map((submission) => (
                    <div
                      key={submission._id}
                      className={styles.submissionCard}
                      onClick={() => handleOpenForGrading(submission)}
                    >
                      <div className={styles.studentInfo}>
                        <div className={styles.studentAvatar}>
                          <i className="fas fa-user"></i>
                        </div>
                        <div className={styles.studentDetails}>
                          <h4>
                            {submission.student.firstName}{" "}
                            {submission.student.lastName}
                          </h4>
                          <p className={styles.submissionTime}>
                            Submitted: {submission.submittedAt}
                          </p>
                        </div>
                      </div>

                      <div className={styles.gradeSection}>
                        <span
                          className={`${styles.status} ${
                            styles[submission.gradingStatus]
                          }`}
                        >
                          {submission.gradingStatus === "graded"
                            ? "Graded"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className={styles.nextPrev}>
                    {submissions.length === 0 && (
                      <p>No submissions available</p>
                    )}
                    {submissionsPage > 1 && (
                      <button
                        onClick={() => setSubmissionsPage(submissionsPage - 1)}
                      >
                        Previous
                      </button>
                    )}
                    {submissionsPage * 50 <=
                      selectedAssessment.submissionCount && (
                      <button
                        onClick={() => setSubmissionsPage(submissionsPage + 1)}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Submissions;
