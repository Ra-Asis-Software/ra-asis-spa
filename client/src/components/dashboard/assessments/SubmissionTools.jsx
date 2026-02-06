import styles from "./Assessments.module.css";
import { studentBar } from "../shared/SideBar.module.css";
import { handleDueDate, useUrlParams } from "../../../utils/assessmentUtils.js";
import { handleFileDownload } from "../../../utils/downloadUtils.js";

const SubmissionTools = ({
  currentAssessment,
  handleSubmitAssessment,
  openSubmission,
  loading,
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
                <div
                  className={`${styles.chosenFile}`}
                  key={index}
                  onClick={() => handleFileDownload(file)}
                  title={`Download ${file.fileName}`}
                >
                  <span>{file.fileName}</span>
                  <i className="fa-solid fa-download" />
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
          <button
            className={`${styles.studentSubmit} ${studentBar}`}
            onClick={handleSubmitAssessment}
          >
            {loading ? "Submitting..." : `Submit ${type ?? "Assessment"}`}
          </button>
        </div>
      )}
    </>
  );
};

export default SubmissionTools;
