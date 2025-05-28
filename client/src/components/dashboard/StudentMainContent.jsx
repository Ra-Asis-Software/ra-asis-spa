import React from 'react';
import styles from './StudentDashboard.module.css';

const assignments = [
  {
    subject: 'Mathematics Assignment 1',
    teacher: 'Mrs. hijijijlkn',
  },
  {
    subject: 'Chemistry Assignment 1',
    teacher: 'Mrs. jijijlkn',
  },
  {
    subject: 'Biology Assignment 1',
    teacher: 'Mrs. kjijlkn',
  },
];


const StudentMainContent = () => {

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
                <div className={styles.progressRow}>
                  <span>Completed</span>
                  <div className={styles.progressLine}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFillCompleted} style={{ width: '80%' }}></div>
                    </div>
                    <span>80%</span>
                  </div>
                </div>

                <div className={styles.progressRow}>
                  <span>Pending</span>
                  <div className={styles.progressLine}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFillPending} style={{ width: '50%' }}></div>
                    </div>
                    <span>50%</span>
                  </div>
                </div>

                <div className={styles.progressRow}>
                  <span>Overdue</span>
                  <div className={styles.progressLine}>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFillOverdue} style={{ width: '20%' }}></div>
                    </div>
                    <span>20%</span>
                  </div>
                </div>
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
  )
}

export default StudentMainContent;
