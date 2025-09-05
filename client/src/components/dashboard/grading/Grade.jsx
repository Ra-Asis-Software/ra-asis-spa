import { useState } from "react";
import styles from "../css/Grading.module.css";

const Grade = ({ student, assignment, questions, onBack }) => {
  const [questionMarks, setQuestionMarks] = useState(() => {
    const marks = {};
    student.answers.forEach((a) => {
      marks[a.questionId] = a.marks || "";
    });
    return marks;
  });

  const [overallComment, setOverallComment] = useState("");
  const [penaltyMarks, setPenaltyMarks] = useState(0);

  const handleQuestionMarkChange = (questionId, marks) => {
    const numericMarks = Math.max(0, parseFloat(marks) || 0);
    const maxMarks = questions.find((q) => q.id === questionId)?.maxMarks || 0;
    const finalMarks = Math.min(numericMarks, maxMarks);

    setQuestionMarks((prev) => ({
      ...prev,
      [questionId]: finalMarks,
    }));
  };

  const calculateTotalMarks = () =>
    Object.values(questionMarks).reduce(
      (sum, mark) => sum + (parseFloat(mark) || 0),
      0
    );

  const getTotalPossibleMarks = () =>
    questions.reduce((sum, q) => sum + q.maxMarks, 0);

  const calculateFinalGrade = () =>
    Math.max(0, calculateTotalMarks() - (parseFloat(penaltyMarks) || 0));

  const handleFinishGrading = () => {
    const finalGrade = calculateFinalGrade();
    console.log("Grading completed:", {
      studentId: student.id,
      studentName: student.name,
      questionMarks,
      totalMarks: calculateTotalMarks(),
      penaltyMarks,
      finalGrade,
      overallComment,
    });

    alert(
      `Grading completed for ${
        student.name
      }. Final Grade: ${finalGrade}/${getTotalPossibleMarks()}`
    );
    onBack();
  };

  return (
    <div className={styles.gradingContainer}>
      <div className={styles.contentArea}>
        <div className={styles.gradeHeader}>
          <button className={styles.closeSubmissions} onClick={onBack}>
            <i className="fa-solid fa-left-long"></i>
            <p>Back</p>
          </button>
          <h3>
            {assignment.title} - {student.name}
          </h3>
        </div>

        <div className={styles.assignmentContainer}>
          <div className={styles.assignmentContent}>
            {questions.map((question, index) => {
              const studentAnswer = student.answers.find(
                (a) => a.questionId === question.id
              );
              return (
                <div key={question.id} className={styles.questionCard}>
                  <div className={styles.questionHeader}>
                    <div>
                      <h3>Qn {index + 1}</h3>
                    </div>
                    <p className={styles.questionText}>{question.question}</p>
                  </div>

                  <div className={styles.answerSection}>
                    <div className={styles.studentAnswerContainer}>
                      <p className={styles.studentAnswer}>
                        {studentAnswer?.answer || "No answer provided"}
                      </p>
                    </div>

                    <div className={styles.MarksGroup}>
                      <label className={styles.inputLabel}>
                        Marks ({questionMarks[question.id] || 0}/
                        {question.maxMarks})
                      </label>
                      <input
                        type="number"
                        // min="0"
                        max={question.maxMarks}
                        step="0.5"
                        value={questionMarks[question.id] || ""}
                        onChange={(e) =>
                          handleQuestionMarkChange(question.id, e.target.value)
                        }
                        className={styles.marksInput}
                        placeholder={`0 - ${question.maxMarks}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grade Panel */}
      <div className={styles.gradeArea}>
        <div className={styles.gradingPanel}>
          <div className={styles.gradingHeader}>
            <h3 className={styles.gradingTitle}>Grade Submission</h3>
          </div>

          <div className={styles.gradingContent}>
            <div className={styles.studentSummary}>
              <div className={styles.summaryItem}>
                <label>Student:</label>
                <span>{student.name}</span>
              </div>
              <div className={styles.summaryItem}>
                <label>Submitted:</label>
                <span>{student.submittedAt}</span>
              </div>
              <div className={styles.summaryItem}>
                <label>Status:</label>
                <span
                  className={`${styles.submissionStatus} ${
                    student.isLate ? styles.late : styles.onTime
                  }`}
                >
                  {student.isLate ? "Late Submission" : "On Time"}
                </span>
              </div>
            </div>

            <div className={styles.gradingForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="penalty">Penalty Marks:</label>
                <input
                  type="number"
                  id="penalty"
                  min="0"
                  step="0.5"
                  value={penaltyMarks}
                  onChange={(e) =>
                    setPenaltyMarks(parseFloat(e.target.value) || 0)
                  }
                  className={styles.penaltyInput}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Total Marks Awarded:</label>
                <span className={styles.totalMarks}>
                  {calculateTotalMarks()}/{getTotalPossibleMarks()}
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label>Final Grade:</label>
                <span className={styles.finalGrade}>
                  {calculateFinalGrade()}/{getTotalPossibleMarks()}
                  <span className={styles.percentage}>
                    (
                    {Math.round(
                      (calculateFinalGrade() / getTotalPossibleMarks()) * 100
                    )}
                    %)
                  </span>
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="overallComment">Overall Feedback:</label>
                <textarea
                  id="overallComment"
                  value={overallComment}
                  onChange={(e) => setOverallComment(e.target.value)}
                  placeholder="Leave overall feedback for the student..."
                  rows="4"
                  className={styles.overallCommentInput}
                />
              </div>

              <button
                className={styles.finishGradingButton}
                onClick={handleFinishGrading}
                disabled={Object.keys(questionMarks).length === 0}
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
