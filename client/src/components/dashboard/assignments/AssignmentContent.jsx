import RoleRestricted from "../../ui/RoleRestricted";
import { TeacherAssignmentContent } from "./TeacherAssignmentContent";
import { StudentAssignmentContent } from "./StudentAssignmentContent";
import styles from "../css/Assignments.module.css";
import {
  correctAnswerNotSet,
  handleDueDate,
  hasSingleAnswerOption,
  isAnyAnswerEmpty,
  timeLeft,
  useFileUploads,
  useUrlParams,
} from "../../../utils/assignments";
import { useState } from "react";
import {
  submitAssignment,
  editAssignment,
  deleteSubmission,
} from "../../../services/assignmentService";
import AssignmentTools from "./AssignmentTools";
import { SubmissionTools } from "./SubmissionTools";

const AssignmentContent = ({
  content,
  setContent,
  showButton,
  setShowButton,
  trigger,
  setTrigger,
  openSubmission,
  resetAssignmentContent,
  currentAssignment,
  assignmentExtras,
  setAssignmentExtras,
  handleOpenExistingAssignment,
  canEdit,
  setCanEdit,
  handleCloseAssignment,
  message,
  setMessage,
  clearMessage,
}) => {
  const [studentAnswers, setStudentAnswers] = useState({});
  const { isOpened } = useUrlParams();

  const assignmentFiles = useFileUploads();
  const submissionFiles = useFileUploads();

  const checkEmptyAnswerFields = (studentAnswers, content) => {
    for (const item of content) {
      if (item.type === "question" || item.type === "textArea") {
        const answer = studentAnswers[item.id];

        // multiple choice
        if (item?.answers?.length > 0) {
          if (!answer || !item.answers.includes(answer)) {
            return item.data; // return first unanswered multiple-choice
          }
        } else {
          // open-ended question or textArea
          if (!answer || answer.trim() === "") {
            return item.data; // return first unanswered open-ended
          }
        }
      }
    }

    return null;
  };

  const handleSubmitAssignment = async () => {
    if (checkEmptyAnswerFields(studentAnswers, content)) {
      setMessage("Some questions have not been answered");
      clearMessage();
    } else {
      const formData = new FormData();

      submissionFiles.files.forEach((file) => formData.append("files", file));
      const answerSheet = JSON.stringify(studentAnswers);
      formData.append("content", answerSheet);
      formData.append("time", Date.now());

      const submissionResults = await submitAssignment(
        formData,
        currentAssignment._id
      );

      if (submissionResults.error) {
        //
      } else {
        window.location.reload();
      }
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
        `${assignmentExtras.date}T${assignmentExtras.time}`
      );
      formData.append("maxMarks", assignmentExtras.marks);
      formData.append("createdBy", currentAssignment?.createdBy?._id);

      try {
        const assignmentId = currentAssignment._id;
        if (assignmentId) {
          const editResult = await editAssignment(formData, assignmentId);
          setMessage(editResult.data.message);
          if (editResult.status === 200) {
            const editedAssignment = editResult.data.assignment;
            resetAssignmentContent();
            handleOpenExistingAssignment(editedAssignment);
          }
        }
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
                onClick={handleCloseAssignment}
              >
                <i className="fa-solid fa-left-long"></i>
                <p>Back</p>
              </button>

              <h3>Assignment: {currentAssignment.title}</h3>

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
            <TeacherAssignmentContent
              {...{
                content,
                setContent,
                showButton,
                setShowButton,
                trigger,
                setTrigger,
                currentAssignment,
                canEdit,
                assignmentFiles,
                setMessage,
                clearMessage,
              }}
            />
          </div>
        </div>
        <div className={styles.extras}>
          <AssignmentTools
            {...{
              canEdit,
              setShowButton,
              setAssignmentExtras,
              handleEditAssignment,
              message,
              assignmentExtras,
              assignmentFiles,
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
              onClick={handleCloseAssignment}
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
                  {handleDueDate(currentAssignment.deadLine)}
                </p>
              </div>
              <div className={styles.divFlex}>
                Grade: <p className={styles.cerulianText}>Not yet graded</p>
              </div>
              {/* restrict reattempts to when deadline is in > 20 minutes */}
              {timeLeft(currentAssignment.deadLine) > 20 && (
                <button
                  className={styles.removeSubmission}
                  onClick={handleRemoveSubmission}
                >
                  REMOVE SUBMISSION
                </button>
              )}
            </div>
          ) : (
            <StudentAssignmentContent
              {...{
                currentAssignment,
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
              currentAssignment,
              openSubmission,
              message,
            }}
          />
        </div>
      </RoleRestricted>
    </>
  );
};

export default AssignmentContent;
