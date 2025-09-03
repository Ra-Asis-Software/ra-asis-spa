import styles from "../css/Grading.module.css";
const Grade = () => {
  return (
    <div className={styles.gradingContainer}>
      <div className={styles.contentArea}>
        <div className={styles.gradeHeader}>
          <button className={styles.closeSubmissions}>
            <i className="fa-solid fa-left-long"></i>
            <p>Back</p>
          </button>
          <h3>Assignment Title</h3>
        </div>

        <div className={styles.assignmentContent}></div>
      </div>
      <div className={styles.gradeArea}>
        <div className={styles.gradingPanel}>
          <div className={styles.gradingHeader}>
            <h3 className={styles.gradingTitle}>Grade Submission</h3>
          </div>

          <div className={styles.gradingContent}>
            <div className={styles.studentSummary}>
              <div className={styles.summaryItem}>
                <label>Student:</label>
                <span>John Doe</span>
              </div>
              <div className={styles.summaryItem}>
                <label>Submitted:</label>
                {/* <span>{selectedStudent.submittedAt}</span> */}
              </div>
              <div className={styles.summaryItem}>
                <label>Status:</label>
                <span
                // className={`${styles.submissionStatus} ${
                // selectedStudent.isLate ? styles.late : styles.onTime
                // }`}
                >
                  {/* {selectedStudent.isLate ? "Late Submission" : "On Time"} */}
                </span>
              </div>
            </div>

            <div className={styles.gradingForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="penalty">Penalty Marks: 10</label>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="totalMarks">Total Marks: 50</label>
              </div>

              <div className={styles.inputGroup}>
                <label>Final Grade:</label>
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  id="comment"
                  // value={gradingData.comment}
                  // onChange={(e) => handleInputChange("comment", e.target.value)}
                  placeholder="Leave feedback for the student..."
                  rows="4"
                />
              </div>

              <button
                className={styles.finishGradingButton}
                // onClick={handleGradingSubmit}
                // disabled={!gradingData.marks}
              >
                <i className="fas fa-check"></i>
                Finish Grading
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grade;
