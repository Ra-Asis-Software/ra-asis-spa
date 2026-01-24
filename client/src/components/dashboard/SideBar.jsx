import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./css/SideBarStyles.module.css";
import RoleRestricted from "../ui/RoleRestricted";

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
          : role === "parent"
          ? styles.parentBar
          : role === "administrator"
          ? styles.adminBar
          : ""
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
            <span className={styles.linkLabel}>Dashboard</span>
          </Link>
        </li>
        <RoleRestricted allowedRoles={["administrator"]}>
          <li>
            <Link
              to="/dashboard/users"
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

        <RoleRestricted allowedRoles={["student", "teacher", "administrator"]}>
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

        <RoleRestricted allowedRoles={["parent"]}>
          <li>
            <Link
              to="/dashboard/students"
              className={`${active === "students" && styles.active}`}
              onClick={() => setActive("students")}
            >
              <i
                className={` ${styles.sideBarIcon} fa-solid fa-user-graduate`}
              ></i>
              <span className={styles.linkLabel}>Students</span>
            </Link>
          </li>
        </RoleRestricted>

        <RoleRestricted allowedRoles={["student", "teacher"]}>
          <li>
            <Link
              to="/dashboard/assessments?type=assignment"
              onClick={() => setActive("assignments")}
              className={`${active === "assignments" && styles.active}`}
            >
              <i className={`${styles.sideBarIcon} fa-solid fa-file-pen`}></i>
              <span className={styles.linkLabel}>Assignments</span>
            </Link>
          </li>
        </RoleRestricted>
        <RoleRestricted allowedRoles={["student", "teacher"]}>
          <li>
            <Link
              to="/dashboard/assessments?type=quiz"
              onClick={() => setActive("quizzes")}
              className={`${active === "quizzes" && styles.active}`}
            >
              <i
                className={`${styles.sideBarIcon} fa-solid fa-stopwatch-20`}
              ></i>
              <span className={styles.linkLabel}>Quizzes</span>
            </Link>
          </li>
        </RoleRestricted>

        {/* New Grading Route */}
        <RoleRestricted allowedRoles={["teacher"]}>
          <li>
            <Link
              to="/dashboard/grading?type=assignment"
              onClick={() => setActive("grading")}
              className={`${active === "grading" && styles.active}`}
            >
              <i
                className={`${styles.sideBarIcon} fa-solid fa-clipboard-check`}
              ></i>
              <span className={styles.linkLabel}>Grading</span>
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
      </ul>

      <div
        className={`${styles.logout} ${
          role === "parent" ? styles.parentLogout : ""
        }`}
      >
        <button
          onClick={logout}
          className={`${styles.logoutButton} ${
            role === "parent" ? styles.parentLogoutButton : ""
          }`}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span className={styles.linkLabel}>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
