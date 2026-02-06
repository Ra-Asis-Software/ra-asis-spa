import { useEffect, useRef, useState } from "react";
import styles from "../css/Assessments.module.css";
import {
  absoluteTimeLeft,
  capitalizeFirstLetter,
  correctAnswerNotSet,
  handleDueDate,
  hasSingleAnswerOption,
  isAnyAnswerEmpty,
  timeLeft,
  useFileUploads,
  useUrlParams,
} from "../../../utils/assessmentUtils.js";
import {
  submitAssignment,
  editAssignment,
  deleteSubmission,
} from "../../../services/assignmentService.js";
import {
  deleteUnresolvedQuiz,
  editQuiz,
  startQuiz,
  submitQuiz,
} from "../../../services/quizService.js";
import RoleRestricted from "../../ui/RoleRestricted.jsx";
import TeacherAssessmentContent from "./TeacherAssessmentContent.jsx";
import StudentAssessmentContent from "./StudentAssessmentContent.jsx";
import StartQuiz from "./StartQuiz.jsx";
import QuizTimer from "./QuizTimer.jsx";
import AssessmentTools from "./AssessmentTools.jsx";
import SubmissionTools from "./SubmissionTools.jsx";
import SubmissionDetails from "./SubmissionDetails.jsx";

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
  setMessage,
  clearMessage,
  timeLimit,
  setTimeLimit,
  loading,
  setLoading,
}) => {
  const [studentAnswers, setStudentAnswers] = useState({});
  const [title, setTitle] = useState(currentAssessment?.title || "");
  const quizSystemSubmitted = useRef(false); //if student was locked out of the quiz or not
  const { isOpened, type } = useUrlParams();

  const assignmentFiles = useFileUploads();
  const submissionFiles = useFileUploads();

  // Update when currentAssessment changes
  useEffect(() => {
    if (currentAssessment?.title) {
      setTitle(currentAssessment.title);
    }
  }, [currentAssessment]);

  useEffect(() => {
    //handle submission that has been started but not submitted yet
    const resolveUnsubmittedQuiz = async () => {
      if (
        type === "quiz" &&
        openSubmission?.startedAt &&
        !openSubmission?.submittedAt &&
        absoluteTimeLeft(
          currentAssessment?.timeLimit,
          openSubmission?.startedAt
        ) < 0
      ) {
        const submissionResolved = await deleteUnresolvedQuiz(
          currentAssessment._id,
          openSubmission._id
        );
        if (submissionResolved.error) {
          setMessage({ type: "error", text: submissionResolved.error });
        } else {
          setTrigger(!trigger);
          setMessage({
            type: "success",
            text: submissionResolved.data.message,
          });
        }

        clearMessage();
      }
    };
    resolveUnsubmittedQuiz();
  }, []);

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
      setMessage({
        type: "error",
        text: `Question ${lacksAnswer} has not been answered`,
      });
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

      setLoading(true);
      const submissionResults =
        type === "assignment"
          ? await submitAssignment(formData, currentAssessment._id)
          : type === "quiz" &&
            (await submitQuiz(formData, currentAssessment._id));
      setLoading(false);

      if (submissionResults.error) {
        setMessage({ type: "error", text: submissionResults.error });
      } else {
        setMessage({
          type: "success",
          text: "Your submission has been accepted",
        });
        submissionFiles.resetFiles();
        resetAssessmentContent();
        setStudentAnswers({});
        handleOpenExistingAssessment(currentAssessment);
      }
      clearMessage();
    }
  };

  const handleEditAssessment = async () => {
    if (!title || title.trim() === "") {
      setMessage({
        type: "error",
        text: "Title is required. Please enter a title for the assessment.",
      });
      clearMessage();
      return;
    }

    //check if all auto-grade answers are still intact
    const answerNotSet = correctAnswerNotSet(content);
    const singleAnswerOption = hasSingleAnswerOption(content);
    const answerIsEmpty = isAnyAnswerEmpty(content);
    if (singleAnswerOption) {
      setMessage({
        type: "error",
        text: `Question ${singleAnswerOption} has only one answer option`,
      });
    } else if (answerIsEmpty) {
      setMessage({
        type: "error",
        text: `You have an empty answer in question ${answerIsEmpty}`,
      });
    } else if (answerNotSet) {
      setMessage({
        type: "error",
        text: `You have not set the correct answer for question ${answerNotSet}`,
      });
    } else {
      const formData = new FormData();

      if (assignmentFiles.files.length > 0) {
        assignmentFiles.files.forEach((file) => formData.append("files", file));
      }

      const newContent = JSON.stringify(content);
      formData.append("content", newContent);
      formData.append(
        "deadLine",
        `${assessmentExtras.date}T${assessmentExtras.time}`
      );
      formData.append("maxMarks", assessmentExtras.marks);
      formData.append("fileMarks", assessmentExtras.fileMarks);
      formData.append("createdBy", currentAssessment?.createdBy?._id);
      formData.append("title", title);

      if (type === "quiz") {
        formData.append(
          "timeLimit",
          JSON.stringify({
            value: Number(timeLimit.value),
            unit: timeLimit.unit,
          })
        );
      }

      const assessmentId = currentAssessment._id;
      if (assessmentId) {
        setLoading(true);
        const editResult =
          type === "assignment"
            ? await editAssignment(formData, assessmentId)
            : await editQuiz(formData, assessmentId);
        setLoading(false);

        if (editResult.error) {
          setMessage({ type: "error", text: editResult.error });
        } else {
          const editedAssessment = editResult.data?.[type];
          resetAssessmentContent();
          handleOpenExistingAssessment(editedAssessment);
          assignmentFiles.resetFiles();
          setMessage({
            type: "success",
            text: "Assessment successfully edited",
          });
        }
      }
    }
    clearMessage();
  };

  const handleRemoveSubmission = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await deleteSubmission(openSubmission._id);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        resetAssessmentContent();
        setStudentAnswers({});
        handleOpenExistingAssessment(currentAssessment);
        setMessage({
          type: "success",
          text: result.data?.message || "Submission removed successfully",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setLoading(false);
      setTimeout(clearMessage, 3000);
    }
  };

  const handleStartQuiz = async () => {
    const quizStarted = await startQuiz({ quizId: currentAssessment._id });

    if (quizStarted.error) {
      setMessage({ type: "error", text: quizStarted.error });
    } else {
      setTrigger(!trigger);
      handleOpenExistingAssessment(quizStarted.data.quiz);
    }
    clearMessage();
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

              <h3>
                {capitalizeFirstLetter(type)} : {currentAssessment?.title}
              </h3>

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
                currentAssessment,
                canEdit,
                assignmentFiles,
                setMessage,
                clearMessage,
                setAssessmentExtras,
                title,
                setTitle,
              }}
            />
          </div>
        </div>
        <div className={styles.extras}>
          {/* show this only when creating a new assignment or opening an existing one, and when editing is set to true */}
          {canEdit ? (
            <AssessmentTools
              {...{
                setShowButton,
                setAssessmentExtras,
                handleEditAssessment,
                assessmentExtras,
                assignmentFiles,
                timeLimit,
                setTimeLimit,
                submissionType: currentAssessment?.submissionType,
                loading,
              }}
            />
          ) : (
            <SubmissionDetails {...{ currentAssessment }} />
          )}
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
                  {type === "assignment" && (
                    <div className={styles.divFlex}>
                      Deadline:{" "}
                      <p className={styles.cerulianText}>
                        {handleDueDate(currentAssessment.deadLine)}
                      </p>
                    </div>
                  )}
                  <div className={styles.divFlex}>
                    Score:{" "}
                    <p className={styles.cerulianText}>
                      {openSubmission.gradingStatus === "graded"
                        ? `${
                            openSubmission.marks + openSubmission.fileMarks
                          } / ${
                            currentAssessment.maxMarks +
                            currentAssessment.fileMarks
                          }`
                        : openSubmission.gradingStatus}
                    </p>
                  </div>
                  {openSubmission.feedBack && (
                    <div className={styles.divFlex}>
                      Tutor Feedback:{" "}
                      <p className={styles.lightCerulianText}>
                        {openSubmission.feedBack}
                      </p>
                    </div>
                  )}
                  {/* restrict reattempts to when deadline is in > 20 minutes */}
                  {type === "assignment" &&
                    timeLeft(currentAssessment.deadLine) > 20 &&
                    openSubmission?.gradingStatus !== "graded" && (
                      <button
                        className={styles.removeSubmission}
                        onClick={handleRemoveSubmission}
                        disabled={loading}
                      >
                        {loading ? "DELETING..." : "REMOVE SUBMISSION"}
                      </button>
                    )}
                </div>
              ) : (
                <>
                  {type === "quiz" && (
                    <QuizTimer
                      startedAt={openSubmission.startedAt}
                      timeLimit={currentAssessment.timeLimit}
                      onTimeIsUp={handleSubmitAssessment}
                      submissionStatus={openSubmission.submissionStatus}
                      {...{ quizSystemSubmitted, studentAnswers }}
                    />
                  )}
                  <StudentAssessmentContent
                    {...{
                      currentAssessment,
                      content,
                      studentAnswers,
                      setStudentAnswers,
                      submissionFiles,
                    }}
                  />
                </>
              )}
            </div>
            <div className={styles.extras}>
              <SubmissionTools
                {...{
                  handleSubmitAssessment,
                  currentAssessment,
                  openSubmission,
                  loading,
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
