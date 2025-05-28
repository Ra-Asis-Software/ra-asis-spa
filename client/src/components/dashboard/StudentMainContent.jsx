import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import styles from './StudentDashboard.module.css';

const assignments = [
  {
    subject: 'Mathematics Assignment 1',
    teacher: 'Mrs. hijijijlkn',
    deadline: 'June 10, 2025',
  },
  {
    subject: 'Chemistry Assignment 1',
    teacher: 'Mrs. jijijlkn',
    deadline: 'June 12, 2025',
  },
  {
    subject: 'Biology Assignment 1',
    teacher: 'Mrs. kjijlkn',
    deadline: 'June 15, 2025',
  },
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

  const studentName = 'Abebe Chala';
  const studentRole = 'Student';
  const initial = studentName.charAt(0).toUpperCase();

  return (
    <div className={styles['main-content']}>

      <div className={styles.headerRow}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{studentName}</span>
            <span className={styles.profileRole}>{studentRole}</span>
          </div>
          <Bell className={styles.notificationIcon} />
        </div>
      </div>

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
                <div className={styles.subjectRow}>
                  <span className={styles.subjectText}>{assignment.subject}</span>
                  <span className={styles.deadlineDate}>{assignment.deadline}</span>
                </div>
                <span className={styles.teacherText}>{assignment.teacher}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMainContent;
