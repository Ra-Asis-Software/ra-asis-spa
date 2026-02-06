import { useState, useEffect } from "react";
import styles from "./Assessments.module.css";
import { getMilliSeconds } from "../../../utils/assessmentUtils.js";

const QuizTimer = ({
  startedAt,
  timeLimit,
  submissionStatus,
  quizSystemSubmitted,
  onTimeIsUp,
  studentAnswers,
}) => {
  const [timeLeft, setTimeLeft] = useState(
    getMilliSeconds(timeLimit) - (Date.now() - new Date(startedAt).getTime())
  );
  const { unit } = timeLimit;
  const isInProgress = submissionStatus === "started";

  useEffect(() => {
    if (isInProgress) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            //we want to cutoff the student and submit whatever they've done
            clearInterval(timerId);
            quizSystemSubmitted.current = true;
            onTimeIsUp();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [studentAnswers]);

  const hours = isInProgress ? Math.floor(timeLeft / 3600000) : 0;
  const minutes = isInProgress ? Math.floor((timeLeft % 3600000) / 60000) : 0;
  const seconds = isInProgress ? Math.floor((timeLeft % 60000) / 1000) : 0;

  return (
    <div className={styles.quizTimer}>
      Time left {unit === "hours" && `${hours}:`}
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default QuizTimer;
