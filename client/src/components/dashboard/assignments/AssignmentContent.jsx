import RoleRestricted from "../../ui/RoleRestricted";
import { TeacherAssignmentContent } from "./TeacherAssignmentContent";
import { StudentAssignmentContent } from "./StudentAssignmentContent";
import styles from "../css/Assignments.module.css";
import { useNavigate } from "react-router-dom";
import { useFileUploads, useUrlParams } from "../../../utils/assignments";
import { useState } from "react";
import {
  submitAssignment,
  editAssignment,
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
}) => {
  const [studentAnswers, setStudentAnswers] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { isOpened } = useUrlParams();

  const assignmentFiles = useFileUploads();
  const submissionFiles = useFileUploads();

  const handleSubmitAssignment = async () => {
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
      navigate("/dashboard/assignments");
      window.location.reload();
    }
  };

  const handleEditAssignment = async () => {
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
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.log(error);
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
                onClick={() => {
                  resetAssignmentContent();
                  navigate("/dashboard/assignments");
                }}
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
            }}
          />
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
        <div className={styles.assignmentsBox}>
          <div className={styles.assignmentsHeader}>
            <button
              className={styles.addAssignment}
              onClick={() => {
                resetAssignmentContent();
                navigate("/dashboard/assignments");
              }}
            >
              <i className="fa-solid fa-left-long"></i>
              <p>Back</p>
            </button>
          </div>
          {openSubmission ? (
            <div className={styles.submittedBox}>
              <h3>You already submitted this Assignment</h3>
              <h4 className={styles.divFlex}>
                Grade: <p className={styles.cerulianText}>still in progress</p>
              </h4>
              <button className={styles.removeSubmission}>
                REMOVE SUBMISSION
              </button>
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
            {...{ handleSubmitAssignment, currentAssignment, openSubmission }}
          />
        </div>
      </RoleRestricted>
    </>
  );
};

export default AssignmentContent;
