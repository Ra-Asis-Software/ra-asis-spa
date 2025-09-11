import { useEffect, useState } from "react";
import styles from "../css/Grade.module.css";
import { handleDueDate, useUrlParams } from "../../../utils/assessments";
import { gradeAssignmentSubmission } from "../../../services/assignmentService";
import { gradeQuizSubmission } from "../../../services/quizService";

const Grade = ({
  selectedSubmission,
  selectedAssessment,
  handleCloseGradingSession,
}) => {
  const [content, setContent] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [marksValues, setMarksValues] = useState({});
  const [totalMarks, setTotalMarks] = useState(0);
  const [comments, setComments] = useState("");
  const { submission, type } = useUrlParams();

  //for checking if both assessment and submission are present
  useEffect(() => {
    if (!submission || !selectedAssessment || !selectedSubmission) {
      handleCloseGradingSession();
      return;
    }

    const tempContent = JSON.parse(selectedAssessment.content);
    const tempStudentAnswers = JSON.parse(selectedSubmission.content);
    setQuestions(tempContent);
    setStudentAnswers(tempStudentAnswers);
    setComments(selectedSubmission?.feedBack || "");

    //integrating student answers to the questions
    fuseAnswersToQuestions(tempContent, tempStudentAnswers);
  }, []);

  //for recalculating total marks
  useEffect(() => {
    const tempAnswers = { ...studentAnswers };

    const tempTotalMarks = Object.entries(tempAnswers).reduce(
      (total, current) => {
        return total + Number(current[1].marks ?? 0);
      },
      0
    );

    setTotalMarks(tempTotalMarks);
  }, [studentAnswers]);

  //integrate student answers to the questions
  const fuseAnswersToQuestions = (questions, answers) => {
    const tempContentWithAnswers = questions.map((item) => {
      if (["question", "textArea"].includes(item.type)) {
        return {
          ...item,
          studentAnswer: answers[item.id] || null,
        };
      }
      return item;
    });
    setContent(tempContentWithAnswers);
  };

  //as the input element for marks changes
  const handleChangeMark = (value, id) => {
    const tempMarks = { ...marksValues };
    tempMarks[id] = value;
    setMarksValues(tempMarks);
  };

  //when the "mark" button is pressed
  const handleSaveMark = (id) => {
    const thisQuestion = questions.find((q) => q.id === id);
    const tempStudentAnswers = { ...studentAnswers };

    if (marksValues?.[id]) {
      if (Number(marksValues[id]) <= Number(thisQuestion.marks)) {
        if (Number(marksValues[id]) >= 0) {
          tempStudentAnswers[id].marks = marksValues[id];
          setStudentAnswers(tempStudentAnswers);
          fuseAnswersToQuestions(questions, tempStudentAnswers);
        } else {
          alert("Invalid marks"); //to be changed appropriately
        }
      } else {
        alert("Mark assigned exceeds the allocated marks"); //to be changed appropriately
      }
    }
  };

  const handleCancelMark = (item) => {
    const id = item.id;

    //don't include auto-graded questions
    if (!item.studentAnswer.correctAnswer) {
      const tempStudentAnswers = { ...studentAnswers };

      if (marksValues?.[id]) {
        tempStudentAnswers[id].marks = null;
        setStudentAnswers(tempStudentAnswers);
      }
      fuseAnswersToQuestions(questions, tempStudentAnswers);
    }
  };

  const handleSubmitGrade = async () => {
    if (
      //ensure no questions go unmarked
      Object.entries(studentAnswers).every((item) => item[1]?.marks !== null)
    ) {
      if (selectedSubmission.gradingStatus !== "graded") {
        const gradeSubmitted =
          type === "assignment"
            ? await gradeAssignmentSubmission(
                selectedAssessment._id,
                selectedSubmission._id,
                { studentAnswers, comments }
              )
            : await gradeQuizSubmission(
                selectedAssessment._id,
                selectedSubmission._id,
                { studentAnswers, comments }
              );

        if (!gradeSubmitted.error) {
          window.location.reload(); //to be changed appropriately
        }
      }
    } else {
      alert("Some questions have not been graded"); //to be changed appropriately
    }
  };

  let questionNumber = 1;
  return (
    <div className={styles.gradingContainer}>
      <div className={styles.contentArea}>
        <div className={styles.gradeHeader}>
          <button
            className={styles.closeSubmissions}
            onClick={() => handleCloseGradingSession()}
          >
            <i className="fa-solid fa-left-long"></i>
            <p>Back</p>
          </button>
          <h3>Grade {selectedAssessment.title}</h3>
        </div>

        <div className={styles.assignmentContent}>
          {content.map((item) => {
            return (
              <div
                key={item.id}
                className={`${styles.questionCard} ${
                  !["question", "textArea"].includes(item.type) &&
                  styles.notQuestion
                }`}
              >
                <div className={styles.questionHeader}>
                  <h3>
                    {["question", "textArea"].includes(item.type) &&
                      `${questionNumber++}.`}{" "}
                  </h3>
                  <p className={styles.questionText}>{item.data}</p>
                </div>

                {["question", "textArea"].includes(item.type) && (
                  <div className={styles.studentAnswerContainer}>
                    <p className={styles.studentAnswer}>
                      {item?.studentAnswer?.userAnswer || "No answer provided"}
                    </p>
                  </div>
                )}

                {item?.marks && (
                  <div className={styles.marksGroup}>
                    <div className={styles.marksContent}>
                      <label className={styles.inputLabel}>Marks</label>
                      <input
                        type="number"
                        disabled={
                          item.studentAnswer.correctAnswer ||
                          item.studentAnswer.marks !== null
                        }
                        min={0}
                        step={1}
                        max={Number(item.marks)}
                        defaultValue={item?.studentAnswer?.marks}
                        className={styles.marksInput}
                        onChange={(e) =>
                          handleChangeMark(e.target.value, item.id)
                        }
                      />
                      <label className={styles.inputLabel}>/{item.marks}</label>
                    </div>
                    {item.studentAnswer.marks !== null ? (
                      <button
                        className={styles.marked}
                        onClick={() => handleCancelMark(item)}
                      >
                        marked
                      </button>
                    ) : (
                      <button
                        className={styles.confirmMark}
                        onClick={() => handleSaveMark(item.id)}
                      >
                        Mark
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.gradeArea}>
        <div className={styles.gradingPanel}>
          <div className={styles.gradingContent}>
            <div className={styles.studentSummary}>
              <div className={styles.summaryItem}>
                <label>Student:</label>
                <span>
                  {selectedSubmission.student.firstName}{" "}
                  {selectedSubmission.student.lastName}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <label>Submitted:</label>
                <span>{selectedSubmission.submittedAt.slice(0, 10)}</span>
              </div>
              <div className={styles.summaryItem}>
                <label>Status:</label>
                <span>{selectedSubmission.gradingStatus}</span>
              </div>
            </div>

            <div className={styles.gradingForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="penalty">Penalty Marks: 0</label>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="totalMarks">Total Marks: {totalMarks}</label>
              </div>

              <div className={styles.inputGroup}>
                <label>Final Grade: {totalMarks - 0}</label>
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  id="comment"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Leave feedback for the student..."
                  rows="4"
                />
              </div>

              {handleDueDate(selectedAssessment.deadLine) === "Overdue" ? (
                <button
                  className={styles.finishGradingButton}
                  onClick={handleSubmitGrade}
                  disabled={selectedSubmission.gradingStatus === "graded"}
                >
                  <i className="fas fa-check"></i>
                  {selectedSubmission.gradingStatus === "graded"
                    ? "Graded"
                    : "Grade"}
                </button>
              ) : (
                <p>
                  This assessment will be available for grading in{" "}
                  {handleDueDate(selectedAssessment.deadLine)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grade;
