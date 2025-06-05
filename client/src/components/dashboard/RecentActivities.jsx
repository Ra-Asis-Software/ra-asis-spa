import React from 'react';
import styles from './css/RecentActivities.module.css';

const RecentActivities = ({ subject, activities }) => {
  if (!subject || activities.length === 0) return null;

  return (
    <div className={styles.card}>
      <h3>Recent Activities</h3>
      <ul className={styles.list}>
        {activities.map((activity, idx) => (
          <li key={idx} className={styles.item}>
            <div className={styles.detail}>
              <strong>{activity.type}</strong> – {activity.item}
            </div>
            <div className={styles.timestamp}>
              {activity.date} at {activity.time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
