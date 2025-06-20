import React from "react";
import styles from "./css/AssignmentCard.module.css";

const AssignmentCard = ({
  unitName,
  status = "pending",
  title = "Assignment for Unit",
  onView,
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.unit}>{unitName}</h3>
      <p className={styles.title}>{title}</p>
      <div
        className={`${styles.status} ${
          styles[status.toLowerCase().replace(/\s/g, "")]
        }`}
      >
        <button className={styles.viewButton} onClick={onView}>
          View
        </button>
        {status}
      </div>
    </div>
  );
};

export default AssignmentCard;
