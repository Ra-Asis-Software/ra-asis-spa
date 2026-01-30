import { useEffect, useState } from "react";
import styles from "../css/Grade.module.css";
import {
  handleDueDate,
  removeUrlParams,
  useUrlParams,
} from "../../../utils/assessmentUtils";
import { gradeAssignmentSubmission } from "../../../services/assignmentService";
import { gradeQuizSubmission } from "../../../services/quizService";
import Modal from "../../ui/Modal";

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
  const [alertMessage, setAlertMessage] = useState({ text: "", type: "" });
  const [fileMarks, setFileMarks] = useState(0);
  const [fileMarked, setFileMarked] = useState(false);

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

    if (selectedSubmission?.gradingStatus === "graded") {
      setFileMarked(true);
      setFileMarks(selectedSubmission?.fileMarks);
    }

    //integrating student answers to the questions
    fuseAnswersToQuestions(tempContent, tempStudentAnswers);
  }, []);

  //for recalculating total marks
  useEffect(() => {
    const tempAnswers = { ...studentAnswers };

    let tempTotalMarks = Object.entries(tempAnswers).reduce(
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
          setAlertMessage({
            text: "You cannot assign a mark less than zero",
            type: "bad",
          });
        }
      } else {
        setAlertMessage({
          text: "Mark assigned exceeds the allocated marks",
          type: "bad",
        });
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
      if (
        ["file", "mixed"].includes(
          selectedAssessment?.submissionType?.toLowerCase()
        ) &&
        !fileMarked
      ) {
        setAlertMessage({
          type: "bad",
          text: "No mark has been set for the file submission",
        });
      } else {
        if (selectedSubmission.gradingStatus !== "graded") {
          const gradeSubmitted =
            type === "assignment"
              ? await gradeAssignmentSubmission(
                  selectedAssessment._id,
                  selectedSubmission._id,
                  { studentAnswers, comments, fileMarks }
                )
              : await gradeQuizSubmission(
                  selectedAssessment._id,
                  selectedSubmission._id,
                  { studentAnswers, comments, fileMarks }
                );

          if (!gradeSubmitted.error) {
            removeUrlParams("submission");
            window.location.reload();
          }
        }
      }
    } else {
      setAlertMessage({
        text: "Some questions have not been graded",
        type: "bad",
      });
    }
  };

  const handleChangeFileMarks = (value) => {
    if (selectedAssessment.fileMarks < value) {
      setAlertMessage({
        text: "The mark assigned is greater than the alloted file marks",
        type: "bad",
      });
    } else {
      setFileMarks(value);
    }
  };

  let questionNumber = 1;
  return (
    <div className={styles.gradingContainer}>
      <Modal
        isOpen={alertMessage.text.length > 0}
        onClose={() => setAlertMessage({ text: "", type: "" })}
      >
        <div className={styles.alertBox}>
          <h3
            className={
              alertMessage.type === "bad"
                ? styles.alertError
                : styles.alertSuccess
            }
          >
            {alertMessage.type === "bad"
              ? "ERROR!"
              : alertMessage.type === "good" && "SUCCESS"}
          </h3>
          <p
            className={
              alertMessage.type === "bad"
                ? styles.alertError
                : styles.alertSuccess
            }
          >
            {alertMessage.text}
          </p>
        </div>
      </Modal>
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
          {selectedAssessment?.fileMarks > 0 && (
            <div className={styles.submissionFiles}>
              <h5>Student files</h5>
              {
                <div className={styles.fileBox}>
                  {selectedSubmission.files.length === 0 && (
                    <p>Student did not submit any file</p>
                  )}
                  {selectedSubmission.files.map((file, index) => {
                    return (
                      <button key={index} className={styles.buttonFile}>
                        <p>{file.fileName}</p>
                        <i class="fa-solid fa-download"></i>
                      </button>
                    );
                  })}
                </div>
              }
              <div className={styles.marksGroup}>
                <div className={styles.marksContent}>
                  <label className={styles.inputLabel}>Marks</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    disabled={fileMarked}
                    value={fileMarks}
                    className={styles.marksInput}
                    onChange={(e) => handleChangeFileMarks(e.target.value)}
                  />
                  <label className={styles.inputLabel}>
                    /{selectedAssessment.fileMarks}
                  </label>
                </div>
                {fileMarked ? (
                  <button
                    className={styles.marked}
                    disabled={selectedSubmission?.gradingStatus === "graded"}
                    onClick={() => setFileMarked(false)}
                  >
                    Marked
                  </button>
                ) : (
                  <button
                    className={styles.confirmMark}
                    onClick={() => setFileMarked(true)}
                  >
                    Mark
                  </button>
                )}
              </div>
            </div>
          )}
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
                    <p
                      className={`${styles.studentAnswer} ${
                        !item.studentAnswer && styles.noAnswer
                      }`}
                    >
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
                          item.studentAnswer?.correctAnswer ||
                          item.studentAnswer?.marks !== null
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
                    {item.studentAnswer === null ||
                    item.studentAnswer.marks !== null ? (
                      <button
                        className={styles.marked}
                        onClick={() => handleCancelMark(item)}
                      >
                        {item.studentAnswer === null ? "No mark" : "marked"}
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
                <span>{selectedSubmission.submittedAt?.slice(0, 10)}</span>
              </div>
              <div className={styles.summaryItem}>
                <label>Status:</label>
                <span
                  className={
                    selectedSubmission.gradingStatus === "graded"
                      ? styles.alertSuccess
                      : selectedSubmission.gradingStatus === "in-progress" &&
                        styles.yellowText
                  }
                >
                  {selectedSubmission.gradingStatus}
                </span>
              </div>
            </div>

            <div className={styles.gradingForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="penalty">Penalty Marks: 0</label>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="totalMarks">
                  Total Marks:{" "}
                  {totalMarks + (fileMarked ? Number(fileMarks) : 0)} /{" "}
                  {selectedAssessment.maxMarks + selectedAssessment.fileMarks}
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label>
                  Final Grade:{" "}
                  {totalMarks + (fileMarked ? Number(fileMarks) : 0)} /{" "}
                  {selectedAssessment.maxMarks + selectedAssessment.fileMarks}
                </label>
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
