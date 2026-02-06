import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DashboardHeader.module.css";
import { studentBar, teacherBar, parentBar } from "./SideBar.module.css";

const DashboardHeader = ({
  setShowNav,
  showNav,
  units,
  selectedUnit,
  setSelectedUnit,
  profile,
  linkedStudents = [],
}) => {
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentStudentId = queryParams.get("student");

  // Find current student name
  const currentStudent = linkedStudents.find((s) => s.id === currentStudentId);

  const notificationRef = useRef(null);

  // Sample notifications (replace with dynamic data later)
  const notifications = [
    {
      icon: <i className={`fas fa-file ${styles.notificationIconLeft}`}></i>,
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
        <i
          className={`fas fa-times-circle ${styles.notificationIconLeft} ${styles.criticalNotification}`}
        ></i>
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
          className={`fas fa-exclamation-circle ${styles.notificationIconLeft} ${styles.criticalNotification}`}
        ></i>
      ),
      message: "Upcoming Assignment 2 deadline",
    },
  ];

  const initial = profile.firstName.charAt(0).toUpperCase();
  const hasNew = notifications.length > 0;

  // Handle clicking outside notifications dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }

      // Close all other dropdowns if clicked outside
      if (!e.target.closest(`.${styles.studentDropdown}`)) {
        setShowStudentDropdown(false);
      }
      if (!e.target.closest(`.${styles.unitDropdown}`)) {
        setShowUnitDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.leftSection}>
        <h4 className={styles.menuTitle}>Dashboard Menu</h4>
        <i
          className={`fas ${showNav ? "fa-xmark" : "fa-bars"} ${
            styles.burgerIcon
          }`}
          onClick={() => setShowNav(!showNav)}
        ></i>
      </div>

      <div className={styles.rightSection}>
        {/* Units Dropdown (visible to all roles) */}
        {(units?.length > 0 || profile.role === "parent") && (
          <div className={styles.unitDropdown}>
            <button
              className={`${styles.unitButton} ${
                profile.role === "student"
                  ? studentBar
                  : profile.role === "teacher"
                  ? teacherBar
                  : parentBar
              }`}
              onClick={() => setShowUnitDropdown((prev) => !prev)}
            >
              {selectedUnit?.name || "Select Unit"} ▾
            </button>
            {showUnitDropdown && (
              <div className={styles.dropdownMenu}>
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className={`${styles.dropdownOption} ${
                      profile.role === "teacher"
                        ? styles.teacherDropdownOption
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedUnit(unit);
                      // window.location.reload(); // Simple for now, to refine in the next commit
                      setShowUnitDropdown(false);
                      localStorage.setItem("focusUnit", JSON.stringify(unit));
                    }}
                  >
                    {unit.name}
                  </div>
                ))}
                <div
                  className={`${styles.dropdownOption} ${
                    profile.role === "teacher"
                      ? styles.teacherDropdownOption
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedUnit({ name: "All Units", id: "all" });
                    window.location.reload(); // In final sol. think effects on existing behavior on other dashs

                    setShowUnitDropdown(false);
                    localStorage.setItem(
                      "focusUnit",
                      JSON.stringify({ name: "All Units", id: "all" })
                    );
                  }}
                >
                  All Units
                </div>
              </div>
            )}
          </div>
        )}

        {profile.role === "parent" && linkedStudents.length > 0 && (
          <div className={styles.studentDropdown}>
            <button
              className={`${styles.unitButton} ${parentBar}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowStudentDropdown((prev) => !prev);
                setShowUnitDropdown(false); // Close units dropdown if open
              }}
            >
              {currentStudent
                ? `${currentStudent.firstName} ${currentStudent.lastName}`
                : "Select Student"}{" "}
              ▾
            </button>
            {showStudentDropdown && (
              <div
                className={styles.dropdownMenu}
                onClick={(e) => e.stopPropagation()}
              >
                {linkedStudents.map((student) => (
                  <div
                    key={student.id}
                    className={styles.dropdownOption}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard?student=${student.id}`);
                      setShowStudentDropdown(false);
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Section */}
        <div className={`${styles.avatar}`}>{initial}</div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </span>
          <span className={styles.profileRole}>{profile.role}</span>
        </div>

        {/* Notifications */}
        <div className={styles.notificationWrapper} ref={notificationRef}>
          <i
            className={`fas fa-bell ${styles.notificationIcon}`}
            onClick={() => setShowNotifications((prev) => !prev)}
          ></i>
          {hasNew && <span className={styles.notifierDot}></span>}

          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <span>You have {notifications.length} new notifications</span>
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

              <div
                className={styles.seeAll}
                onClick={() => setShowAllNotifications(!showAllNotifications)}
              >
                <span>
                  {showAllNotifications
                    ? "See less notifications"
                    : "See all notifications"}
                </span>
                <i
                  className={`fas ${
                    showAllNotifications ? "fa-arrow-up" : "fa-arrow-down"
                  }`}
                ></i>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
