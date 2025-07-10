import RoleRestricted from "../ui/RoleRestricted";
import styles from "./css/WelcomeBoard.module.css";

// This helper function can live outside the component as it doesn't depend on props or state.
const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Good Morning";
  if (currentHour < 16) return "Good Afternoon";
  return "Good Evening";
};

const WelcomeBoard = ({ firstName }) => {
  const greeting = getGreeting();

  return (
    <div className={styles.welcomeBoard}>
      <div className={styles.contentWrapper}>
        <h2>
          {greeting}, {firstName}
        </h2>
        <h1>Welcome to your SPA Dashboard</h1>

        {/* We use a single container for the role-specific instructions */}
        <div className={styles.instructions}>
          <RoleRestricted allowedRoles={["student"]}>
            <h3>Just one more step, select the units you want to focus on now...</h3>
            <button className={`${styles.btn} ${styles.studentBtn}`}>
              Go To Units
            </button>
          </RoleRestricted>

          <RoleRestricted allowedRoles={["teacher"]}>
            <h3>Just one more step, select one of your assigned units to focus on now...</h3>
            <button className={`${styles.btn} ${styles.teacherBtn}`}>
              Select Unit
            </button>
          </RoleRestricted>

          <RoleRestricted allowedRoles={["parent"]}>
            <h3>Just one more step, search and select your students.</h3>
            <button className={`${styles.btn} ${styles.parentBtn}`}>
              Select Student
            </button>
          </RoleRestricted>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBoard;