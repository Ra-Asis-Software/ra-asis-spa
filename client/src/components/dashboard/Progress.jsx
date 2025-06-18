import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './css/Progress.module.css';
import axios from 'axios';

const Progress = () => {
  const [view, setView] = useState('weekly');
  const [progressData, setProgressData] = useState({
    weekly: [],
    lastWeek: [],
    monthly: [],
    lastMonth: [],
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('authToken'); 
        // console.log('Token:', token);
        const response = await axios.get('http://localhost:5000/api/progress', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProgressData(response.data);
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      }
    };

    fetchProgress();
  }, []);

  const current = view === 'weekly' ? progressData.weekly : progressData.monthly;
  const previous = view === 'weekly' ? progressData.lastWeek : progressData.lastMonth;

  const average = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.reduce((sum, item) => sum + item.progress, 0) / arr.length;
  };

  const currentAvg = useMemo(() => average(current), [current]);
  const previousAvg = useMemo(() => average(previous), [previous]);
  const difference = currentAvg - previousAvg;

  const performanceChange = difference > 0 ? 'improved' : 'declined';
  const changeColor = difference > 0 ? styles.improved : styles.declined;
  const ArrowIcon = difference > 0 ? ArrowUpRight : ArrowDownRight;
  const period = view === 'weekly' ? 'last week' : 'last month';

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
        {current.length > 0 ? (
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
        ) : (
          <p>No data available</p>
        )}
      </div>

      <p className={styles.progressInfo}>
        Progress from {view === 'weekly' ? 'last 7 days' : 'last 4 months'}
      </p>

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
