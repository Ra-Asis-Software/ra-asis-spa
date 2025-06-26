import styles from "./css/AssignmentCard.module.css";
import { useNavigate } from "react-router-dom";

const AssignmentCard = ({
  unitName,
  status = "pending",
  title = "Assignment for Unit",
  id,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.card}>
      <h3 className={styles.unit}>{unitName}</h3>
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
