import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./css/Progress.module.css";
import { getProgressData } from "../../services/progressService";

const Progress = () => {
  const [view, setView] = useState("weekly");
  const [progressData, setProgressData] = useState({
    weekly: [],
    lastWeek: [],
    monthly: [],
    lastMonth: [],
  });
  const lineColor = "#01a0e2";

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getProgressData();
        setProgressData(response.data);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      }
    };

    fetchProgress();
  }, []);

  const current =
    view === "weekly" ? progressData.weekly : progressData.monthly;
  const previous =
    view === "weekly" ? progressData.lastWeek : progressData.lastMonth;

  const average = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.reduce((sum, item) => sum + item.progress, 0) / arr.length;
  };

  const currentAvg = useMemo(() => average(current), [current]);
  const previousAvg = useMemo(() => average(previous), [previous]);
  const difference = currentAvg - previousAvg;

  const performanceChange = difference > 0 ? "improved" : "declined";
  const changeColor = difference > 0 ? styles.improved : styles.declined;
  const period = view === "weekly" ? "last week" : "last month";

  return (
    <div className={styles.progressSection}>
      <h2>Progress</h2>
      <div className={styles.progressHeader}>
        <span className={`${styles.performanceChange} ${changeColor}`}>
          {Math.abs(difference).toFixed(1)}% {performanceChange} vs {period}
        </span>
        <button className={styles.viewReport}>View Report</button>
      </div>

      <div className={styles.progressChart}>
        {current.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={current}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="progress"
                stroke={lineColor}
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.noData}>
            <p>No progress data available for this period.</p>
            <p>This may be due to:</p>
            <ul>
              <li>No assignments were due.</li>
              <li>No submissions were made by you.</li>
            </ul>
          </div>
        )}
      </div>

      <p className={styles.progressInfo}>
        Progress from {view === "weekly" ? "last 7 days" : "last 4 months"}
      </p>

      <div className={styles.toggleGroup}>
        <label className={styles.toggleOption}>
          <input
            type="radio"
            name="progressView"
            value="weekly"
            checked={view === "weekly"}
            onChange={() => setView("weekly")}
          />
          <span className={styles.customCircle}></span>
          Weekly Progress
        </label>
        <label className={styles.toggleOption}>
          <input
            type="radio"
            name="progressView"
            value="monthly"
            checked={view === "monthly"}
            onChange={() => setView("monthly")}
          />
          <span className={styles.customCircle}></span>
          Monthly Progress
        </label>
      </div>
    </div>
  );
};

export default Progress;
