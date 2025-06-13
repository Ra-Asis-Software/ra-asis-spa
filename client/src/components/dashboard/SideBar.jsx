import React from 'react';
import styles from './css/sidebar.module.css';
import { Link } from 'react-router-dom';
import RoleRestricted from '../ui/RoleRestricted';


const studentName = 'Abebe Chala';
const studentRole = 'Student';
const initial = studentName.charAt(0).toUpperCase();

const Sidebar = ({show}) => {
  return (
    <div className={show ? ` ${styles.sidebar} ${styles.sidebarActive}` : `${styles.sidebar} ${styles.sidebarHidden}`}>
        <Link to='/'>
         <img src="/assets/spa_site_icon.webp" alt="Dashboard" className={styles['spa-logo']} />
        </Link>
         <ul>
           <li>
             <Link to='/dashboard' className={`${styles.active}`}>
                <i className={`${styles.sideBarIcon} ${styles.dashboardicon} fas fa-th-large`}></i>
                <span className={styles.linkLabel}>Activity Dashboard</span>
             </Link>
           </li>
           <li>
             <a href='/'><i className={`${styles.sideBarIcon} ${styles.profileicon} fas fa-user-cog`}></i>
             <span className={styles.linkLabel}>Profile</span>
            </a>
           </li>
            <RoleRestricted allowedRoles={['administrator']}>
              <li>
                <a href='/'><i className={`${styles.sideBarIcon} ${styles.usericon} fas fa-user`}></i>
                  <span className={styles.linkLabel}>Users</span>
                  </a>
              </li>
            </RoleRestricted>

            <RoleRestricted allowedRoles={['student', 'teacher']}>
              <li>
                <a href='/'>
                  <i className={` ${styles.sideBarIcon} fa-solid fa-book`}></i>
                  <span className={styles.linkLabel}>Unit</span>
                </a>
              </li>
            </RoleRestricted>

            <RoleRestricted allowedRoles={['student', 'teacher']}>
              <li>
                <a href='/'>
                  <i className={`${styles.sideBarIcon} fa-solid fa-file-pen`}></i>
                  <span className={styles.linkLabel}>Assignments</span>
                </a>
              </li>
            </RoleRestricted>
          </ul>

          <div className={styles.logout}>
            <Link to='/logout'>
              <i className="fas fa-sign-out-alt"></i>
              <span className={styles.linkLabel}>Log Out</span>
            </Link>    
          </div>
         
    </div>
  )
}

export default Sidebar;
