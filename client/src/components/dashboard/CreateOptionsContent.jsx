import { useNavigate } from "react-router-dom";
import styles from "./css/CreateOptionsContent.module.css";

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
            <i className={`fa-solid fa-stopwatch-20`}></i>
            <span>Quiz</span>
          </button>
          <button
            onClick={handleAssignment}
            className={`${styles.button} ${styles.assignmentButton}`}
          >
            <i className={`fa-solid fa-file-pen`}></i>
            <span>Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOptionsContent;
