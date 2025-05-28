import React, { useEffect, useState } from 'react';
import styles from './StudentDashboard.module.css';

const assignments = [
  { subject: 'Mathematics Assignment 1', teacher: 'Mrs. hijijijlkn' },
  { subject: 'Chemistry Assignment 1', teacher: 'Mrs. jijijlkn' },
  { subject: 'Biology Assignment 1', teacher: 'Mrs. kjijlkn' },
];

const progressData = [
  { label: 'Completed', percent: 80, class: styles.completed },
  { label: 'Pending', percent: 50, class: styles.pending },
  { label: 'Overdue', percent: 20, class: styles.overdue },
];

const StudentMainContent = () => {
  const [progressWidths, setProgressWidths] = useState(
    progressData.map(() => '0%')
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressWidths(progressData.map(p => `${p.percent}%`));
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles['main-content']}>
      <h2>Activity Dashboard</h2>

      <div className={styles['assignment-section']}>
        <h2>Assignments</h2>
        <div className={styles.assignmentsContainer}>
          {assignments.map((assignment, index) => (
            <div key={index} className={styles['first-assignment']}>
              {assignment.subject}
              <span>{assignment.teacher}</span>
              <div className={styles.button}>
                <button className={styles.viewbutton}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className={styles.sectionRow}>
        <div className={styles['summary-section']}>
          <h2>Summary of Assignments</h2>
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

        <div className={styles['deadlines-section']}>
          <h2>Deadlines</h2>
          <div className={styles.deadlineContainer}>
            {assignments.map((assignment, index) => (
              <div key={index} className={styles['deadlines']}>
                {assignment.subject}
                <span>{assignment.teacher}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMainContent;
