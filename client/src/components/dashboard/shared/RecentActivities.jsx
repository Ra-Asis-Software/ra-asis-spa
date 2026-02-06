import styles from "./RecentActivities.module.css";
import cardStyles from "../assessments/AssessmentCard.module.css";

const RecentActivities = ({ activities, role }) => {
  return (
    <div
      className={`${styles.card} ${
        role === "student"
          ? cardStyles.studentCard
          : role === "teacher"
          ? cardStyles.teacherCard
          : role === "parent" && cardStyles.parentCard
      }`}
    >
      <h3>Recent Activities</h3>
      <ul className={styles.list}>
        {activities.map((activity, idx) => (
          <li key={idx} className={styles.item}>
            <div className={styles.detail}>
              <strong>{activity.type}</strong> – {activity.event}
            </div>
            <div className={styles.timestamp}>
              {activity.date} at {activity.time}
            </div>
          </li>
        ))}
        {activities.length === 0 && <li>No recent activities recorded</li>}
      </ul>
    </div>
  );
};

export default RecentActivities;
