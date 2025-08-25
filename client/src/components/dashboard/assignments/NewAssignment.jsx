import styles from "../css/Assignments.module.css";
import AssignmentTools from "./AssignmentTools";
import { useState } from "react";
import { createAssignment } from "../../../services/assignmentService";
import { useFileUploads } from "../../../utils/assignments";
import { TeacherAssignmentContent } from "./TeacherAssignmentContent";
import { FileSelector } from "./FileSelector";

export const NewAssignment = ({
  resetAssignmentContent,
  showButton,
  setShowButton,
  trigger,
  setTrigger,
  selectedUnit,
  handleOpenExistingAssignment,
  currentAssignment,
  handleCloseAssignment,
  message,
  setMessage,
  clearMessage,
}) => {
  const [content, setContent] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [submissionType, setSubmissionType] = useState("");
  const [assignmentExtras, setAssignmentExtras] = useState({
    marks: 0,
    date: "",
    time: "",
  });

  const assignmentFiles = useFileUploads();

  const isAnyAnswerMissing = () => {
    for (const item of content) {
      if (item.type === "question") {
        if (item.answers.length > 0) {
          if (
            item.answer == null ||
            item.answer === "" ||
            item.answer == undefined
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  //handles publishing assignment
  const handlePublishAssignment = async () => {
    if (!selectedUnit.id || selectedUnit.id === "all") {
      setMessage("No unit Selected");
    } else if (content.length === 0 && assignmentFiles.files.length === 0) {
      setMessage("No content or files exist for the assignment");
    } else if (assignmentTitle.length === 0 || submissionType.length === 0) {
      setMessage("Ensure both Assignment Title and Submission Type are set");
    } else {
      //check if all auto-grade answers are set

      if (isAnyAnswerMissing()) {
        setMessage("Some answers have not be set for auto-grading questions");
      } else {
        //setup deadlines for those not set
        let tempDate, tempTime;
        tempDate = assignmentExtras.date || `${new Date().getFullYear()}-12-31`;
        tempTime = assignmentExtras.time || "23:59";

        const formData = new FormData();

        assignmentFiles.files.forEach((file) => formData.append("files", file));
        formData.append("title", assignmentTitle);
        formData.append("submissionType", submissionType);
        formData.append("deadLine", `${tempDate}T${tempTime}`);
        formData.append("maxMarks", assignmentExtras.marks);
        formData.append("content", JSON.stringify(content));
        formData.append("unitId", selectedUnit.id);

        try {
          const creationResult = await createAssignment(formData);
          setMessage(creationResult.data.message);
          if (creationResult.status === 201) {
            const createdAssignment = creationResult.data.assignment;
            resetAssignmentContent();
            handleOpenExistingAssignment(createdAssignment);
          }
        } catch (error) {
          setMessage(error);
        }
      }
    }

    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  return (
    <>
      <div className={styles.assignmentsBox}>
        <div className={styles.assignmentsHeader}>
          <button
            className={styles.addAssignment}
            onClick={handleCloseAssignment}
          >
            <i className="fa-solid fa-left-long"></i>
            <p>Back</p>
          </button>
          <h3>Create New Assignment</h3>
        </div>
        <div className={styles.assignmentTop}>
          <input
            placeholder="Assignment title here..."
            className={styles.assignmentTitle}
            type="text"
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
          <select onChange={(e) => setSubmissionType(e.target.value)}>
            <option value={""}>Submitted as</option>
            <option value={"text"}>Text</option>
            <option value={"file"}>File</option>
            <option value={"mixed"}>Mixed</option>
          </select>
        </div>
        <div className={styles.newAssignmentContent}>
          <div className={`${styles.textContent}`}>
            <FileSelector selector={assignmentFiles} />
            {content.length === 0 && (
              <p>Use the tools on the right to add content</p>
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
                assignmentFiles,
                message,
                setMessage,
                clearMessage,
              }}
              canEdit={true}
            />
          </div>
        </div>
      </div>
      <div className={styles.extras}>
        <AssignmentTools
          {...{
            setShowButton,
            setAssignmentExtras,
            handlePublishAssignment,
            message,
            assignmentExtras,
            assignmentFiles,
          }}
          canEdit={true}
          handleEditAssignment={null}
        />
      </div>
    </>
  );
};
