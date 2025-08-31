import RoleRestricted from "../../ui/RoleRestricted";
import { TeacherAssessmentContent } from "./TeacherAssessmentContent";
import { StudentAssessmentContent } from "./StudentAssessmentContent";
import styles from "../css/Assessments.module.css";
import {
  correctAnswerNotSet,
  handleDueDate,
  hasSingleAnswerOption,
  isAnyAnswerEmpty,
  timeLeft,
  useFileUploads,
  useUrlParams,
} from "../../../utils/assessments";
import { useState } from "react";
import {
  submitAssignment,
  editAssignment,
  deleteSubmission,
} from "../../../services/assignmentService";
import AssessmentTools from "./AssessmentTools";
import { SubmissionTools } from "./SubmissionTools";
import { editQuiz, startQuiz, submitQuiz } from "../../../services/quizService";
import StartQuiz from "./StartQuiz";
import QuizTimer from "./QuizTimer";
import { useRef } from "react";

const AssessmentContent = ({
  content,
  setContent,
  showButton,
  setShowButton,
  trigger,
  setTrigger,
  openSubmission,
  resetAssessmentContent,
  currentAssessment,
  assessmentExtras,
  setAssessmentExtras,
  handleOpenExistingAssessment,
  canEdit,
  setCanEdit,
  handleCloseAssessment,
  message,
  setMessage,
  clearMessage,
  timeLimit,
  setTimeLimit,
}) => {
  const [studentAnswers, setStudentAnswers] = useState({});
  const quizSystemSubmitted = useRef(false); //if student was locked out of the quiz or not
  const { isOpened, type } = useUrlParams();

  const assignmentFiles = useFileUploads();
  const submissionFiles = useFileUploads();

  const checkEmptyAnswerFields = (studentAnswers, content) => {
    let questionNumber = 0;
    for (const item of content) {
      if (item.type === "question" || item.type === "textArea") {
        questionNumber++;
        const answer = studentAnswers[item.id];

        // multiple choice
        if (item?.answers?.length > 0) {
          if (!answer || !item.answers.includes(answer)) {
            return questionNumber; // return first unanswered multiple-choice
          }
        } else {
          // open-ended question or textArea
          if (!answer || answer.trim() === "") {
            return questionNumber; // return first unanswered open-ended
          }
        }
      }
    }

    return null;
  };

  const handleSubmitAssessment = async () => {
    const lacksAnswer = checkEmptyAnswerFields(studentAnswers, content);
    if (lacksAnswer && type === "assignment") {
      setMessage(`Question ${lacksAnswer} has not been answered`);
      clearMessage();
    } else {
      const formData = new FormData();

      submissionFiles.files.forEach((file) => formData.append("files", file));
      const answerSheet = JSON.stringify(studentAnswers);
      formData.append("content", answerSheet);
      formData.append("time", Date.now());
      if (type === "quiz") {
        formData.append("autoSubmitted", quizSystemSubmitted.current);
        formData.append("submissionId", openSubmission._id);
      }

      const submissionResults =
        type === "assignment"
          ? await submitAssignment(formData, currentAssessment._id)
          : type === "quiz" &&
            (await submitQuiz(formData, currentAssessment._id));

      if (submissionResults.error) {
        setMessage(submissionResults.error);
        clearMessage();
      } else {
        window.location.reload();
      }
      submissionFiles.resetFiles();
    }
  };

  const handleEditAssessment = async () => {
    //check if all auto-grade answers are still intact
    const answerNotSet = correctAnswerNotSet(content);
    const singleAnswerOption = hasSingleAnswerOption(content);
    const answerIsEmpty = isAnyAnswerEmpty(content);
    if (singleAnswerOption) {
      setMessage(`Question ${singleAnswerOption} has only one answer option`);
    } else if (answerIsEmpty) {
      setMessage(`You have an empty answer in question ${answerIsEmpty}`);
    } else if (answerNotSet) {
      setMessage(
        `You have not set the correct answer for question ${answerNotSet}`
      );
    } else {
      const formData = new FormData();

      assignmentFiles.files.forEach((file) => formData.append("files", file));
      const newContent = JSON.stringify(content);
      formData.append("content", newContent);
      formData.append(
        "deadLine",
        `${assessmentExtras.date}T${assessmentExtras.time}`
      );
      formData.append("maxMarks", assessmentExtras.marks);
      formData.append("createdBy", currentAssessment?.createdBy?._id);
      if (type === "quiz") {
        formData.append(
          "timeLimit",
          JSON.stringify({
            value: Number(timeLimit.value),
            unit: timeLimit.unit,
          })
        );
      }

      try {
        const assessmentId = currentAssessment._id;
        if (assessmentId) {
          const editResult =
            type === "assignment"
              ? await editAssignment(formData, assessmentId)
              : await editQuiz(formData, assessmentId);

          if (editResult.error) {
            setMessage(editResult.error);
          } else {
            const editedAssessment = editResult.data?.[type];
            resetAssessmentContent();
            handleOpenExistingAssessment(editedAssessment);
          }
        }
        assignmentFiles.resetFiles();
      } catch (error) {
        console.log(error);
      }
    }
    clearMessage();
  };

  const handleRemoveSubmission = async () => {
    const removeSubmission = await deleteSubmission(openSubmission._id);

    if (removeSubmission.error) {
      //
    } else {
      window.location.reload();
    }
  };

  const handleStartQuiz = async () => {
    const quizStarted = await startQuiz({ quizId: currentAssessment._id });

    if (quizStarted.error) {
      //
    } else {
      setTrigger(!trigger);
      handleOpenExistingAssessment(quizStarted.data.quiz);
    }
  };

  return (
    <>
      <RoleRestricted allowedRoles={["teacher"]}>
        <div className={styles.assignmentsBox}>
          {isOpened && (
            <div className={styles.assignmentsHeader}>
              <button
                className={styles.addAssignment}
                onClick={handleCloseAssessment}
              >
                <i className="fa-solid fa-left-long"></i>
                <p>Back</p>
              </button>

              <h3>Assignment: {currentAssessment.title}</h3>

              {canEdit ? (
                <button
                  className={`${styles.addAssignment} ${styles.editButton}`}
                  onClick={() => setCanEdit(false)}
                >
                  Close Edit
                </button>
              ) : (
                <button
                  className={`${styles.addAssignment} ${styles.editButton}`}
                  onClick={() => setCanEdit(true)}
                >
                  Edit
                </button>
              )}
            </div>
          )}
          <div className={styles.newAssignmentContent}>
            <TeacherAssessmentContent
              {...{
                content,
                setContent,
                showButton,
                setShowButton,
                trigger,
                setTrigger,
                currentAssessment,
                canEdit,
                assignmentFiles,
                setMessage,
                clearMessage,
                setAssessmentExtras,
              }}
            />
          </div>
        </div>
        <div className={styles.extras}>
          <AssessmentTools
            {...{
              canEdit,
              setShowButton,
              setAssessmentExtras,
              handleEditAssessment,
              message,
              assessmentExtras,
              assignmentFiles,
              timeLimit,
              setTimeLimit,
            }}
          />
        </div>
      </RoleRestricted>
      <RoleRestricted allowedRoles={["student"]}>
        {!openSubmission && type === "quiz" ? (
          <StartQuiz quiz={currentAssessment} {...{ handleStartQuiz }} />
        ) : (
          <>
            <div
              className={`${styles.assignmentsBox} ${styles.assignmentsBoxOpened}`}
            >
              <div className={styles.assignmentsHeader}>
                <button
                  className={styles.addAssignment}
                  onClick={handleCloseAssessment}
                >
                  <i className="fa-solid fa-left-long"></i>
                  <p>Back</p>
                </button>
              </div>
              {(openSubmission && type === "assignment") ||
              (type === "quiz" && openSubmission?.submittedAt) ? (
                <div className={styles.submittedBox}>
                  <h3>
                    {type} submitted{" "}
                    {openSubmission?.submissionStatus === "overdue" && "late"}
                  </h3>
                  <div className={styles.divFlex}>
                    Deadline:{" "}
                    <p className={styles.cerulianText}>
                      {handleDueDate(currentAssessment.deadLine)}
                    </p>
                  </div>
                  <div className={styles.divFlex}>
                    Grade: <p className={styles.cerulianText}>Not yet graded</p>
                  </div>
                  {/* restrict reattempts to when deadline is in > 20 minutes */}
                  {type === "assignment" &&
                    timeLeft(currentAssessment.deadLine) > 20 && (
                      <button
                        className={styles.removeSubmission}
                        onClick={handleRemoveSubmission}
                      >
                        REMOVE SUBMISSION
                      </button>
                    )}
                </div>
              ) : (
                <>
                  <StudentAssessmentContent
                    {...{
                      currentAssessment,
                      content,
                      studentAnswers,
                      setStudentAnswers,
                      submissionFiles,
                    }}
                  />
                  {type === "quiz" && (
                    <QuizTimer
                      startedAt={openSubmission.startedAt}
                      timeLimit={currentAssessment.timeLimit}
                      onTimeIsUp={handleSubmitAssessment}
                      submissionStatus={openSubmission.submissionStatus}
                      {...{ quizSystemSubmitted, studentAnswers }}
                    />
                  )}
                </>
              )}
            </div>
            <div className={styles.extras}>
              <SubmissionTools
                {...{
                  handleSubmitAssessment,
                  currentAssessment,
                  openSubmission,
                  message,
                }}
              />
            </div>
          </>
        )}
      </RoleRestricted>
    </>
  );
};

export default AssessmentContent;
