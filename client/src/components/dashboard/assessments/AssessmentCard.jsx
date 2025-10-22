import { shortenContent, shortenTitle } from "../../../utils/assessments";
import styles from "../css/AssessmentCard.module.css";
import { useNavigate } from "react-router-dom";

const AssessmentCard = ({
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
      <h4 className={styles.unit}>{shortenTitle(unitName)}</h4>
      <p className={styles.title}>{shortenContent(title)}</p>
      <div
        className={`${styles.status} ${
          styles[status.toLowerCase().replace(/\s/g, "")]
        }`}
      >
        <button
          className={styles.viewButton}
          onClick={() =>
            navigate(`/dashboard/assessments?type=assignment&open=${id}`)
          }
        >
          View
        </button>
        {status}
      </div>
    </div>
  );
};

export default AssessmentCard;
