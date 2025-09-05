import { useState } from "react";
import styles from "../css/Grading.module.css";
import Grade from "./Grade";

const Submissions = () => {
  // Dummy data for assignments and students
  const [assignments] = useState([
    {
      id: 1,
      title: "Math Quiz Chapter 5",
      subject: "Mathematics",
      dueDate: "2025-09-10",
      totalMarks: 100,
      totalStudents: 25,
      gradedCount: 20,
    },
    {
      id: 2,
      title: "Science Lab Report",
      subject: "Physics",
      dueDate: "2025-09-15",
      totalMarks: 80,
      totalStudents: 28,
      gradedCount: 15,
    },
    {
      id: 3,
      title: "English Essay",
      subject: "English",
      dueDate: "2025-09-08",
      totalMarks: 50,
      totalStudents: 30,
      gradedCount: 30,
    },
  ]);

  const [questions] = useState([
    { id: 1, question: "What is the derivative of x² + 3x + 2?", maxMarks: 20 },
    { id: 2, question: "Solve the quadratic equation: 2x² - 5x + 3 = 0", maxMarks: 25 },
    { id: 3, question: "Explain the chain rule in calculus with an example.", maxMarks: 30 },
    { id: 4, question: "Calculate the area under the curve y = x² from x = 0 to x = 3", maxMarks: 25 },
  ]);

  const [students] = useState([
    {
      id: 1,
      name: "John Smith",
      grade: 85,
      status: "graded",
      submittedAt: "2025-09-08 10:30 AM",
      isLate: false,
      answers: [
        { questionId: 1, answer: "The derivative of x² + 3x + 2 is 2x + 3", marks: 18 },
        { questionId: 2, answer: "x = 1.5 or x = 1", marks: 20 },
        { questionId: 3, answer: "Chain rule explained with example", marks: 25 },
        { questionId: 4, answer: "∫₀³ x² dx = 9", marks: 22 },
      ],
    },
    {
      id: 2,
      name: "Emma Johnson",
      grade: 92,
      status: "graded",
      submittedAt: "2025-09-08 09:15 AM",
      isLate: false,
      answers: [
        { questionId: 1, answer: "2x + 3", marks: 20 },
        { questionId: 2, answer: "x = 3/2 or x = 1", marks: 25 },
        { questionId: 3, answer: "Chain rule definition", marks: 28 },
        { questionId: 4, answer: "Area = 9", marks: 19 },
      ],
    },
    {
      id: 3,
      name: "Sarah Davis",
      grade: null,
      status: "pending",
      submittedAt: "2025-09-11 02:20 PM",
      isLate: true,
      answers: [
        { questionId: 1, answer: "The derivative is 2x + 3", marks: null },
        { questionId: 2, answer: "x = 1.5 and x = 1", marks: null },
        { questionId: 3, answer: "Chain rule with sin(x²) example", marks: null },
        { questionId: 4, answer: "Integral of x² from 0 to 3 equals 9", marks: null },
      ],
    },
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openSubmissions, setOpenSubmissions] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getProgressPercentage = (gradedCount, totalStudents) =>
    Math.round((gradedCount / totalStudents) * 100);

  const handleOpenForGrading = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenSubmissions(true);
  };

  const handleCloseSubmissions = () => {
    setSelectedAssignment(null);
    setOpenSubmissions(false);
    setSelectedStudent(null);
  };

  const handleStudentClick = (student) => setSelectedStudent(student);

  const handleBackToSubmissions = () => setSelectedStudent(null);

  // If grading page open
  if (selectedStudent) {
    return (
      <Grade
        student={selectedStudent}
        assignment={selectedAssignment}
        questions={questions}
        onBack={handleBackToSubmissions}
      />
    );
  }

  // Main Submissions Page
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

        {/* Assignments List */}
        <div className={styles.assignmentsSection}>
          <h3>{openSubmissions ? selectedAssignment.title : "Assessments"}</h3>
          <div className={styles.assignmentsList}>
            {!openSubmissions &&
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`${styles.assignmentCard} ${
                    selectedAssignment?.id === assignment.id ? styles.selected : ""
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
                  <h4>Submissions:</h4> <p>30/40</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Time to deadline:</h4> <p>4 hours</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Status:</h4> <p>Not ready for marking</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Marked:</h4> <p>0</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Not marked:</h4> <p>40</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>In Progress:</h4> <p>0</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submissions List */}
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
              {students.map((student) => (
                <div
                  key={student.id}
                  className={styles.submissionCard}
                  onClick={() => handleStudentClick(student)}
                >
                  <div className={styles.studentInfo}>
                    <div className={styles.studentAvatar}>
                      <i className="fas fa-user"></i>
                    </div>
                    <div className={styles.studentDetails}>
                      <h4 className={styles.studentName}>{student.name}</h4>
                      <p className={styles.submissionTime}>
                        Submitted: {student.submittedAt}
                      </p>
                    </div>
                  </div>
                  <div className={styles.gradeSection}>
                    <span
                      className={`${styles.status} ${styles[student.status]}`}
                    >
                      {student.status === "graded" ? "Graded" : "Pending"}
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
