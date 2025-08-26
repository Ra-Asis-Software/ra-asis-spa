import styles from "../dashboard/css/CreateOptionsContent.module.css";

const CreateOptionsContent = ({
  onClose,
  onCreateQuiz,
  onCreateAssignment,
}) => {
  const handleCreateQuiz = () => {
    onClose();
    if (onCreateQuiz) onCreateQuiz();
  };

  const handleCreateAssignment = () => {
    onClose();
    if (onCreateAssignment) onCreateAssignment();
  };

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>What would you like to create?</h2>
        <div className={styles.buttonContainer}>
          <button
            onClick={handleCreateQuiz}
            className={`${styles.button} ${styles.quizButton}`}
          >
            <span>📝</span>
            <span>Create Quiz</span>
          </button>
          <button
            onClick={handleCreateAssignment}
            className={`${styles.button} ${styles.assignmentButton}`}
          >
            <span>📚</span>
            <span>Create Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOptionsContent;
