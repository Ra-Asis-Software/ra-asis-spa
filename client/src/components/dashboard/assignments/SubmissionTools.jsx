import styles from "../css/Assignments.module.css";
import { studentBar } from "../css/SideBarStyles.module.css";
import RoleRestricted from "../../ui/RoleRestricted";

export const SubmissionTools = ({
  currentAssignment,
  handleSubmitAssignment,
  openSubmission,
}) => {
  return (
    <RoleRestricted allowedRoles={["student"]}>
      {currentAssignment && !openSubmission && (
        <div className={styles.studentTools}>
          <div className={styles.studentFiles}>
            <h5>Files</h5>
            {currentAssignment.files.map((file, index) => {
              return (
                <div className={`${styles.chosenFile} `} key={index}>
                  {file.fileName}
                  <i className="fa-solid fa-download"></i>
                </div>
              );
            })}
          </div>
          <p className={styles.normalText}>
            Unit: {currentAssignment.unit.unitName}
          </p>
          <p className={styles.normalText}>
            Deadline: {currentAssignment.deadLine.slice(0, 10)} at{" "}
            {currentAssignment.deadLine.slice(11)}
          </p>
          <p className={styles.normalText}>
            Max Mark: {currentAssignment.maxMarks}
          </p>
          <button
            className={`${styles.studentSubmit} ${studentBar}`}
            onClick={handleSubmitAssignment}
          >
            Submit Assignment
          </button>
        </div>
      )}
    </RoleRestricted>
  );
};
