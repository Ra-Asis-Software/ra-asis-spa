import { useEffect, useState } from "react";
import styles from "../css/Summary.module.css";

const Summary = ({ unitCode }) => {
  const [progressData, setProgressData] = useState([
    { label: "Completed", percent: 0, class: styles.completed },
    { label: "Pending", percent: 0, class: styles.pending },
    { label: "Overdue", percent: 0, class: styles.overdue },
  ]);
  const [progressWidths, setProgressWidths] = useState(["0%", "0%", "0%"]);

  useEffect(() => {
    const fetchData = async () => {
      if (!unitCode) return;

      try {
        const res = await fetch(`/api/unit/assignment-summary/${unitCode}`);
        const data = await res.json();

        const updated = [
          { label: "Completed", percent: data.completed || 0, class: styles.completed },
          { label: "Pending", percent: data.pending || 0, class: styles.pending },
          { label: "Overdue", percent: data.overdue || 0, class: styles.overdue },
        ];

        setProgressData(updated);

        setTimeout(() => {
          setProgressWidths(updated.map((item) => `${item.percent}%`));
        }, 100);
      } catch (error) {
        console.error("Failed to fetch unit summary", error);
      }
    };

    fetchData();
  }, [unitCode]);

  return (
    <div className={styles.summarySection}>
      <h3>Summary of Assignments</h3>
      <div className={styles.progressBars}>
        {progressData.map((item, index) => (
          <div key={index} className={styles.progressRow}>
            <div className={styles.labelRow}>
              <span>{item.label}</span>
              <span>{item.percent}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={`${styles.progressFill} ${item.class}`}
                style={{ width: progressWidths[index] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
