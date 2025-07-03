import RoleRestricted from "../ui/RoleRestricted";
import styles from "./css/WelcomeBoard.module.css";
import { useEffect, useState } from "react";

const WelcomeBoard = ({ firstName }) => {
  const [greeting, setGreeting] = useState("Hello");
  const time = new Date().getHours();
  useEffect(() => {
    if (time >= 0 && time < 12) setGreeting("Good Morning");
    if (time >= 12 && time < 16) setGreeting("Good Afternoon");
    if (time >= 16 && time < 23) setGreeting("Good Evening");
  }, []);

  return (
    <div className={styles.welcomeBoard}>
      <h2>
        {greeting}, {firstName}
      </h2>
      <h1>Welcome to your SPA Dashboard</h1>
      <h3>
        Just one more step,{" "}
        <RoleRestricted allowedRoles={["student"]}>
          select the units you want to focus on now...
        </RoleRestricted>{" "}
        <RoleRestricted allowedRoles={["teacher"]}>
          select one of your assigned units to focus on now...
        </RoleRestricted>{" "}
        <RoleRestricted allowedRoles={["parent"]}>
          search and select your students
        </RoleRestricted>
      </h3>
      <RoleRestricted allowedRoles={["student"]}>
        <button className={styles.studentBtn}>Go To Units</button>
      </RoleRestricted>
      <RoleRestricted allowedRoles={["teacher"]}>
        <button className={styles.teacherBtn}>Select Unit</button>
      </RoleRestricted>
      <RoleRestricted allowedRoles={["parent"]}>
        <button className={styles.parentBtn}>Select Student</button>
      </RoleRestricted>
    </div>
  );
};

export default WelcomeBoard;
