import React, { useState } from "react";
import Header from "../Header";
import styles from "../css/Dashboard.module.css";
import Sidebar from "../SideBar";
import TeacherMain from "./TeacherMain";
import ViewAssignment from "../ViewAssignment";

function TeacherDashboard({ profile }) {
  const [showNav, setShowNav] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [showAssignments, setShowAssignments] = useState(false);
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
        {!showAssignments ? (
          <TeacherMain {...{ showNav, profile, setShowAssignments }} />
        ) : (
          <ViewAssignment />
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
