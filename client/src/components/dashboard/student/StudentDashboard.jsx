import React, { useState } from "react";
import Sidebar from "../SideBar";
import Header from "../Header";
import StudentMain from "./StudentMain";
import styles from "../css/Dashboard.module.css";

const StudentDashboard = ({ profile }) => {
  const [showNav, setShowNav] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  return (
    <div className={styles.dashboardContainer}>
      <Header
        {...{ profile }}
        setShowNav={setShowNav}
        showNav={showNav}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />
      <div className={styles.contentWrapper}>
        <Sidebar show={showNav} />
        <StudentMain
          showNav={showNav}
          subject={selectedSubject}
          profile={profile}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
