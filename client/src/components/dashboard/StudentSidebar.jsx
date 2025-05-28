import React from 'react';
import styles from './StudentDashboard.module.css';

const StudentSidebar = () => {
  return (
    <div className={styles.sidebar}>
        <img src="/assets/spa_site_icon.webp" alt="Dashboard" className={styles['spa-logo']} />
        <ul className={styles['sidebar-list']}>
          <li className={styles['sidebar-item']}>
            <img src="/assets/dashboard-icon.svg" alt="Dashboard" className="dashboard-icon" />
            <span className={styles.label}>Activity Dashboard</span>
          </li>
          <li>Logout</li>
        </ul>
      </div>
  )
}

export default StudentSidebar;
