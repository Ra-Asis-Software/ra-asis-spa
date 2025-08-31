import React, { useState } from "react";
import styles from "../css/Grading.module.css";

const Grading = () => {
  // Dummy data for assignments and students
  const [assignments] = useState([
    {
      id: 1,
      title: "Math Quiz Chapter 5",
      subject: "Mathematics",
      dueDate: "2025-09-10",
      totalStudents: 25,
      gradedCount: 20,
    },
    {
      id: 2,
      title: "Science Lab Report",
      subject: "Physics",
      dueDate: "2025-09-15",
      totalStudents: 28,
      gradedCount: 15,
    },
    {
      id: 3,
      title: "English Essay",
      subject: "English",
      dueDate: "2025-09-08",
      totalStudents: 30,
      gradedCount: 30,
    },
  ]);

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [students] = useState([
    {
      id: 1,
      name: "John Smith",
      grade: 85,
      status: "graded",
      submittedAt: "2025-09-08 10:30 AM",
    },
    {
      id: 2,
      name: "Emma Johnson",
      grade: 92,
      status: "graded",
      submittedAt: "2025-09-08 09:15 AM",
    },
    {
      id: 3,
      name: "Michael Brown",
      grade: 78,
      status: "graded",
      submittedAt: "2025-09-08 11:45 AM",
    },
    {
      id: 4,
      name: "Sarah Davis",
      grade: null,
      status: "pending",
      submittedAt: "2025-09-09 02:20 PM",
    },
    {
      id: 5,
      name: "David Wilson",
      grade: 88,
      status: "graded",
      submittedAt: "2025-09-08 08:30 AM",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      grade: null,
      status: "pending",
      submittedAt: "2025-09-09 03:45 PM",
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
                <div key={student.id} className={styles.submissionCard}>
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
      </div>
    </div>
  );
};

export default Grading;
