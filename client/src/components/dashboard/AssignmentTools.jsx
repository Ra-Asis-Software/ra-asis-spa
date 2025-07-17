import styles from "./css/Assignments.module.css";

const AssignmentTools = ({
  params,
  openAssignment,
  canEdit,
  setShowButton,
  handleChooseFiles,
  setAssignmentExtras,
  handlePublishAssignment,
  handleEditAssignment,
  message,
  assignmentExtras,
}) => {
  return (
    <>
      {/* show this only when creating a new assignment or opening an existing one, and when editing is set to true */}
      {canEdit && (
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
                value={assignmentExtras.date}
                onChange={(e) =>
                  setAssignmentExtras((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
              <input
                type="time"
                value={assignmentExtras.time}
                onChange={(e) =>
                  setAssignmentExtras((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
              />
            </div>
            <div className={styles.deadline}>
              <p>Max Marks</p>
              <input
                type="number"
                max={100}
                value={assignmentExtras.marks}
                onChange={(e) =>
                  setAssignmentExtras((prev) => ({
                    ...prev,
                    marks: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          {params.get("new") ? (
            <button
              className={styles.publishAssignment}
              onClick={handlePublishAssignment}
            >
              PUBLISH ASSIGNMENT
            </button>
          ) : openAssignment ? (
            <button
              className={styles.publishAssignment}
              onClick={handleEditAssignment}
            >
              SAVE CHANGES
            </button>
          ) : (
            <p>No action</p>
          )}
        </div>
      )}
    </>
  );
};

export default AssignmentTools;
