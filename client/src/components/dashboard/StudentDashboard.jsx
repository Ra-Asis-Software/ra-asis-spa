import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import Header from './Header';
import StudentMain from './StudentMain';
import styles from './css/Dashboard.module.css';

const StudentDashboard = () => {
  const [showNav, setShowNav] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');

  return (
    <div className={styles.dashboardContainer}>
      <Header
        setShowNav={setShowNav}
        showNav={showNav}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />
      <div className={styles.contentWrapper}>
        <StudentSidebar show={showNav} />
        <StudentMain showNav={showNav} subject={selectedSubject}/>
      </div>
    </div>
  );
};

export default StudentDashboard;