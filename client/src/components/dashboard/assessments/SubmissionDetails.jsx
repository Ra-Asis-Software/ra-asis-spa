import { handleDueDate, useUrlParams } from "../../../utils/assessmentUtils";
import styles from "../css/Assessments.module.css";
import { useNavigate } from "react-router-dom";

const SubmissionDetails = ({ currentAssessment }) => {
  const { type, isOpened } = useUrlParams();
  const navigate = useNavigate();

  const handleOpenSubmissions = () => {
    navigate(`/dashboard/grading?type=${type}&open=${isOpened}`);
  };
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
        <button
          className={styles.addAssignment}
          onClick={handleOpenSubmissions}
        >
          Open submissions
        </button>
      </div>
    </div>
  );
};

export default SubmissionDetails;
