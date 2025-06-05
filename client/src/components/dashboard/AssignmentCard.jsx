import React from 'react';
import styles from './css/AssignmentCard.module.css';

const AssignmentCard = ({ title, teacher, status, mark, onView }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.teacher}>{teacher}</p>
      <button className={styles.viewButton} onClick={onView}>View</button>
      {status === 'Completed' && (
        <div className={styles.mark}>Score: {mark}</div>
      )}
      <div className={`${styles.status} ${styles[status.toLowerCase().replace(/\s/g, '')]}`}>
        {status}
      </div>
    </div>
  );
};

export default AssignmentCard;
