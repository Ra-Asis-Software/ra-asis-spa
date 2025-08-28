import { useNavigate } from "react-router-dom";
import styles from "../dashboard/css/CreateOptionsContent.module.css";

const CreateOptionsContent = ({ open = false }) => {
  const navigate = useNavigate();
  const handleQuiz = () => {
    if (!open) navigate(`/dashboard/assessments?type=quiz&new=true`);
    else navigate(`/dashboard/assessments?type=quiz`);
  };

  const handleAssignment = () => {
    if (!open) navigate(`/dashboard/assessments?type=assignment&new=true`);
    else navigate(`/dashboard/assessments?type=assignment`);
  };

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          What would you like to {open ? "access" : "create"}?
        </h2>
        <div className={styles.buttonContainer}>
          <button
            onClick={handleQuiz}
            className={`${styles.button} ${styles.quizButton}`}
          >
            <span>📝</span>
            <span>Quiz</span>
          </button>
          <button
            onClick={handleAssignment}
            className={`${styles.button} ${styles.assignmentButton}`}
          >
            <span>📚</span>
            <span>Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOptionsContent;
