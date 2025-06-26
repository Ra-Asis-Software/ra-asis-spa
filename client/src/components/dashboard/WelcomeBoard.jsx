import RoleRestricted from "../ui/RoleRestricted";
import styles from "./css/Dashboard.module.css";

const WelcomeBoard = () => {
  return (
    <div className={styles.welcomeBoard}>
      <h1>Welcome to your SPA Dashboard</h1>
      <h3>
        Just one more step, select{" "}
        <RoleRestricted allowedRoles={["teacher", "student"]}>
          units
        </RoleRestricted>{" "}
        <RoleRestricted allowedRoles={["parent"]}>
          your student/s
        </RoleRestricted>
      </h3>
      <RoleRestricted allowedRoles={["student", "teacher"]}>
        <button>Select Units</button>
      </RoleRestricted>
      <RoleRestricted allowedRoles={["parent"]}>
        <button>My Student/s</button>
      </RoleRestricted>
    </div>
  );
};

export default WelcomeBoard;
