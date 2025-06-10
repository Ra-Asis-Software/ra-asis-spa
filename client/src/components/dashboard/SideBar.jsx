import React from "react";
import styles from "./css/SideBar.module.css";
import { Link } from "react-router-dom";
import RoleRestricted from "../ui/RoleRestricted";

const Sidebar = ({ show }) => {
  return (
    <div
      className={
        show
          ? ` ${styles.sidebar} ${styles.sidebarActive}`
          : `${styles.sidebar} ${styles.sidebarHidden}`
      }
    >
      <Link to="/">
        <img
          src="/assets/spa_site_icon.webp"
          alt="Dashboard"
          className={styles["spa-logo"]}
        />
      </Link>
      <ul>
        <li>
          <Link to="/dashboard" className={`${styles.active}`}>
            <i
              className={`${styles.sideBarIcon} ${styles.dashboardicon} fas fa-th-large`}
            ></i>
            <span className={styles.linkLabel}>Activity Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/">
            <i
              className={`${styles.sideBarIcon} ${styles.profileicon} fas fa-user-cog`}
            ></i>
            <span className={styles.linkLabel}>Profile</span>
          </Link>
        </li>
        <RoleRestricted allowedRoles={["administrator"]}>
          <li>
            <Link to="/">
              <i
                className={`${styles.sideBarIcon} ${styles.usericon} fas fa-user`}
              ></i>
              <span className={styles.linkLabel}>Users</span>
            </Link>
          </li>
        </RoleRestricted>

        <RoleRestricted allowedRoles={["student", "teacher"]}>
          <li>
            <Link to="/">
              <i className={` ${styles.sideBarIcon} fa-solid fa-book`}></i>
              <span className={styles.linkLabel}>Unit</span>
            </Link>
          </li>
        </RoleRestricted>

        <RoleRestricted allowedRoles={["student", "teacher"]}>
          <li>
            <Link to="/dashboard/assignments">
              <i className={`${styles.sideBarIcon} fa-solid fa-file-pen`}></i>
              <span className={styles.linkLabel}>Assignments</span>
            </Link>
          </li>
        </RoleRestricted>
      </ul>

      <div className={styles.logout}>
        <Link to="/logout">
          <i className="fas fa-sign-out-alt"></i>
          <span className={styles.linkLabel}>Log Out</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
