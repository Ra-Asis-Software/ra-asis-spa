import React from 'react';
import styles from './sidebar.module.css';
import { Link } from 'react-router-dom';


const studentName = 'Abebe Chala';
const studentRole = 'Student';
const initial = studentName.charAt(0).toUpperCase();

const StudentSidebar = ({show}) => {
  return (
    <div className={show ? `${styles.sidebar} ${styles.sidebarActive}` : `${styles.sidebar}`}>
        <Link to='/'>
         <img src="/assets/spa_site_icon.webp" alt="Dashboard" className={styles['spa-logo']} />
        </Link>
         <ul>
           <li>
             <Link to='/dashboard' className={`${styles.active}`}>
                <i className={`${styles.dashboardicon} fas fa-th-large`}></i>
                Activity Dashboard
             </Link>
           </li>
           <li>
             <a href='/'><i class={`${styles.profileicon} fas fa-user-cog`}></i>
            Profile</a>
           </li>
           <li>
             <a href='/'><i className={`${styles.usericon} fas fa-user`}></i>
              User</a>
           </li>
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

export default StudentSidebar;
