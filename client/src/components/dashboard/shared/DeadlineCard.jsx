import styles from "./DeadlineCard.module.css";
import cardStyles from "../assessments/AssessmentCard.module.css";

const DeadlineCard = ({ unit, deadlines = [], role }) => {
  if (!unit) {
    return (
      <div className={styles.placeholder}>
        Please select a subject to view deadlines.
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${
        role === "student"
          ? cardStyles.studentCard
          : role === "teacher"
          ? cardStyles.teacherCard
          : role === "parent" && cardStyles.parentCard
      }`}
    >
      <h3 className={styles.heading}>{unit} Deadlines</h3>
      {deadlines.length === 0 ? (
        <p className={styles.noDeadlines}>No upcoming deadlines.</p>
      ) : (
        <ul className={styles.list}>
          {deadlines.map((deadline, idx) => (
            <li key={idx} className={styles.deadlineItem}>
              <div className={styles.title}>{deadline.event}</div>
              <div className={styles.date}>Due: {deadline.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeadlineCard;
