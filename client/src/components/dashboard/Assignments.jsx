import { useEffect, useState, useRef } from "react";
import styles from "./css/Assignments.module.css";
import {
  studentBar,
  teacherBar,
  parentBar,
} from "./css/SideBarStyles.module.css";
import { getUserDetails } from "../../services/userService";
import RoleRestricted from "../ui/RoleRestricted";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createAssignment,
  editAssignment,
} from "../../services/assignmentService";
import AssignmentContent from "./AssignmentContent";
import AssignmentTools from "./AssignmentTools";
import Modal from "../ui/Modals";
import CreateOptionsContent from "../dashboard/CreateOptionsContent";

const Assignments = ({
  showNav,
  user,
  selectedUnit,
  assignments,
  setAssignments,
  setUnits,
  canEdit,
  setCanEdit,
  persistSelectedUnit,
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
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  //keep tabs of url to see whether its new/open/all
  const location = useLocation();
  const paramsRef = useRef(null);
  const openAssignmentFromThisPageRef = useRef(null); //this should track open assignments from teacher/student page

  //useEffect for refreshing everything (assignments, units)
  //triggered with the state variable "trigger" during certain ops
  //also triggered when url changes (open, new, all)
  useEffect(() => {
    paramsRef.current = new URLSearchParams(location.search);

    const fetchData = async () => {
      const myData = await getUserDetails(user.role, user.id);
      setLoading(false);

      if (myData.data.message) {
        const tempAssignments = myData.data.data.assignments;
        setAssignments(tempAssignments);
        setAllAssignments(tempAssignments);
        setUnits(myData.data.data.units);

        //when the assignment is opened from teacher/student
        if (
          paramsRef.current.get("open") &&
          !openAssignmentFromThisPageRef.current
        ) {
          const toBeOpenedId = paramsRef.current.get("open");
          const toBeOpenedData = tempAssignments.find(
            (assignment) => assignment._id === toBeOpenedId
          );
          if (toBeOpenedData) handleOpenExistingAssignment(toBeOpenedData);
          else navigate("/dashboard/assignments");
        }
      }
    };
    fetchData();
    persistSelectedUnit();
  }, [trigger, location.search]);

  //useEffect for displaying assignments only tied to the currently selected unit
  useEffect(() => {
    const handleFilterUnit = () => {
      const unitId = selectedUnit.id;
      if (unitId === "all") {
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

  const resetAssignmentContent = () => {
    setContent([]);
    setSelectedFiles([]);
    setAssignmentExtras({
      date: "",
      time: "",
      marks: 0,
    });
    setTrigger((prev) => !prev);
  };

  // Modal handlers
  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateNewQuiz = () => {
    navigate("/dashboard/quizzes?new=true", {
      replace: true,
    });
  };
  const handleCreateAssignmentFromModal = () => {
    handleCreateNewAssignment();
  };

  //create new assignment
  const handleCreateNewAssignment = () => {
    resetAssignmentContent();
    setCanEdit(true);
    navigate("/dashboard/assignments?new=true", {
      replace: true,
    });
  };

  //open existing assignment
  const handleOpenExistingAssignment = (assignment) => {
    openAssignmentFromThisPageRef.current = true;
    setAssignmentExtras({
      ...assignmentExtras,
      date: assignment.deadLine.slice(0, 10),
      time: assignment.deadLine.slice(11),
      marks: assignment.maxMarks,
    });
    setCurrentAssignment(assignment);

    //assign numbers to questions before displaying
    const tempAssignmentContent = JSON.parse(assignment.content);
    let questionNumber = 1;

    const assignedNumbers = tempAssignmentContent.map((assignment) => {
      if (assignment[1] === "question") {
        return [...assignment, questionNumber++];
      }
      return assignment;
    });
    setContent(assignedNumbers);
    setCanEdit(false);
    setOpenAssignment(true);
    navigate(`/dashboard/assignments?open=${assignment._id}`);
  };

  const handleDueDate = (dateTime) => {
    const dateTimeString = `${dateTime}:00`;
    const fullDateTimeString = new Date(dateTimeString);
    const milliSeconds = fullDateTimeString.getTime();

    const today = Date.now();
    const diff = milliSeconds - today;
    if (diff < 0) return "Overdue";
    const minutes = diff / (1000 * 60);
    if (minutes < 60) return `due in ${Math.floor(minutes)} minutes `;
    const hours = minutes / 60;
    if (hours < 24) return `due in ${Math.floor(hours)} hours `;
    const days = hours / 24;
    if (days < 7) return `due in ${Math.floor(days)} days`;
    const weeks = days / 7;
    if (weeks < 4) return `due in ${Math.floor(weeks)} weeks`;
    const months = weeks / 4;
    if (months < 12) return `due in ${Math.floor(months)} months`;
    const years = months / 12;
    return `due in ${Math.floor(years)} years`;
  };

  //handles publishing assignment
  const handlePublishAssignment = async () => {
    if (!selectedUnit.id || selectedUnit.id === "all") {
      setMessage("No unit Selected");
    } else if (content.length === 0 && selectedFiles.length === 0) {
      setMessage("No content or files exist for the assignment");
    } else if (assignmentTitle.length === 0 || submissionType.length === 0) {
      setMessage("Ensure both Assignment Title and Submission Type are set");
    } else {
      //setup deadlines for those not set
      let tempDate, tempTime;
      tempDate = assignmentExtras.date || `${new Date().getFullYear()}-12-31`;
      tempTime = assignmentExtras.time || "23:59";

      const formData = new FormData();

      selectedFiles.forEach((file) => formData.append("files", file));
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

    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const cleanAssignmentContent = (content) => {
    //remove question numbers before submitting
    const tempContent = content.map((item) => {
      if (item[1] === "question") {
        const newItem = [...item];
        newItem.splice(3);
        return newItem;
      }
      return item;
    });

    return tempContent;
  };

  const handleEditAssignment = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => formData.append("files", file));
    const newContent = JSON.stringify(cleanAssignmentContent(content));
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className={`${styles.container} ${showNav ? "" : styles.marginCollapsed}`}
    >
      {paramsRef.current.get("new") ? ( //for teachers to create assignments
        <RoleRestricted allowedRoles={["teacher"]}>
          <div className={styles.assignmentsBox}>
            <div className={styles.assignmentsHeader}>
              <button
                className={styles.addAssignment}
                onClick={() => {
                  navigate("/dashboard/assignments");
                  resetAssignmentContent();
                }}
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
              </select>
            </div>
            <div
              className={styles.newAssignmentContent}
              ref={assignmentContentRef}
            >
              <div className={`${styles.textContent}`}>
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
                  {selectedFiles.length > 0 && <p>Selected Files: </p>}
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
                  canEdit={true}
                />
              </div>
            </div>
          </div>
        </RoleRestricted>
      ) : openAssignment === true ? (
        //handle opening an assignment
        <div
          className={`${styles.assignmentsBox} ${styles.assignmentsBoxOpened}`}
        >
          <div className={styles.assignmentsHeader}>
            <button
              className={styles.addAssignment}
              onClick={() => {
                setOpenAssignment(false);
                resetAssignmentContent();
                navigate("/dashboard/assignments");
              }}
            >
              <i className="fa-solid fa-left-long"></i>
              <p>Back</p>
            </button>
          </div>
          <div className={styles.textContent}>
            <h3>Assignment: {currentAssignment.title}</h3>

            <RoleRestricted allowedRoles={["teacher"]}>
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

              {/* Editing files section */}
              <input
                type="file"
                multiple
                className={styles.fileHidden}
                ref={assignmentFilesRef}
                onChange={handleFileChange}
              />
              <div className={styles.selectedFiles}>
                {selectedFiles.length > 0 && <p>New Files: </p>}
                {selectedFiles.map((file, index) => {
                  return (
                    <p
                      className={`${styles.chosenFile} ${styles.newFile}`}
                      key={index}
                    >
                      {file.name}
                    </p>
                  );
                })}
              </div>
              {currentAssignment?.files?.length > 0 && (
                <div className={styles.selectedFiles}>
                  <p>{selectedFiles.length > 0 && "Old"} files: </p>
                  {currentAssignment.files.map((file, index) => {
                    return (
                      <div
                        className={`${styles.chosenFile} ${
                          selectedFiles.length > 0 && styles.oldFile
                        }`}
                        key={index}
                      >
                        {file.fileName}
                        <i className="fa-solid fa-download"></i>
                      </div>
                    );
                  })}
                </div>
              )}
            </RoleRestricted>

            <AssignmentContent
              {...{
                content,
                setContent,
                showButton,
                setShowButton,
                trigger,
                setTrigger,
                canEdit,
                setCanEdit,
              }}
              role={user.role}
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
                onClick={handleOpenCreateModal}
              >
                <i className="fa-solid fa-plus"></i>
                <p>Create New</p>
              </button>
            </RoleRestricted>
          </div>
          <div className={styles.assignmentsBody}>
            {assignments
              .filter((assignment) => {
                if (selectedUnit.id === "all") {
                  return assignment;
                }
                return assignment.unit._id === selectedUnit.id;
              })
              .map((assignment) => {
                return (
                  <button
                    key={assignment._id}
                    className={`${styles.assignment} ${
                      user.role === "student"
                        ? studentBar
                        : user.role === "teacher"
                        ? teacherBar
                        : user.role === "parent" && parentBar
                    } ${
                      user.role === "student"
                        ? styles.studentAssignment
                        : user.role === "teacher"
                        ? styles.teacherAssignment
                        : ""
                    }`}
                    onClick={() => handleOpenExistingAssignment(assignment)}
                  >
                    <p>{assignment.title}</p>
                    <p>{assignment.status}</p>
                    <p>{handleDueDate(assignment.deadLine)}</p>
                  </button>
                );
              })}
            {assignments.length === 0 && (
              <p>You have no assignments for this selection</p>
            )}
          </div>
        </div>
      )}

      {/* Modal for create options */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <CreateOptionsContent
          onClose={handleCloseModal}
          onCreateQuiz={handleCreateNewQuiz}
          onCreateAssignment={handleCreateAssignmentFromModal}
        />
      </Modal>

      {(openAssignment || paramsRef.current.get("new")) && (
        <div className={styles.extras}>
          <RoleRestricted allowedRoles={["teacher"]}>
            <AssignmentTools
              {...{
                openAssignment,
                canEdit,
                setShowButton,
                handleChooseFiles,
                setAssignmentExtras,
                handlePublishAssignment,
                message,
                assignmentExtras,
                handleEditAssignment,
              }}
              params={paramsRef.current}
            />
          </RoleRestricted>
          <RoleRestricted allowedRoles={["student"]}>
            {currentAssignment && (
              <div className={styles.studentTools}>
                <div className={styles.studentFiles}>
                  <h5>Files</h5>
                  {currentAssignment.files.map((file, index) => {
                    return (
                      <div
                        className={`${styles.chosenFile} ${
                          selectedFiles.length > 0 && styles.oldFile
                        }`}
                        key={index}
                      >
                        {file.fileName}
                        <i className="fa-solid fa-download"></i>
                      </div>
                    );
                  })}
                </div>
                <p className={styles.normalText}>
                  Unit: {currentAssignment.unit.unitName}
                </p>
                <p className={styles.normalText}>
                  Deadline: {currentAssignment.deadLine.slice(0, 10)} at{" "}
                  {currentAssignment.deadLine.slice(11)}
                </p>
                <p className={styles.normalText}>
                  Max Mark: {currentAssignment.maxMarks}
                </p>
                <button
                  className={`${styles.studentSubmit} ${
                    user.role === "student"
                      ? studentBar
                      : user.role === "teacher"
                      ? teacherBar
                      : user.role === "parent" && parentBar
                  }`}
                >
                  Submit Assignment
                </button>
              </div>
            )}
          </RoleRestricted>
        </div>
      )}
    </div>
  );
};

export default Assignments;
