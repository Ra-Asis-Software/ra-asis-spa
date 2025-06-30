import RoleRestricted from "../ui/RoleRestricted";
import styles from "./css/Dashboard.module.css";
import { useEffect, useState } from "react";

const WelcomeBoard = ({ firstName }) => {
  const [greeting, setGreeting] = useState("Hello");
  const time = new Date().getHours();
  useEffect(() => {
    if (time >= 0 && time < 12) setGreeting("Good Morning");
    if (time >= 12 && time < 16) setGreeting("Good Afternoon");
    if (time >= 16 && time < 20) setGreeting("Good Evening");
    if (time >= 20 && time <= 23) setGreeting("Good Night");
  }, []);

  return (
    <div className={styles.welcomeBoard}>
      <h2>
        {greeting}, {firstName}
      </h2>
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
