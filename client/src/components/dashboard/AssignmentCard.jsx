import styles from "./css/AssignmentCard.module.css";
import { useNavigate } from "react-router-dom";

const AssignmentCard = ({
  unitName,
  status = "pending",
  title = "Assignment for Unit",
  id,
  role,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.card} ${
        role === "student"
          ? styles.studentCard
          : role === "teacher"
          ? styles.teacherCard
          : role === "parent" && styles.parentCard
      }`}
    >
      <h4 className={styles.unit}>{unitName}</h4>
      <p className={styles.title}>{title}</p>
      <div
        className={`${styles.status} ${
          styles[status.toLowerCase().replace(/\s/g, "")]
        }`}
      >
        <button
          className={styles.viewButton}
          onClick={() => navigate(`/dashboard/assignments?open=${id}`)}
        >
          View
        </button>
        {status}
      </div>
    </div>
  );
};

export default AssignmentCard;
