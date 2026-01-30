import styles from "../css/Assessments.module.css";
import { useUrlParams } from "../../../utils/assessmentUtils";

const AssessmentTools = ({
  setShowButton,
  assignmentFiles,
  setAssessmentExtras,
  handlePublishAssessment = null,
  handleEditAssessment = null,
  assessmentExtras,
  timeLimit,
  setTimeLimit,
  submissionType,
  loading,
}) => {
  const { isNew, isOpened, type } = useUrlParams();
  return (
    <div className={styles.tools}>
      <div className={styles.toolsArea}>
        <h3>Tools</h3>

        <button
          className={styles.addAssignment}
          onClick={() => setShowButton("instruction")}
        >
          Instruction
        </button>

        {submissionType?.toLowerCase() !== "file" && (
          <>
            <button
              className={styles.addAssignment}
              onClick={() => setShowButton("question")}
            >
              Question
            </button>

            <button
              className={styles.addAssignment}
              onClick={() => setShowButton("textArea")}
            >
              Text Area
            </button>
          </>
        )}

        <button
          className={styles.addAssignment}
          onClick={() => {
            setShowButton("title");
          }}
        >
          Title
        </button>

        <button
          className={styles.addAssignment}
          onClick={assignmentFiles.chooseFiles}
        >
          File
        </button>
      </div>
      <div className={styles.extraTools}>
        <div className={styles.deadline}>
          <p>Deadline</p>
          <input
            type="date"
            value={assessmentExtras.date}
            onChange={(e) =>
              setAssessmentExtras((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
          />
          <input
            type="time"
            value={assessmentExtras.time}
            onChange={(e) =>
              setAssessmentExtras((prev) => ({
                ...prev,
                time: e.target.value,
              }))
            }
          />
        </div>
        {type === "quiz" && (
          <div className={styles.deadline}>
            <p>Time limit</p>
            <input
              type="number"
              value={timeLimit.value}
              onChange={(e) =>
                setTimeLimit({
                  ...timeLimit,
                  value: e.target.value,
                })
              }
            />
            <select
              className={styles.timerSelect}
              onChange={(e) =>
                setTimeLimit({ ...timeLimit, unit: e.target.value })
              }
            >
              <option value={"minutes"}>Minutes</option>
              <option value={"seconds"}>Seconds</option>
              <option value={"hours"}>Hours</option>
            </select>
          </div>
        )}
        <div className={styles.deadline}>
          <p>Max Marks</p>
          <input
            type="number"
            max={100}
            disabled
            value={Number(assessmentExtras.marks)}
          />
        </div>
      </div>
      {isNew ? (
        <button
          className={styles.publishAssignment}
          onClick={handlePublishAssessment}
        >
          {loading
            ? `PUBLISHING...`
            : `PUBLISH ${type.toUpperCase() ?? "ASSESSMENT"}`}
        </button>
      ) : isOpened ? (
        <button
          className={styles.publishAssignment}
          onClick={handleEditAssessment}
        >
          {loading ? "SAVING..." : "SAVE CHANGES"}
        </button>
      ) : (
        <p>No action</p>
      )}
    </div>
  );
};

export default AssessmentTools;
