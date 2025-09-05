import { useUrlParams } from "../../../utils/assessments";
import styles from "../css/Assessments.module.css";
import { studentBar } from "../css/SideBarStyles.module.css";

export const SubmissionTools = ({
  currentAssessment,
  handleSubmitAssessment,
  openSubmission,
  message,
}) => {
  const { type } = useUrlParams();
  return (
    <>
      {((currentAssessment && !openSubmission) ||
        (type === "quiz" &&
          currentAssessment &&
          openSubmission.submissionStatus === "started")) && (
        <div className={styles.studentTools}>
          <div className={styles.studentFiles}>
            <h5 className={styles.divFlex}>
              Files : {currentAssessment.files.length === 0 && <p>none</p>}
            </h5>
            {currentAssessment.files.map((file, index) => {
              return (
                <div className={`${styles.chosenFile} `} key={index}>
                  {file.fileName}
                  <i className="fa-solid fa-download"></i>
                </div>
              );
            })}
          </div>
          <p className={styles.normalText}>
            Unit: {currentAssessment.unit.unitName}
          </p>
          <p className={styles.normalText}>
            Deadline: {currentAssessment.deadLine.slice(0, 10)} at{" "}
            {currentAssessment.deadLine.slice(11)}
          </p>
          <p className={styles.normalText}>
            Max Mark: {currentAssessment.maxMarks}
          </p>
          {message !== "" && (
            <p className={styles.submissionAlert}>{message}</p>
          )}
          <button
            className={`${styles.studentSubmit} ${studentBar}`}
            onClick={handleSubmitAssessment}
          >
            Submit {type ?? "Assessment"}
          </button>
        </div>
      )}
    </>
  );
};
