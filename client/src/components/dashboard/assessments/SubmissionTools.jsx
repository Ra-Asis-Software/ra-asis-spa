import styles from "../css/Assessments.module.css";
import { studentBar } from "../css/SideBarStyles.module.css";
import { handleDueDate, useUrlParams } from "../../../utils/assessments.js";

const SubmissionTools = ({
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
            Deadline: {handleDueDate(currentAssessment.deadLine)}
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

export default SubmissionTools;
