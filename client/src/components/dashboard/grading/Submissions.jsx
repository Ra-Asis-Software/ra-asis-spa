import { useState } from "react";
import styles from "../css/Grading.module.css";

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
    {
      id: 3,
      title: "English Essay",
      subject: "English",
      dueDate: "2025-09-08",
      totalMarks: 50,
      totalStudents: 30,
      gradedCount: 30,
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
  const [openSubmissions, setOpenSubmissions] = useState(false);

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

  const handleOpenForGrading = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenSubmissions(true);
  };

  const handleCloseSubmissions = () => {
    setSelectedAssignment(null);
    setOpenSubmissions(false);
  };

  return (
    <div className={styles.gradingContainer}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h2>Grade Assessments</h2>
          {!openSubmissions ? (
            <select
              className={styles.filterAssessments}
              defaultValue={"Assignments"}
            >
              <option>Assignments</option>
              <option>Quizzes</option>
            </select>
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
          <h3>{openSubmissions ? selectedAssignment.title : "Assessments"}</h3>
          <div className={styles.assignmentsList}>
            {!openSubmissions &&
              assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`${styles.assignmentCard} ${
                    selectedAssignment?.id === assignment.id
                      ? styles.selected
                      : ""
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
                        {assignment.gradedCount}/{assignment.totalStudents}{" "}
                        graded
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            {openSubmissions && (
              <div className={styles.extraDetails}>
                <div className={styles.extraItem}>
                  <h4>Submissions : </h4> <p>30/40</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Time to deadline : </h4> <p>4 hours</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Status : </h4> <p>Not ready for marking</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Marked : </h4> <p>0</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>Not marked : </h4> <p>40</p>
                </div>
                <div className={styles.extraItem}>
                  <h4>In Progress : </h4> <p>0</p>
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
        {/* Student Submissions */}
        <div className={styles.submissionsSection}>
          {!selectedAssignment && (
            <div className={styles.emptyState}>
              <i className="fas fa-clipboard-check"></i>
              <p>
                Select an assignment from the list to view student submissions
              </p>
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
