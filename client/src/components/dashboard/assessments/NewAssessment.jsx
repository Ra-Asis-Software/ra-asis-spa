import styles from "../css/Assessments.module.css";
import AssessmentTools from "./AssessmentTools";
import { useState } from "react";
import { createAssignment } from "../../../services/assignmentService";
import {
  correctAnswerNotSet,
  hasSingleAnswerOption,
  isAnyAnswerEmpty,
  useFileUploads,
  useUrlParams,
} from "../../../utils/assessments";
import { TeacherAssessmentContent } from "./TeacherAssessmentContent";
import { FileSelector } from "./FileSelector";
import { createQuiz } from "../../../services/quizService";

export const NewAssessment = ({
  resetAssessmentContent,
  showButton,
  setShowButton,
  trigger,
  setTrigger,
  selectedUnit,
  handleOpenExistingAssessment,
  currentAssessment,
  handleCloseAssessment,
  message,
  setMessage,
  clearMessage,
  assessmentExtras,
  setAssessmentExtras,
  timeLimit,
  setTimeLimit,
}) => {
  const [content, setContent] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [submissionType, setSubmissionType] = useState("");
  const { type } = useUrlParams();

  const assignmentFiles = useFileUploads();

  //handles publishing assignment
  const handlePublishAssessment = async () => {
    if (!selectedUnit.id || selectedUnit.id === "all") {
      setMessage("No unit Selected");
    } else if (content.length === 0 && assignmentFiles.files.length === 0) {
      setMessage("No content or files exist for the assignment");
    } else if (assignmentTitle.length === 0 || submissionType.length === 0) {
      setMessage(`Ensure both ${type} Title and Submission Type are set`);
    } else {
      //check if all auto-grade answers are set
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
        //setup deadlines for those not set
        let tempDate, tempTime;
        tempDate = assessmentExtras.date || `${new Date().getFullYear()}-12-31`;
        tempTime = assessmentExtras.time || "23:59";

        const formData = new FormData();

        assignmentFiles.files.forEach((file) => formData.append("files", file));
        formData.append("title", assignmentTitle);
        formData.append("submissionType", submissionType);
        formData.append("deadLine", `${tempDate}T${tempTime}`);
        formData.append("maxMarks", assessmentExtras.marks);
        formData.append("content", JSON.stringify(content));
        formData.append("unitId", selectedUnit.id);
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
          const creationResult =
            type === "quiz"
              ? await createQuiz(formData)
              : type === "assignment" && (await createAssignment(formData));

          if (creationResult.error) {
            setMessage(creationResult.error);
          } else {
            const createdAssessment = creationResult.data?.[type];
            resetAssessmentContent();
            handleOpenExistingAssessment(createdAssessment);
          }

          assignmentFiles.resetFiles();
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
            onClick={handleCloseAssessment}
          >
            <i className="fa-solid fa-left-long"></i>
            <p>Back</p>
          </button>
          <h3>New {type}</h3>
        </div>
        <div className={styles.assignmentTop}>
          <input
            placeholder={`${type} title here...`}
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
            <TeacherAssessmentContent
              {...{
                content,
                setContent,
                showButton,
                setShowButton,
                trigger,
                setTrigger,
                currentAssessment,
                assignmentFiles,
                message,
                setMessage,
                clearMessage,
                setAssessmentExtras,
              }}
              canEdit={true}
            />
          </div>
        </div>
      </div>
      <div className={styles.extras}>
        <AssessmentTools
          {...{
            setShowButton,
            setAssessmentExtras,
            handlePublishAssessment,
            message,
            assessmentExtras,
            assignmentFiles,
            timeLimit,
            setTimeLimit,
          }}
        />
      </div>
    </>
  );
};
