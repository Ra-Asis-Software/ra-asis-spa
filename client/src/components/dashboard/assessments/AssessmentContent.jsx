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
  const { isOpened } = useUrlParams();

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

  const handleSubmitAssignment = async () => {
    const lacksAnswer = checkEmptyAnswerFields(studentAnswers, content);
    if (lacksAnswer) {
      setMessage(`Question ${lacksAnswer} has not been answered`);
      clearMessage();
    } else {
      const formData = new FormData();

      submissionFiles.files.forEach((file) => formData.append("files", file));
      const answerSheet = JSON.stringify(studentAnswers);
      formData.append("content", answerSheet);
      formData.append("time", Date.now());

      const submissionResults = await submitAssignment(
        formData,
        currentAssessment._id
      );

      if (submissionResults.error) {
        //
      } else {
        window.location.reload();
      }
      submissionFiles.resetFiles();
    }
  };

  const handleEditAssignment = async () => {
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

      try {
        const assignmentId = currentAssessment._id;
        if (assignmentId) {
          const editResult = await editAssignment(formData, assignmentId);
          setMessage(editResult.data.message);
          if (editResult.status === 200) {
            const editedAssignment = editResult.data.assignment;
            resetAssessmentContent();
            handleOpenExistingAssessment(editedAssignment);
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
              handleEditAssignment,
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
          {openSubmission ? (
            <div className={styles.submittedBox}>
              <h3>
                Assignment submitted{" "}
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
              {timeLeft(currentAssessment.deadLine) > 20 && (
                <button
                  className={styles.removeSubmission}
                  onClick={handleRemoveSubmission}
                >
                  REMOVE SUBMISSION
                </button>
              )}
            </div>
          ) : (
            <StudentAssessmentContent
              {...{
                currentAssessment,
                content,
                studentAnswers,
                setStudentAnswers,
                submissionFiles,
              }}
            />
          )}
        </div>
        <div className={styles.extras}>
          <SubmissionTools
            {...{
              handleSubmitAssignment,
              currentAssessment,
              openSubmission,
              message,
            }}
          />
        </div>
      </RoleRestricted>
    </>
  );
};

export default AssessmentContent;
