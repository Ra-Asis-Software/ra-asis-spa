import { Link } from "react-router-dom";
import styles from "./Unauthorized.module.css";

const Unauthorized = () => {
  return (
    <div className={styles.container}>
      <h1>403 - Unauthorized Access!</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/dashboard" className={styles.link}>
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
