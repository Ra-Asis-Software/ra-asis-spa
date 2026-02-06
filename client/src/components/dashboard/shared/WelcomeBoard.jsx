import { useNavigate } from "react-router-dom";
import styles from "./WelcomeBoard.module.css";
import RoleRestricted from "../../ui/RoleRestricted.jsx";

const WelcomeBoard = ({ firstName }) => {
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 16) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const navigate = useNavigate();

  // We can add more logic later
  const handleButtonClick = () => {
    navigate("/dashboard/units");
  };

  const handleParentButtonClick = () => {
    navigate("/dashboard/students");
  };

  return (
    <div className={styles.welcomeBoard}>
      <h2>
        {greeting}, {firstName}
      </h2>
      <h1>Welcome to your SPA Dashboard</h1>
      <div className={styles.instructions}>
        <RoleRestricted allowedRoles={["student"]}>
          <h3>
            Just one more step, select the units you want to focus on now...
          </h3>
          <button
            className={`${styles.btn} ${styles.studentBtn}`}
            onClick={handleButtonClick}
          >
            Go To Units
          </button>
        </RoleRestricted>

        <RoleRestricted allowedRoles={["teacher"]}>
          <h3>
            Just one more step, select one of your assigned units to focus on
            now...
          </h3>
          <button
            className={`${styles.btn} ${styles.teacherBtn}`}
            onClick={handleButtonClick}
          >
            Select Unit
          </button>
        </RoleRestricted>

        <RoleRestricted allowedRoles={["parent"]}>
          <h3>Just one more step, search and select your students.</h3>
          <button
            className={`${styles.btn} ${styles.parentBtn}`}
            onClick={handleParentButtonClick}
          >
            Select Student
          </button>
        </RoleRestricted>
      </div>
    </div>
  );
};

export default WelcomeBoard;
