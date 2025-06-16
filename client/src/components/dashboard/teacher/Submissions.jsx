import React from "react";
import styles from "../css/SubmissionsTable.module.css";

// Mock data for display
const mockSubmissions = [
  {
    _id: "1",
    title: "Math Homework 1",
    submissionStatus: "15/20",
    evaluationStatus: "Start",
    assignedDate: "2025-06-05T10:00:00Z",
  },
  {
    _id: "2",
    title: "Math Project",
    submissionStatus: "19/20",
    evaluationStatus: "Completed",
    assignedDate: "2025-06-03T08:30:00Z",
  },
  {
    _id: "3",
    title: "Math homework 2",
    submissionStatus: "20/20",
    evaluationStatus: "Overdue",
    assignedDate: "2025-06-01T15:45:00Z",
  },
  {
    _id: "4",
    title: "Math homework 3",
    submissionStatus: "20/20",
    evaluationStatus: "pending",
    assignedDate: "2025-06-01T15:45:00Z",
  },
];

const SubmissionsTable = () => {
  return (
    <div className={styles.submissionsWrapper}>
      <h3>Assignment Submissions</h3>
      <table className={styles.submissionsTable}>
        <thead>
          <tr>
            <th>Assignment Title</th>
            <th>Submission Status</th>
            <th>Evaluation Status</th>
            <th>Assigned Date</th>
          </tr>
        </thead>
        <tbody>
          {mockSubmissions.map((submission) => (
            <tr key={submission._id}>
              <td>{submission.title}</td>
              <td>{submission.submissionStatus}</td>
              <td>{submission.evaluationStatus}</td>
              <td>{new Date(submission.assignedDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
