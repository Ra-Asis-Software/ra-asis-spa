import { handleDueDate } from "../../../utils/assessments";
import styles from "../css/Assessments.module.css";

const SubmissionDetails = ({ currentAssessment }) => {
  return (
    <div className={styles.tools}>
      <div className={styles.toolsArea}>
        <h3>Submission Details</h3>
        <span className={styles.submissionDetails}>
          <p>Created on: {currentAssessment.createdAt?.slice(0, 10)}</p>
        </span>
        <span className={styles.submissionDetails}>
          <p>Deadline: {handleDueDate(currentAssessment.deadLine)}</p>
        </span>
        <span className={styles.submissionDetails}>
          <p>
            Submissions made:{" "}
            {`${currentAssessment.submissionCount} / ${currentAssessment.enrolledStudentsCount}`}
          </p>
        </span>
        <button className={styles.addAssignment}>Open submissions</button>
      </div>
    </div>
  );
};

export default SubmissionDetails;
