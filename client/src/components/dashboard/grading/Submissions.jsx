import { useState } from "react";
import styles from "../css/Grading.module.css";
import Grade from "./Grade";

const Submissions = () => {
  // Dummy assignments
  const [assignments] = useState([
    {
      _id: "68b8036677c0e98218ea2cb6",
      title: "Math Quiz Chapter 5",
      subject: "Mathematics",
      dueDate: "2025-09-10",
      totalMarks: 100,
      totalStudents: 25,
      gradedCount: 20,
    },
  ]);

  // Dummy submissions structure
  const [submissions] = useState([
    {
      _id: "68ba93b913ee2270ec54b68d",
      assignment: "68b8036677c0e98218ea2cb6",
      student: {
        _id: "68b6a78cfc12d04dde873aab",
        name: "John Smith",
      },
      content: {
        "4ed86615-d24c-43ad-b378-36a693847d48": {
          userAnswer: "The derivative of x² + 3x + 2 is 2x + 3",
          correctAnswer: "2x + 3",
          marks: 18,
        },
        "c223d62f-62d8-4e51-9dcb-45a4d4eaad29": {
          userAnswer: "x = 1.5 or x = 1",
          correctAnswer: "x = 3/2 or x = 1",
          marks: 20,
        },
      },
      files: [],
      marks: 0,
      submissionStatus: "on-time",
      gradingStatus: "in-progress",
      submittedAt: "2025-09-05T07:39:37.592+00:00",
    },
    {
      _id: "68ba93b913ee2270ec54b68e",
      assignment: "68b8036677c0e98218ea2cb6",
      student: {
        _id: "68b6a78cfc12d04dde873aac",
        name: "Emma Johnson",
      },
      content: {
        "4ed86615-d24c-43ad-b378-36a693847d48": {
          userAnswer: "2x + 3",
          correctAnswer: "2x + 3",
          marks: 20,
        },
        "c223d62f-62d8-4e51-9dcb-45a4d4eaad29": {
          userAnswer: "x = 3/2 or x = 1",
          correctAnswer: "x = 3/2 or x = 1",
          marks: 25,
        },
      },
      files: [],
      marks: 0,
      submissionStatus: "on-time",
      gradingStatus: "graded",
      submittedAt: "2025-09-05T08:15:00.000+00:00",
    },
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openSubmissions, setOpenSubmissions] = useState(false);

  const getProgressPercentage = (gradedCount, totalStudents) =>
    Math.round((gradedCount / totalStudents) * 100);

  const handleOpenForGrading = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenSubmissions(true);
  };

  const handleCloseSubmissions = () => {
    setSelectedAssignment(null);
    setOpenSubmissions(false);
    setSelectedSubmission(null);
  };

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleBackToSubmissions = () => setSelectedSubmission(null);

  // If grading a submission
  if (selectedSubmission) {
    return (
      <Grade
        submission={selectedSubmission}
        assignment={selectedAssignment}
        onBack={handleBackToSubmissions}
      />
    );
  }

  return (
    <div className={styles.gradingContainer}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h2>Grade Assessments</h2>
          {!openSubmissions ? (
            <select className={styles.filterAssessments}>
              <option>Assignments</option>
              <option>Quizzes</option>
            </select>
          ) : (
            <button className={styles.closeSubmissions} onClick={handleCloseSubmissions}>
              <i className="fa-solid fa-left-long"></i>
              <p>Back</p>
            </button>
          )}
        </div>

        <div className={styles.assignmentsSection}>
          <h3>{openSubmissions ? selectedAssignment.title : "Assessments"}</h3>
          <div className={styles.assignmentsList}>
            {!openSubmissions &&
              assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className={`${styles.assignmentCard} ${
                    selectedAssignment?._id === assignment._id ? styles.selected : ""
                  }`}
                  onClick={() => handleOpenForGrading(assignment)}
                >
                  <div className={styles.assignmentHeader}>
                    <h3>{assignment.title}</h3>
                    <span className={styles.subject}>{assignment.subject}</span>
                  </div>
                  <div className={styles.assignmentDetails}>
                    <div className={styles.progress}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${getProgressPercentage(
                              assignment.gradedCount,
                              assignment.totalStudents
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>
                        {assignment.gradedCount}/{assignment.totalStudents} graded
                      </span>
                    </div>
                  </div>
                </div>
              ))}

            {openSubmissions && (
              <div className={styles.extraDetails}>
                <div className={styles.extraItem}>
                  <h4>Submissions:</h4> <p>{submissions.length}</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Status:</h4> <p>In Progress</p>
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
            <select className={styles.filterAssessments} defaultValue={"all"}>
              <option>All</option>
              <option>Not marked</option>
              <option>Marked</option>
              <option>In progress</option>
            </select>
          )}
        </div>

        <div className={styles.submissionsSection}>
          {!selectedAssignment && (
            <div className={styles.emptyState}>
              <i className="fas fa-clipboard-check"></i>
              <p>Select an assignment from the list to view student submissions</p>
            </div>
          )}
          {selectedAssignment && (
            <div className={styles.submissionsList}>
              {submissions.map((submission) => (
                <div
                  key={submission._id}
                  className={styles.submissionCard}
                  onClick={() => handleSubmissionClick(submission)}
                >
                  <div className={styles.studentInfo}>
                    <div className={styles.studentAvatar}>
                      <i className="fas fa-user"></i>
                    </div>
                    <div className={styles.studentDetails}>
                      <h4 className={styles.studentName}>{submission.student.name}</h4>
                      <p className={styles.submissionTime}>
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className={styles.gradeSection}>
                    <span
                      className={`${styles.status} ${styles[submission.gradingStatus]}`}
                    >
                      {submission.gradingStatus}
                    </span>
                  </div>
                </div>
              ))}
              <div className={styles.nextPrev}>
                <button>Previous</button>
                <button>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submissions;
