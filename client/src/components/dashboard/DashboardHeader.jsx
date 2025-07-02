import React, { useState, useEffect, useRef } from "react";
import styles from "./css/DashboardHeader.module.css";
import {
  studentBar,
  teacherBar,
  parentBar,
} from "./css/SideBarStyles.module.css";

const DashboardHeader = ({
  setShowNav,
  showNav,
  units,
  selectedUnit,
  setSelectedUnit,
  profile,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const notifications = [
    {
      icon: (
        <i
          className={`fas fa-exclamation-circle ${styles.notificationIconLeft}`}
        ></i>
      ),
      message: "New assignment uploaded",
    },
    {
      icon: (
        <i className={`fas fa-check-circle ${styles.notificationIconLeft}`}></i>
      ),
      message: "Your profile was updated",
    },
    {
      icon: (
        <i className={`fas fa-times-circle ${styles.notificationIconLeft}`}></i>
      ),
      message: "Assignment 1 was missed",
    },
    {
      icon: (
        <i className={`fas fa-check-circle ${styles.notificationIconLeft}`}></i>
      ),
      message: "Assignment 3 result received",
    },
    {
      icon: (
        <i
          className={`fas fa-exclamation-circle ${styles.notificationIconLeft}`}
        ></i>
      ),
      message: "Upcoming Assignment 2 submission",
    },
  ];

  const initial = profile.firstName.charAt(0).toUpperCase();

  const hasNew = notifications.length > 0;

  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.navigation}>
      <header className={styles.headerWrapper}>
        <div className={styles.leftSection}>
          <div className={styles.headerTitle}>Activity Dashboard</div>

          {showNav ? (
            <i
              className={`fas fa-xmark ${styles.burgerIcon}`}
              onClick={() => setShowNav(!showNav)}
            ></i>
          ) : (
            <i
              className={`fas fa-bars ${styles.burgerIcon}`}
              onClick={() => setShowNav(!showNav)}
            ></i>
          )}
        </div>

        <div className={styles.rightSection}>
          {units.length > 0 && (
            <div className={styles.unitDropdown}>
              <button
                className={`${styles.unitButton} ${
                  profile.role === "student"
                    ? studentBar
                    : profile.role === "teacher"
                    ? teacherBar
                    : profile.role === "parent" && parentBar
                }`}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {selectedUnit.name || "Select Subject"} ▾
              </button>
              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  {units.map((subject) => (
                    <div
                      key={subject.id}
                      onClick={() => {
                        setSelectedUnit(subject);
                        setShowDropdown(false);
                      }}
                    >
                      {subject.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div
            className={`${styles.avatar}`}
          >
            {initial}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>
              {profile.firstName} {profile.lastName}
            </span>
            <span className={styles.profileRole}>{profile.role}</span>
          </div>
          <div className={styles.notificationWrapper} ref={notificationRef}>
            <i
              className={`fas fa-bell ${styles.notificationIcon}`}
              onClick={() => setShowNotifications((prev) => !prev)}
            ></i>
            {hasNew && <span className={styles.notifierDot}></span>}

            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <span>You have 2 new notifications</span>
                </div>

                {(showAllNotifications
                  ? notifications
                  : notifications.slice(0, 2)
                ).map((note, idx) => (
                  <div key={idx} className={styles.notificationItem}>
                    {note.icon}
                    {note.message}
                  </div>
                ))}

                {!showAllNotifications && (
                  <div
                    className={styles.seeAll}
                    onClick={() => setShowAllNotifications(true)}
                  >
                    See all notifications
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default DashboardHeader;
