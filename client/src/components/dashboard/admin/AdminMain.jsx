import styles from "./AdminMain.module.css";

const AdminMain = ({ lastName }) => {
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 16) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  return (
    <div className={styles.adminMainContainer}>
      <h2 className={styles.greetingHeading}>
        {greeting} Admin {lastName}!
      </h2>
      <p className={styles.greetingParagraph}>
        Welcome to your dashboard. Manage the system here with ease.{" "}
        <strong className={styles.strongTextBlue}>Users</strong>,{" "}
        <strong className={styles.strongTextGreen}>Units</strong>,{" "}
        <strong className={styles.strongTextRed}>System Analytics</strong> all
        in one place.
      </p>
    </div>
  );
};

export default AdminMain;
