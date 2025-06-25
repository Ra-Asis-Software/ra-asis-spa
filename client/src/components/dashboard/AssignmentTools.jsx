import styles from "./css/Assignments.module.css";
import RoleRestricted from "../ui/RoleRestricted";

const AssignmentTools = ({
  params,
  openAssignment,
  canEdit,
  setShowButton,
  handleChooseFiles,
  setAssignmentExtras,
  handlePublishAssignment,
  message,
}) => {
  return (
    <>
      <RoleRestricted allowedRoles={["teacher"]}>
        {(params.get("new") || openAssignment) && canEdit && (
          <div className={styles.tools}>
            <div className={styles.toolsArea}>
              <h3>Tools</h3>

              <button
                className={styles.addAssignment}
                onClick={() =>
                  setShowButton((prev) => ({ ...prev, instruction: true }))
                }
              >
                Instruction
              </button>

              <button
                className={styles.addAssignment}
                onClick={() =>
                  setShowButton((prev) => ({ ...prev, question: true }))
                }
              >
                Question
              </button>

              <button
                className={styles.addAssignment}
                onClick={() =>
                  setShowButton((prev) => ({ ...prev, textArea: true }))
                }
              >
                Text Area
              </button>

              <button
                className={styles.addAssignment}
                onClick={() => {
                  setShowButton((prev) => ({ ...prev, title: true }));
                }}
              >
                Title
              </button>

              <button
                className={styles.addAssignment}
                onClick={handleChooseFiles}
              >
                File
              </button>
              {message !== "" && (
                <p className={styles.submissionAlert}>{message}</p>
              )}
            </div>
            <div className={styles.extraTools}>
              <div className={styles.deadline}>
                <p>Deadline</p>
                <input
                  type="date"
                  onChange={(e) =>
                    setAssignmentExtras((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
                <input
                  type="time"
                  onChange={(e) =>
                    setAssignmentExtras((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={styles.deadline}>
                <p>Max marks</p>
                <input
                  type="number"
                  max={100}
                  onChange={(e) =>
                    setAssignmentExtras((prev) => ({
                      ...prev,
                      marks: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <button
              className={styles.submitAssignment}
              onClick={handlePublishAssignment}
            >
              PUBLISH ASSIGNMENT
            </button>
          </div>
        )}
      </RoleRestricted>
    </>
  );
};

export default AssignmentTools;
