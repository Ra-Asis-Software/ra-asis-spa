import styles from "./css/SideBarStyles.module.css";
import { Link } from "react-router-dom";
import RoleRestricted from "../ui/RoleRestricted";
import { useState } from "react";

const SideBar = ({ show, logout, role }) => {
  const [active, setActive] = useState("dashboard");
  return (
    <div
      className={`${styles.sidebar} ${
        show ? styles.sidebarActive : styles.sidebarHidden
      } ${
        role === "student"
          ? styles.studentBar
          : role === "teacher"
          ? styles.teacherBar
          : role === "parent" && styles.parentBar
      }`}
    >
      <Link to="/">
        <img
          src="/assets/spa_site_icon.webp"
          alt="Site icon"
          title="Go to site home"
          className={styles.siteIcon}
        />
      </Link>
      <ul>
        <li>
          <Link
            to="/dashboard"
            className={`${active === "dashboard" && styles.active}`}
            onClick={() => setActive("dashboard")}
          >
            <i
              className={`${styles.sideBarIcon} ${styles.dashboardicon} fas fa-th-large`}
            ></i>
            <span className={styles.linkLabel}>
              <p>Activity</p> Dashboard
            </span>
          </Link>
        </li>
        <RoleRestricted allowedRoles={["administrator"]}>
          <li>
            <Link
              to="/"
              className={`${active === "users" && styles.active}`}
              onClick={() => setActive("users")}
            >
              <i
                className={`${styles.sideBarIcon} ${styles.usericon} fas fa-user`}
              ></i>
              <span className={styles.linkLabel}>Users</span>
            </Link>
          </li>
        </RoleRestricted>

        <RoleRestricted allowedRoles={["student", "teacher"]}>
          <li>
            <Link
              to="/dashboard/units"
              className={`${active === "units" && styles.active}`}
              onClick={() => setActive("units")}
            >
              <i className={` ${styles.sideBarIcon} fa-solid fa-book`}></i>
              <span className={styles.linkLabel}>Units</span>
            </Link>
          </li>
        </RoleRestricted>

        <RoleRestricted allowedRoles={["student", "teacher"]}>
          <li>
            <Link
              to="/dashboard/assignments"
              onClick={() => setActive("assignments")}
              className={`${active === "assignments" && styles.active}`}
            >
              <i className={`${styles.sideBarIcon} fa-solid fa-file-pen`}></i>
              <span className={styles.linkLabel}>Assignments</span>
            </Link>
          </li>
        </RoleRestricted>
        <li>
          <Link
            to="/dashboard/profile"
            className={`${active === "profile" && styles.active}`}
            onClick={() => setActive("profile")}
          >
            <i
              className={`${styles.sideBarIcon} ${styles.profileicon} fas fa-user-cog`}
            ></i>
            <span className={styles.linkLabel}>Profile</span>
          </Link>
        </li>
        <RoleRestricted allowedRoles={["administrator"]}>
          <li>
            <Link
              to="/"
              className={`${active === "users" && styles.active}`}
              onClick={() => setActive("users")}
            >
              <i
                className={`${styles.sideBarIcon} ${styles.usericon} fas fa-user`}
              ></i>
              <span className={styles.linkLabel}>Users</span>
            </Link>
          </li>
        </RoleRestricted>
      </ul>

      <div className={styles.logout}>
        <button onClick={logout} className={styles.logoutButton}>
          <i className="fas fa-sign-out-alt"></i>
          <span className={styles.linkLabel}>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
