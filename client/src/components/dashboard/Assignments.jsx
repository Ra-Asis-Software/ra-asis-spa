import { useEffect, useState, useRef } from "react";
import styles from "./css/Assignments.module.css";
import { getUserDetails } from "../../services/userService";
import RoleRestricted from "../ui/RoleRestricted";
import { useLocation, useNavigate } from "react-router-dom";
import { submitAssignment } from "../../services/assignmentServices";
import AssignmentContent from "./AssignmentContent";

const Assignments = ({
  showNav,
  user,
  selectedUnit,
  assignments,
  setAssignments,
  setUnits,
}) => {
  const [allAssignments, setAllAssignments] = useState([]);
  const [openAssignment, setOpenAssignment] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [content, setContent] = useState([]); //array for holding all assignment content

  const [showButton, setShowButton] = useState({
    instruction: false,
    question: false,
    answer: false,
    textArea: false,
    title: false,
  });
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [submissionType, setSubmissionType] = useState("");
  const [trigger, setTrigger] = useState(false);
  const assignmentContentRef = useRef(null);
  const assignmentFilesRef = useRef(null);
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [assignmentExtras, setAssignmentExtras] = useState({
    marks: 0,
    date: "",
    time: "",
  });
  const [message, setMessage] = useState("");

  //check if a new assignment is being created
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchData = async () => {
      const myData = await getUserDetails(user.role, user.id);

      if (myData.data.message) {
        setAssignments(myData.data.data.assignments);
        setAllAssignments(myData.data.data.assignments);
        setUnits(myData.data.data.units);
      }
    };
    fetchData();
  }, [trigger]);

  useEffect(() => {
    const handleFilterUnit = () => {
      const unitId = selectedUnit.id;
      if (unitId === "") {
        setAssignments(allAssignments);
      } else {
        setAssignments(() => {
          return allAssignments.filter(
            (assignment) => assignment.unit._id === unitId
          );
        });
      }
    };
    handleFilterUnit();
  }, [selectedUnit]);

  //handles choosing files
  const handleChooseFiles = () => {
    assignmentFilesRef.current.click();
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  //handles publishing assignment
  const handlePublishAssignment = async () => {
    if (!selectedUnit.id) {
      setMessage("No unit Selected");
    } else if (content.length === 0 && selectedFiles.length === 0) {
      setMessage("No content or files exist for the assignment");
    } else if (assignmentTitle.length === 0 || submissionType.length === 0) {
      setMessage("Ensure both Assignment Title and Submission Type are set");
    } else {
      const formData = new FormData();

      selectedFiles.forEach((file) => formData.append("files", file));
      formData.append("title", assignmentTitle);
      formData.append("submissionType", submissionType);
      formData.append(
        "deadLine",
        `${assignmentExtras.date}T${assignmentExtras.time}`
      );
      formData.append("maxMarks", assignmentExtras.marks);
      formData.append("content", JSON.stringify(content));
      formData.append("unitId", selectedUnit.id);

      try {
        const submissionResult = await submitAssignment(formData);
        setMessage(submissionResult.message);
        if (submissionResult.status === 201) {
          setTrigger((prev) => !prev);
          setContent([]);
          setSelectedFiles([]);
          navigate("/dashboard/assignments", { replace: true });
        }
      } catch (error) {
        setMessage(error);
      }
    }

    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  console.log(currentAssignment);

  return (
    <div className={`${styles.hero} ${showNav ? "" : styles.marginCollapsed}`}>
      {params.get("new") ? ( //for teachers to create assignments
        <RoleRestricted allowedRoles={["teacher"]}>
          <div className={styles.assignmentsBox}>
            <div className={styles.assignmentsHeader}>
              <button
                className={styles.addAssignment}
                onClick={() => {
                  navigate("/dashboard/assignments");
                }}
              >
                <i className="fa-solid fa-left-long"></i>
                <p>Back</p>
              </button>
              <h3>Create New Assignment</h3>
            </div>
            <div className={styles.assignmentTop}>
              <input
                placeholder="Assignment Title Here..."
                className={styles.assignmentTitle}
                type="text"
                onChange={(e) => setAssignmentTitle(e.target.value)}
              />
              <select onChange={(e) => setSubmissionType(e.target.value)}>
                <option value={""}>Submitted as</option>
                <option value={"text"}>Text</option>
                <option value={"file"}>File</option>
              </select>
            </div>
            <div
              className={styles.newAssignmentContent}
              ref={assignmentContentRef}
            >
              <div className={styles.textContent}>
                {/* Add an input for taking in files */}
                <input
                  type="file"
                  multiple
                  className={styles.fileHidden}
                  ref={assignmentFilesRef}
                  onChange={handleFileChange}
                />

                {/* display selected files */}
                <div className={styles.selectedFiles}>
                  {selectedFiles.length > 0 && <p>Selected files: </p>}
                  {selectedFiles.map((file, index) => {
                    return (
                      <p className={styles.chosenFile} key={index}>
                        {file.name}
                      </p>
                    );
                  })}
                </div>
                {content.length === 0 && (
                  <p>Use the tools on the right to add content</p>
                )}
                <AssignmentContent
                  {...{
                    content,
                    setContent,
                    showButton,
                    setShowButton,
                    trigger,
                    setTrigger,
                  }}
                />
              </div>
            </div>
          </div>
        </RoleRestricted>
      ) : openAssignment === true ? (
        <div className={styles.assignmentsBox}>
          <div className={styles.assignmentsHeader}>
            <button
              className={styles.addAssignment}
              onClick={() => {
                setOpenAssignment(false);
              }}
            >
              <i className="fa-solid fa-left-long"></i>
              <p>Back</p>
            </button>
          </div>
          <div className={styles.textContent}>
            <h3>Assignment: {currentAssignment.title}</h3>
            <h4>Unit: {currentAssignment.unit.unitName}</h4>
            <AssignmentContent
              {...{
                content,
                setContent,
                showButton,
                setShowButton,
                trigger,
                setTrigger,
              }}
            />
          </div>
        </div>
      ) : (
        <div className={`${styles.assignmentsBox}`}>
          <h3>Assignments</h3>
          <div className={styles.assignmentsHeader}>
            <h3>{selectedUnit.name || "All assignments"}</h3>

            <RoleRestricted allowedRoles={["teacher"]}>
              <button
                className={styles.addAssignment}
                onClick={() =>
                  navigate("/dashboard/assignments?new=true", { replace: true })
                }
              >
                <i className="fa-solid fa-plus"></i>
                <p>Create New</p>
              </button>
            </RoleRestricted>
          </div>
          <div className={styles.assignmentsBody}>
            {assignments
              .filter((assignment) => assignment.unit._id === selectedUnit.id)
              .map((assignment) => {
                return (
                  <button
                    key={assignment._id}
                    className={styles.assignment}
                    onClick={() => {
                      setOpenAssignment(true);
                      setCurrentAssignment(assignment);
                      setContent(JSON.parse(assignment.content));
                    }}
                  >
                    <p>{assignment.title}</p>
                    <p>{assignment.status}</p>
                    <p>Due in 2 days</p>
                  </button>
                );
              })}
            {assignments.length === 0 && (
              <p>You have no assignments for the unit</p>
            )}
          </div>
        </div>
      )}
      <div className={styles.extras}>
        <RoleRestricted allowedRoles={["teacher"]}>
          {(params.get("new") || openAssignment) && (
            <div className={styles.tools}>
              <div className={styles.toolsArea}>
                <h3>Tools</h3>

                <button
                  className={styles.addAssignment}
                  onClick={() =>
                    setShowButton((prev) => ({ ...prev, instruction: true }))
                  }
                >
                  Instruction
                </button>

                <button
                  className={styles.addAssignment}
                  onClick={() =>
                    setShowButton((prev) => ({ ...prev, question: true }))
                  }
                >
                  Question
                </button>

                <button
                  className={styles.addAssignment}
                  onClick={() =>
                    setShowButton((prev) => ({ ...prev, textArea: true }))
                  }
                >
                  Text Area
                </button>

                <button
                  className={styles.addAssignment}
                  onClick={() => {
                    setShowButton((prev) => ({ ...prev, title: true }));
                  }}
                >
                  Title
                </button>

                <button
                  className={styles.addAssignment}
                  onClick={handleChooseFiles}
                >
                  File
                </button>
                {message.length > 0 && (
                  <p className={styles.submissionAlert}>{message}</p>
                )}
              </div>
              <div className={styles.extraTools}>
                <div className={styles.deadline}>
                  <p>Deadline</p>
                  <input
                    type="date"
                    onChange={(e) =>
                      setAssignmentExtras((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="time"
                    onChange={(e) =>
                      setAssignmentExtras((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.deadline}>
                  <p>Max marks</p>
                  <input
                    type="number"
                    max={100}
                    onChange={(e) =>
                      setAssignmentExtras((prev) => ({
                        ...prev,
                        marks: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <button
                className={styles.submitAssignment}
                onClick={handlePublishAssignment}
              >
                PUBLISH ASSIGNMENT
              </button>
            </div>
          )}
        </RoleRestricted>
      </div>
    </div>
  );
};

export default Assignments;
