import { useState } from "react";
import { stripHTML, timeLeft } from "../../../utils/assignments";
import styles from "../css/Assignments.module.css";
import { FileSelector } from "./FileSelector";

export const StudentAssignmentContent = ({
  content,
  currentAssignment,
  studentAnswers,
  setStudentAnswers,
  submissionFiles,
}) => {
  const [openAnswerArea, setOpenAnswerArea] = useState(null);
  const [answerValue, setAnswerValue] = useState(null);

  //allow student to choose their answers
  const handleChooseAnswer = (chosenAnswer, questionId) => {
    const tempAnswers = { ...studentAnswers };

    tempAnswers[questionId] = chosenAnswer;
    setStudentAnswers(tempAnswers);
  };

  const handleWriteAnswer = (questionId) => {
    const tempAnswers = { ...studentAnswers };

    if (openAnswerArea === questionId && answerValue !== null) {
      tempAnswers[questionId] = answerValue;
    }
    setStudentAnswers(tempAnswers);
    setOpenAnswerArea(null);
    setAnswerValue(null);
  };

  let questionNumber = 1;
  return (
    <>
      <p className={styles.lateSubmission}>
        {timeLeft(currentAssignment.deadLine) < 0 &&
          "This assignment is overdue, it will be flagged as late and penalized"}
      </p>
      <h3>Assignment: {currentAssignment.title}</h3>
      {currentAssignment.submissionType === "file" && (
        <>
          <div className={styles.studentFileUpload}>
            <button
              className={styles.studentFileUploadButton}
              onClick={submissionFiles.chooseFiles}
            >
              <i
                className={`fa-solid fa-file-arrow-up ${styles.uploadIcon}`}
              ></i>
            </button>
            <p>Upload file/s</p>
          </div>

          <FileSelector selector={submissionFiles} />
        </>
      )}
      {content.map((item, index) => {
        return (
          <div key={item.id || index} className={`${styles.edDivWork}`}>
            {item.type === "instruction" && (
              <p
                className={`${styles.textInstruction} ${styles.editable} ${styles.textInstructionWork}`}
              >
                {stripHTML(item.data)}
              </p>
            )}

            {item.type === "title" && (
              <h4
                className={`${styles.textTitle} ${styles.editable} ${styles.textTitleWork}`}
              >
                {stripHTML(item.data)}
              </h4>
            )}

            {item.type === "question" && (
              <div
                className={`${styles.questionContainer} ${styles.questionContainerWork}`}
              >
                <div className={styles.questionHolder}>
                  <div className={styles.questionContent}>
                    {" "}
                    <p>{`${questionNumber++}.) `}</p>
                    <p
                      className={`${styles.textQuestion} ${styles.editable} ${styles.textQuestionWork}`}
                    >
                      {stripHTML(item.data)}
                    </p>
                  </div>

                  <p className={styles.marksArea}>({item.marks} marks)</p>
                </div>

                {item.answers.map((ans, answerIndex) => {
                  //show radio inputs for answer selection
                  return (
                    <div className={`${styles.answerBox}`} key={answerIndex}>
                      <input
                        type="radio"
                        name={`question${index}Answer`}
                        defaultChecked={studentAnswers[item.id === ans]}
                        onChange={() => handleChooseAnswer(ans, item.id)}
                      />
                      <p className={`${styles.editable} ${styles.answerWork}`}>
                        {ans}
                      </p>
                    </div>
                  );
                })}

                {item.answers.length === 0 && ( //provide attempting area for non multiple-choice questions
                  <>
                    {openAnswerArea !== item.id ? (
                      <button
                        className={`${styles.attemptButton} ${
                          studentAnswers?.[item.id]?.length > 0
                            ? styles.attempted
                            : styles.cerulianText
                        }`}
                        onClick={() => setOpenAnswerArea(item.id)}
                      >
                        {studentAnswers?.[item.id]?.length > 0
                          ? "answered"
                          : "Attempt now"}
                      </button>
                    ) : (
                      <div className={styles.answerArea}>
                        <textarea
                          defaultValue={studentAnswers?.[item.id]}
                          placeholder="Enter answer here..."
                          className={styles.addedTextArea}
                          onChange={(e) => setAnswerValue(e.target.value)}
                        />
                        <button onClick={() => handleWriteAnswer(item.id)}>
                          Save answer
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {item.type === "textArea" && (
              <div className={styles.questionAnswerBox}>
                <div className={styles.questionHolder}>
                  <p>{`${questionNumber++}.) `}</p>
                  <div
                    className={`${styles.textLong} ${styles.editable} ${styles.textLongWork}`}
                  >
                    {stripHTML(item.data)}
                  </div>
                </div>

                {openAnswerArea !== item.id ? (
                  <button
                    className={`${styles.attemptButton} ${
                      studentAnswers?.[item.id]?.length > 0
                        ? styles.attempted
                        : styles.cerulianText
                    }`}
                    onClick={() => setOpenAnswerArea(item.id)}
                  >
                    {studentAnswers?.[item.id]?.length > 0
                      ? "answered"
                      : "Attempt now"}
                  </button>
                ) : (
                  <div className={styles.answerArea}>
                    <textarea
                      defaultValue={studentAnswers?.[item.id]}
                      placeholder="Enter answer here..."
                      className={styles.addedTextArea}
                      onChange={(e) => setAnswerValue(e.target.value)}
                    />
                    <button onClick={() => handleWriteAnswer(item.id)}>
                      Save answer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
