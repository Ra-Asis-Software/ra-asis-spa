import React from 'react';
import styles from './css/sidebar.module.css';
import { Link } from 'react-router-dom';
import RoleRestricted from '../ui/RoleRestricted';


const studentName = 'Abebe Chala';
const studentRole = 'Student';
const initial = studentName.charAt(0).toUpperCase();

const Sidebar = ({show}) => {
  return (
    <div className={show ? `${styles.sidebar} ${styles.sidebarActive}` : `${styles.sidebar}`}>
        <Link to='/'>
         <img src="/assets/spa_site_icon.webp" alt="Dashboard" className={styles['spa-logo']} />
        </Link>
         <ul>
           <li>
             <Link to='/dashboard' className={`${styles.active}`}>
                <i className={`${styles.sideBarIcon} ${styles.dashboardicon} fas fa-th-large`}></i>
                Activity Dashboard
             </Link>
           </li>
           <li>
             <a href='/'><i class={`${styles.sideBarIcon} ${styles.profileicon} fas fa-user-cog`}></i>
            Profile</a>
           </li>
            <RoleRestricted allowedRoles={['administrator']}>
              <li>
                <a href='/'><i className={`${styles.sideBarIcon} ${styles.usericon} fas fa-user`}></i>
                  Users</a>
              </li>
            </RoleRestricted>

            <RoleRestricted allowedRoles={['student', 'teacher']}>
              <li>
                <a href='/'>
                  <i className={` ${styles.sideBarIcon} fa-solid fa-book`}></i>
                  Subjects
                </a>
              </li>
            </RoleRestricted>

            <RoleRestricted allowedRoles={['student', 'teacher']}>
              <li>
                <a href='/'>
                  <i className={`${styles.sideBarIcon} fa-solid fa-file-pen`}></i>
                  Assignments
                </a>
              </li>
            </RoleRestricted>
          </ul>

          <div className={styles.logout}>
            <Link to='/logout'>
              <i className="fas fa-sign-out-alt"></i>
              Log Out
            </Link>    
          </div>
         
    </div>
  )
}

export default Sidebar;
