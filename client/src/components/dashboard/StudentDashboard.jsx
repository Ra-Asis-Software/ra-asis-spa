import React from 'react';
import StudentSidebar from './StudentSidebar';
import styles from './StudentDashboard.module.css';
import StudentMainContent from './StudentMainContent';

const StudentDashboard = () => {
  return (
    <div className={styles['student-dashboard']}>
      <StudentSidebar />
      <StudentMainContent />
    </div>
  )
}

export default StudentDashboard;
