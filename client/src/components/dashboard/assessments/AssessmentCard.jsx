import {
  handleDueDateShort,
  shortenContent,
  shortenTitle,
} from "../../../utils/assessments";
import styles from "../css/AssessmentCard.module.css";
import { useNavigate } from "react-router-dom";

const AssessmentCard = ({
  unitName,
  dueDate,
  title = "Assignment for Unit",
  id,
  role,
  type,
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
      <div className={styles.titleSection}>
        <h4 className={styles.unit}>{shortenTitle(unitName)}</h4>
        <h5 className={styles.assessmentType}>{type?.at(0)?.toUpperCase()}</h5>
      </div>
      <p className={styles.title}>{shortenContent(title)}</p>
      <div className={`${styles.status}`}>
        <button
          className={styles.viewButton}
          onClick={() =>
            navigate(`/dashboard/assessments?type=assignment&open=${id}`)
          }
        >
          View
        </button>
        {handleDueDateShort(dueDate)}
      </div>
    </div>
  );
};

export default AssessmentCard;
