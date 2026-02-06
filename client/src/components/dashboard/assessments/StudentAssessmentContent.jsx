import { useState } from "react";
import styles from "./Assessments.module.css";
import { stripHTML, timeLeft } from "../../../utils/assessmentUtils.js";
import FileSelector from "./FileSelector.jsx";

const StudentAssessmentContent = ({
  content,
  currentAssessment,
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

  const handleExpandAnswerArea = (target) => {
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  let questionNumber = 1;

  return (
    <>
      <p className={styles.lateSubmission}>
        {timeLeft(currentAssessment.deadLine) < 0 &&
          "This assessment is overdue, it will be flagged as late and penalized"}
      </p>
      <h3>Assignment: {currentAssessment.title}</h3>
      {["file", "mixed"].includes(currentAssessment.submissionType) && (
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
      {["file", "mixed"].includes(
        currentAssessment?.submissionType?.toLowerCase()
      ) && (
        <div className={`${styles.fileMarks} ${styles.studentFileMarks}`}>
          <p>Marks for file submission:</p>
          <p>({currentAssessment.fileMarks} marks)</p>
        </div>
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
                          className={`${styles.addedTextArea}`}
                          onFocus={(e) => handleExpandAnswerArea(e.target)}
                          onChange={(e) => {
                            setAnswerValue(e.target.value);
                            handleExpandAnswerArea(e.target);
                          }}
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
                  <div className={styles.questionContent}>
                    <p>{`${questionNumber++}.) `}</p>
                    <div
                      className={`${styles.textLong} ${styles.editable} ${styles.textLongWork}`}
                    >
                      {stripHTML(item.data)}
                    </div>
                  </div>
                  <p className={styles.marksArea}>({item.marks} marks)</p>
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
                      onFocus={(e) => handleExpandAnswerArea(e.target)}
                      onChange={(e) => {
                        setAnswerValue(e.target.value);
                        handleExpandAnswerArea(e.target);
                      }}
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

export default StudentAssessmentContent;
