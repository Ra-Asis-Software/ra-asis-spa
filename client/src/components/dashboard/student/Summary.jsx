import { useEffect, useState } from "react";
import styles from "../css/Summary.module.css";
import { getAssignmentSummary } from "../../../services/unitService";

const Summary = ({ unitCode }) => {
  const [progressData, setProgressData] = useState([
    { label: "Completed", percent: 0, class: styles.completed },
    { label: "Pending", percent: 0, class: styles.pending },
    { label: "Overdue", percent: 0, class: styles.overdue },
  ]);
  const [progressWidths, setProgressWidths] = useState(["0%", "0%", "0%"]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!unitCode) return;

      try {
        const data = await getAssignmentSummary(unitCode);

        if (data.error) {
          setError(data.error);
          return;
        }

        const updated = [
          {
            label: "Completed",
            percent: data.completed || 0,
            className: styles.completed,
          },
          {
            label: "Pending",
            percent: data.pending || 0,
            className: styles.pending,
          },
          {
            label: "Overdue",
            percent: data.overdue || 0,
            className: styles.overdue,
          },
        ];

        setProgressData(updated);

        setTimeout(() => {
          setProgressWidths(updated.map((item) => `${item.percent}%`));
        }, 100);
      } catch (error) {
        console.error("Failed to fetch unit summary", error);
        setError("Failed to fetch assignment summary");
      }
    };

    fetchData();
  }, [unitCode]);

  return (
    <div className={styles.summarySection}>
      <h3>Summary of Assignments</h3>
      {error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <div className={styles.progressBars}>
          {progressData.map((item, index) => (
            <div key={index} className={styles.progressRow}>
              <div className={styles.labelRow}>
                <span>{item.label}</span>
                <span>{item.percent}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={`${styles.progressFill} ${item.className}`}
                  style={{ width: progressWidths[index] }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Summary;
