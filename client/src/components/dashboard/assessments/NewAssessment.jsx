import { useEffect, useState } from "react";
import styles from "./Assessments.module.css";
import { createAssignment } from "../../../services/assignmentService.js";
import { createQuiz } from "../../../services/quizService.js";
import {
  correctAnswerNotSet,
  hasSingleAnswerOption,
  isAnyAnswerEmpty,
  useFileUploads,
  useUrlParams,
} from "../../../utils/assessmentUtils.js";
import TeacherAssessmentContent from "./TeacherAssessmentContent.jsx";
import AssessmentTools from "./AssessmentTools.jsx";
import FileSelector from "./FileSelector.jsx";

const NewAssessment = ({
  resetAssessmentContent,
  showButton,
  setShowButton,
  selectedUnit,
  handleOpenExistingAssessment,
  currentAssessment,
  handleCloseAssessment,
  setMessage,
  clearMessage,
  assessmentExtras,
  setAssessmentExtras,
  timeLimit,
  setTimeLimit,
  loading,
  setLoading,
}) => {
  const [content, setContent] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [submissionType, setSubmissionType] = useState("");
  const [fileMarks, setFileMarks] = useState(0);
  const { type } = useUrlParams();

  const assignmentFiles = useFileUploads();

  //give warning whenever file-type submission is enabled
  useEffect(() => {
    if (
      submissionType === "file" &&
      content.some((item) => ["textArea", "question"].includes(item.type))
    ) {
      setMessage({
        type: "error",
        text: "File type submissions cannot be accompanied by questions. Existing questions will be deleted upon publishing this Assessment ",
      });

      clearMessage();
    }
  }, [submissionType]);

  //keep tabs on file submission marks
  useEffect(() => {
    setAssessmentExtras((prev) => ({ ...prev, fileMarks: fileMarks }));
  }, [fileMarks]);

  //handles publishing assignment
  const handlePublishAssessment = async () => {
    //remove any questions present in file-type submissions
    const finalContent =
      submissionType === "file"
        ? content.filter(
            (item) => !["textArea", "question"].includes(item.type)
          )
        : [...content];

    if (!selectedUnit.id || selectedUnit.id === "all") {
      setMessage({ type: "error", text: "No unit Selected" });
    } else if (content.length === 0 && assignmentFiles.files.length === 0) {
      setMessage({
        type: "error",
        text: "No content or files exist for the assignment",
      });
    } else if (assignmentTitle.length === 0 || submissionType.length === 0) {
      setMessage({
        type: "error",
        text: `Ensure both ${type} Title and Submission Type are set`,
      });
    } else {
      //check if all auto-grade answers are set
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
        formData.append("fileMarks", assessmentExtras.fileMarks);
        formData.append("content", JSON.stringify(finalContent));
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

        setLoading(true);
        const creationResult =
          type === "quiz"
            ? await createQuiz(formData)
            : type === "assignment" && (await createAssignment(formData));
        setLoading(false);

        if (creationResult.error) {
          setMessage({ type: "error", text: creationResult.error });
        } else {
          const createdAssessment = creationResult.data?.[type];
          resetAssessmentContent();
          setSubmissionType("");
          setFileMarks(0);
          setContent([]);
          assignmentFiles.resetFiles();
          handleOpenExistingAssessment(createdAssessment);
          setMessage({
            type: "success",
            text: "Assessment created successfully",
          });
        }
      }
    }

    setTimeout(() => {
      setMessage({ type: "", text: "" });
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
            {["file", "mixed"].includes(submissionType.toLowerCase()) && (
              <div className={styles.fileMarks}>
                Assign marks for file submission:{" "}
                <input
                  type="number"
                  min={0}
                  value={fileMarks}
                  onChange={(e) => setFileMarks(e.target.value)}
                />
              </div>
            )}
            {content.length === 0 && (
              <p>Use the tools on the right to add content</p>
            )}
            <TeacherAssessmentContent
              {...{
                content,
                setContent,
                showButton,
                setShowButton,
                currentAssessment,
                assignmentFiles,
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
            assessmentExtras,
            assignmentFiles,
            timeLimit,
            setTimeLimit,
            submissionType,
            loading,
          }}
        />
      </div>
    </>
  );
};

export default NewAssessment;
