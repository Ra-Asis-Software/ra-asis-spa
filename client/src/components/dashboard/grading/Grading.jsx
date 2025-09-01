import { useState } from "react";
import styles from "../css/Grading.module.css";

const Grading = () => {
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

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradingData, setGradingData] = useState({
    marks: "",
    penalty: "",
    comment: "",
  });

  const [students] = useState([
    {
      id: 1,
      name: "John Smith",
      grade: 85,
      status: "graded",
      submittedAt: "2025-09-08 10:30 AM",
      isLate: false,
      penalty: 0,
      comment: "Great work! Clear understanding of concepts.",
    },
    {
      id: 2,
      name: "Emma Johnson",
      grade: 92,
      status: "graded",
      submittedAt: "2025-09-08 09:15 AM",
      isLate: false,
      penalty: 0,
      comment: "Excellent performance. Well structured answers.",
    },
    {
      id: 3,
      name: "Michael Brown",
      grade: 78,
      status: "graded",
      submittedAt: "2025-09-08 11:45 AM",
      isLate: false,
      penalty: 0,
      comment: "Good effort. Review chapter 3 concepts.",
    },
    {
      id: 4,
      name: "Sarah Davis",
      grade: null,
      status: "pending",
      submittedAt: "2025-09-11 02:20 PM",
      isLate: true,
      penalty: 10,
      comment: "",
    },
    {
      id: 5,
      name: "David Wilson",
      grade: 88,
      status: "graded",
      submittedAt: "2025-09-08 08:30 AM",
      isLate: false,
      penalty: 0,
      comment: "Very good work. Minor calculation errors in Q3.",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      grade: null,
      status: "pending",
      submittedAt: "2025-09-12 03:45 PM",
      isLate: true,
      penalty: 15,
      comment: "",
    },
  ]);

  const getGradeColor = (grade) => {
    if (grade >= 90) return styles.excellent;
    if (grade >= 80) return styles.good;
    if (grade >= 70) return styles.average;
    return styles.needsImprovement;
  };

  const getProgressPercentage = (gradedCount, totalStudents) => {
    return Math.round((gradedCount / totalStudents) * 100);
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setGradingData({
      marks: student.grade || "",
      penalty: student.penalty || "",
      comment: student.comment || "",
    });
  };

  const handleGradingSubmit = () => {
    console.log("Grading submitted:", {
      studentId: selectedStudent.id,
      marks: gradingData.marks,
      penalty: gradingData.penalty,
      comment: gradingData.comment,
      finalGrade: gradingData.marks - gradingData.penalty,
    });

    // Close the grading panel
    setSelectedStudent(null);
    setGradingData({ marks: "", penalty: "", comment: "" });
  };

  const handleInputChange = (field, value) => {
    setGradingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.gradingContainer}>
      <div className={styles.header}>
        <h1>Grading Dashboard</h1>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <i className="fas fa-clipboard-list"></i>
            <div>
              <span className={styles.statNumber}>{assignments.length}</span>
              <span className={styles.statLabel}>Total Assignments</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-users"></i>
            <div>
              <span className={styles.statNumber}>83</span>
              <span className={styles.statLabel}>Total Students</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-check-circle"></i>
            <div>
              <span className={styles.statNumber}>65</span>
              <span className={styles.statLabel}>Graded Submissions</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Assignments List */}
        <div className={styles.assignmentsSection}>
          <h2>Assignments</h2>
          <div className={styles.assignmentsList}>
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className={`${styles.assignmentCard} ${
                  selectedAssignment?.id === assignment.id
                    ? styles.selected
                    : ""
                }`}
                onClick={() => setSelectedAssignment(assignment)}
              >
                <div className={styles.assignmentHeader}>
                  <h3>{assignment.title}</h3>
                  <span className={styles.subject}>{assignment.subject}</span>
                </div>
                <div className={styles.assignmentDetails}>
                  <div className={styles.dueDate}>
                    <i className="fas fa-calendar"></i>
                    <span>Due: {assignment.dueDate}</span>
                  </div>
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
          </div>
        </div>

        {/* Student Submissions */}
        <div className={styles.submissionsSection}>
          <h2>
            {selectedAssignment
              ? `${selectedAssignment.title} - Submissions`
              : "Select an assignment to view submissions"}
          </h2>

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
                        {student.isLate && (
                          <span className={styles.lateIndicator}>LATE</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className={styles.gradeSection}>
                    {student.status === "graded" ? (
                      <div
                        className={`${styles.grade} ${getGradeColor(
                          student.grade
                        )}`}
                      >
                        {student.grade}%
                      </div>
                    ) : (
                      <button className={styles.gradeButton}>Grade Now</button>
                    )}
                    <span
                      className={`${styles.status} ${styles[student.status]}`}
                    >
                      {student.status === "graded" ? "Graded" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!selectedAssignment && (
            <div className={styles.emptyState}>
              <i className="fas fa-clipboard-check"></i>
              <p>
                Select an assignment from the list to view student submissions
              </p>
            </div>
          )}
        </div>

        {/* Grading Panel */}
        {selectedStudent && (
          <div className={styles.gradingPanel}>
            <div className={styles.gradingHeader}>
              <h3 className={styles.gradingTitle}>Grade Submission</h3>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedStudent(null)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className={styles.gradingContent}>
              <div className={styles.studentSummary}>
                <div className={styles.summaryItem}>
                  <label>Student:</label>
                  <span>{selectedStudent.name}</span>
                </div>
                <div className={styles.summaryItem}>
                  <label>Assignment:</label>
                  <span>{selectedAssignment.title}</span>
                </div>
                <div className={styles.summaryItem}>
                  <label>Submitted:</label>
                  <span>{selectedStudent.submittedAt}</span>
                </div>
                <div className={styles.summaryItem}>
                  <label>Status:</label>
                  <span
                    className={`${styles.submissionStatus} ${
                      selectedStudent.isLate ? styles.late : styles.onTime
                    }`}
                  >
                    {selectedStudent.isLate ? "Late Submission" : "On Time"}
                  </span>
                </div>
              </div>

              <div className={styles.gradingForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="penalty">Penalty Marks:</label>
                  <input
                    type="number"
                    id="penalty"
                    value={gradingData.penalty}
                    onChange={(e) =>
                      handleInputChange("penalty", e.target.value)
                    }
                    placeholder="Late submission penalty"
                    min="0"
                  />
                  <span className={styles.penaltyNote}>
                    {selectedStudent.isLate
                      ? `Suggested: ${selectedStudent.penalty} marks`
                      : "No penalty"}
                  </span>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="totalMarks">Total Marks:</label>
                  <input
                    type="number"
                    id="totalMarks"
                    value={gradingData.marks}
                    onChange={(e) => handleInputChange("marks", e.target.value)}
                    placeholder={`Out of ${selectedAssignment.totalMarks}`}
                    min="0"
                    max={selectedAssignment.totalMarks}
                  />
                  <span className={styles.maxMarks}>
                    / {selectedAssignment.totalMarks}
                  </span>
                </div>

                <div className={styles.finalGrade}>
                  <label>Final Grade:</label>
                  <span className={styles.finalGradeValue}>
                    {gradingData.marks && gradingData.penalty !== ""
                      ? `${gradingData.marks - (gradingData.penalty || 0)}/${
                          selectedAssignment.totalMarks
                        }`
                      : "--"}
                  </span>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="comment">Comments:</label>
                  <textarea
                    id="comment"
                    value={gradingData.comment}
                    onChange={(e) =>
                      handleInputChange("comment", e.target.value)
                    }
                    placeholder="Leave feedback for the student..."
                    rows="4"
                  />
                </div>

                <button
                  className={styles.finishGradingButton}
                  onClick={handleGradingSubmit}
                  disabled={!gradingData.marks}
                >
                  <i className="fas fa-check"></i>
                  Finish Grading
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grading;
