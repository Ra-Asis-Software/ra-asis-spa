import React, { useState } from 'react'
import Header from '../Header'
import styles from '../css/Dashboard.module.css'
import Sidebar from '../SideBar';

function TeacherDashboard() {
    const [showNav, setShowNav] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    return (
        <div className={styles.dashboardContainer}>
           <Header
            setShowNav={setShowNav}
            showNav={showNav}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject} />

            <div className={styles.contentWrapper}>
                <Sidebar show={showNav} />
            </div>
        </div>
    )
}

export default TeacherDashboard
