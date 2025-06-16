import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import axios from "axios";
import styles from "./css/Progress.module.css";

const Progress = () => {
  const [view, setView] = useState("weekly");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load progress data", err);
      }
    };
    fetchData();
  }, []);

  const current = view === "weekly" ? data?.weekly || [] : data?.monthly || [];
  const previous =
    view === "weekly" ? data?.lastWeek || [] : data?.lastMonth || [];

  const average = (arr) =>
    arr.reduce((sum, item) => sum + item.progress, 0) / arr.length;

  const currentAvg = useMemo(() => average(current), [current]);
  const previousAvg = useMemo(() => average(previous), [previous]);
  const difference = currentAvg - previousAvg;

  const performanceChange = difference > 0 ? "improved" : "declined";
  const changeColor = difference > 0 ? styles.improved : styles.declined;
  const ArrowIcon = difference > 0 ? ArrowUpRight : ArrowDownRight;
  const period = view === "weekly" ? "last week" : "last month";

  return (
    <div className={styles.progressSection}>
      <h2>Progress</h2>
      <div className={styles.progressHeader}>
        <span className={`${styles.performanceChange} ${changeColor}`}>
          <ArrowIcon size={18} />
          {Math.abs(difference).toFixed(1)}% {performanceChange} vs {period}
        </span>
        <button className={styles.viewReport}>View Report</button>
      </div>

      <div className={styles.progressChart}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={current}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#4A90E2"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className={styles.progressInfo}>
        {view === "weekly"
          ? "Progress from this week"
          : "Monthly progress summary"}
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
