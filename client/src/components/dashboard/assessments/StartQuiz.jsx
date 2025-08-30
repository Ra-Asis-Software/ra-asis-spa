import { handleDueDate } from "../../../utils/assessments";
import styles from "../css/Assessments.module.css";

const StartQuiz = ({ quiz, handleStartQuiz }) => {
  return (
    <div className={styles.startQuizContainer}>
      <h3>{quiz.title?.toUpperCase()}</h3>
      <h4>This quiz is {handleDueDate(quiz.deadLine)}</h4>
      <h4>
        The quiz should be done within {quiz.timeLimit.value}{" "}
        {quiz.timeLimit.unit}
      </h4>
      <h4>Good luck</h4>
      <button className={styles.startQuizButton} onClick={handleStartQuiz}>
        START NOW
      </button>
    </div>
  );
};

export default StartQuiz;
