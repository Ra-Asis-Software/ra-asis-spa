import { useEffect, useState } from "react";
import styles from "./Summary.module.css";
import { getAssessmentSummary } from "../../../services/unitService.js";

const Summary = ({ selectedUnit }) => {
  const [summaryData, setSummaryData] = useState({
    graded: 0,
    submitted: 0,
    pending: 0,
    overdue: 0,
    totalAssessments: 0,
  });
  const [progressWidths, setProgressWidths] = useState([
    "0%",
    "0%",
    "0%",
    "0%",
  ]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedUnit?.id || selectedUnit.id === "all") {
        setError("Please select a specific unit to view summary");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getAssessmentSummary(selectedUnit.id);

        if (data.error) {
          setError(data.error);
          return;
        }

        setSummaryData({
          graded: data.graded || 0,
          submitted: data.submitted || 0,
          pending: data.pending || 0,
          overdue: data.overdue || 0,
          totalAssessments: data.totalAssessments || 0,
        });

        // Animate progress bars
        setTimeout(() => {
          setProgressWidths([
            `${data.graded || 0}%`,
            `${data.submitted || 0}%`,
            `${data.pending || 0}%`,
            `${data.overdue || 0}%`,
          ]);
        }, 100);
      } catch (error) {
        console.error("Failed to fetch assessment summary", error);
        setError("Failed to fetch assessment summary");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUnit]);

  // Prepare progress bar data
  const progressItems = [
    {
      label: "Graded",
      percent: summaryData.graded,
      percentClassName: styles.gradedPercentage,
      className: styles.graded,
    },
    {
      label: "Submitted",
      percent: summaryData.submitted,
      percentClassName: styles.submittedPercentage,
      className: styles.submitted,
    },
    {
      label: "Pending",
      percent: summaryData.pending,
      percentClassName: styles.pendingPercentage,
      className: styles.pending,
    },
    {
      label: "Overdue",
      percent: summaryData.overdue,
      percentClassName: styles.overduePercentage,
      className: styles.overdue,
    },
  ];

  return (
    <div className={styles.summarySection}>
      <h3>Summary of Assessments</h3>

      {loading ? (
        <div className={styles.loadingMessage}>Loading summary...</div> // To replace with loading spinner
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : summaryData.totalAssessments === 0 ? (
        <div className={styles.emptyMessage}>
          <p>No assessments found for this unit.</p>
        </div>
      ) : (
        <>
          <div className={styles.summaryHeader}>
            <h5 className={styles.summaryHeading}>
              Total Assessments: {summaryData.totalAssessments}
            </h5>
          </div>

          <div className={styles.progressBars}>
            {progressItems.map((item, index) => (
              <div key={index} className={styles.progressRow}>
                <div className={styles.labelRow}>
                  <span className={styles.label}>{item.label}</span>
                  <span
                    className={`${styles.percentage} ${item.percentClassName}`}
                  >
                    {item.percent}%
                  </span>
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
        </>
      )}
    </div>
  );
};

export default Summary;
