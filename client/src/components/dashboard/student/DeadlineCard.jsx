import React from "react";
import styles from "../css/DeadlineCard.module.css";

const DeadlineCard = ({ subject, deadlines = [] }) => {
  if (!subject) {
    return (
      <div className={styles.placeholder}>
        Please select a subject to view deadlines.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>{subject} Deadlines</h3>
      {deadlines.length === 0 ? (
        <p className={styles.noDeadlines}>No upcoming deadlines.</p>
      ) : (
        <ul className={styles.list}>
          {deadlines.map((deadline, idx) => (
            <li key={idx} className={styles.deadlineItem}>
              <div className={styles.title}>{deadline.event}</div>
              {/* {deadline.note && <div className={styles.note}>{deadline.note}</div>} */}
              <div className={styles.date}>Due: {deadline.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeadlineCard;
