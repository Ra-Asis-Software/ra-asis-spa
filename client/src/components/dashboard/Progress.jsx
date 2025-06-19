import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import styles from './css/Progress.module.css';

const weeklyData = [
  { name: 'Mon', progress: 40 },
  { name: 'Tue', progress: 60 },
  { name: 'Wed', progress: 55 },
  { name: 'Thu', progress: 70 },
  { name: 'Fri', progress: 65 },
  { name: 'Sat', progress: 80 },
  { name: 'Sun', progress: 75 },
];

const lastWeekData = [
  { name: 'Mon', progress: 30 },
  { name: 'Tue', progress: 50 },
  { name: 'Wed', progress: 45 },
  { name: 'Thu', progress: 60 },
  { name: 'Fri', progress: 55 },
  { name: 'Sat', progress: 70 },
  { name: 'Sun', progress: 65 },
];

const monthlyData = [
  { name: 'Jan', progress: 50 },
  { name: 'Feb', progress: 60 },
  { name: 'Mar', progress: 70 },
  { name: 'Apr', progress: 80 },
];

const lastMonthData = [
  { name: 'Sep', progress: 40 },
  { name: 'Oct', progress: 50 },
  { name: 'Nov', progress: 55 },
  { name: 'Dec', progress: 60 },
];

const Progress = () => {
  const [view, setView] = useState('weekly');

  const current = view === 'weekly' ? weeklyData : monthlyData;
  const previous = view === 'weekly' ? lastWeekData : lastMonthData;

  const average = (arr) => arr.reduce((sum, item) => sum + item.progress, 0) / arr.length;

  const currentAvg = useMemo(() => average(current), [current]);
  const previousAvg = useMemo(() => average(previous), [previous]);
  const difference = currentAvg - previousAvg;

  const performanceChange = difference > 0 ? 'improved' : 'declined';
  const changeColor = difference > 0 ? styles.improved : styles.declined;
  const period = view === 'weekly' ? 'last week' : 'last month';

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

      <p className={styles.progressInfo}>Progress from 12–18 May, 2025</p>

      <div className={styles.toggleGroup}>
        <label className={styles.toggleOption}>
          <input
            type="radio"
            name="progressView"
            value="weekly"
            checked={view === 'weekly'}
            onChange={() => setView('weekly')}
          />
          <span className={styles.customCircle}></span>
          Weekly Progress
        </label>
        <label className={styles.toggleOption}>
          <input
            type="radio"
            name="progressView"
            value="monthly"
            checked={view === 'monthly'}
            onChange={() => setView('monthly')}
          />
          <span className={styles.customCircle}></span>
          Monthly Progress
        </label>
      </div>
    </div>
  );
};

export default Progress;
