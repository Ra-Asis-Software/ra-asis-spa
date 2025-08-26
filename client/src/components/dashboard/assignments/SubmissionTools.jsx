import styles from "../css/Assignments.module.css";
import { studentBar } from "../css/SideBarStyles.module.css";

export const SubmissionTools = ({
  currentAssignment,
  handleSubmitAssignment,
  openSubmission,
  message,
}) => {
  return (
    <>
      {currentAssignment && !openSubmission && (
        <div className={styles.studentTools}>
          <div className={styles.studentFiles}>
            <h5 className={styles.divFlex}>
              Files : {currentAssignment.files.length === 0 && <p>none</p>}
            </h5>
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
          {message !== "" && (
            <p className={styles.submissionAlert}>{message}</p>
          )}
          <button
            className={`${styles.studentSubmit} ${studentBar}`}
            onClick={handleSubmitAssignment}
          >
            Submit Assignment
          </button>
        </div>
      )}
    </>
  );
};
