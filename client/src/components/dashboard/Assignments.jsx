import { useEffect, useState, useRef } from "react";
import styles from "./css/Assignments.module.css";
import { getUserDetails } from "../../services/userService";
import RoleRestricted from "../ui/RoleRestricted";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createAssignment,
  editAssignment,
  getAssignmentDetails,
} from "../../services/assignmentService";
import AssignmentContent from "./AssignmentContent";
import AssignmentTools from "./AssignmentTools";

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

  //keep tabs of url to see whether its new/open/all
  const location = useLocation();
  const paramsRef = useRef(null);

  //useEffect for refreshing everything (assignments, units)
  //triggered with the state variable "trigger" during certains ops
  //also triggered when url changes (open, new, all)
  useEffect(() => {
    paramsRef.current = new URLSearchParams(location.search);

    const fetchData = async () => {
      const myData = await getUserDetails(user.role, user.id);
      setLoading(false);

      if (myData.data.message) {
        setAssignments(myData.data.data.assignments);
        setAllAssignments(myData.data.data.assignments);
        setUnits(myData.data.data.units);
      }
    };
    fetchData();
    persistSelectedUnit();
  }, [trigger, location.search]);

  //useEffect for fetching assignment data only when the url changes to "open"
  useEffect(() => {
    const assignmentDetails = async () => {
      if (paramsRef.current.get("open")) {
        const detailsRetrieved = await getAssignmentDetails(
          paramsRef.current.get("open")
        );

        if (detailsRetrieved.status === 200) {
          const tempAssignment = detailsRetrieved.data;

          setAssignmentExtras({
            ...assignmentExtras,
            date: tempAssignment.deadLine.slice(0, 10),
            time: tempAssignment.deadLine.slice(11),
            marks: tempAssignment.maxMarks,
          });
          setCurrentAssignment(tempAssignment);
          setContent(JSON.parse(tempAssignment.content));
          setCanEdit(false);
          setOpenAssignment(true);
        }
      }
    };
    assignmentDetails();
  }, [location.search]);

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
    navigate(`/dashboard/assignments?open=${assignment._id}`);
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
        const creationResult = await createAssignment(formData);
        setMessage(creationResult.data.message);
        if (creationResult.status === 201) {
          const createdAssignment = creationResult.data.assignment;
          resetAssignmentContent();
          navigate(`/dashboard/assignments?open=${createdAssignment._id}`);
        }
      } catch (error) {
        setMessage(error);
      }
    }

    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const handleEditAssignment = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("content", JSON.stringify(content));
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
          setCanEdit(false);
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
    <div className={`${styles.hero} ${showNav ? "" : styles.marginCollapsed}`}>
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
                  canEdit={true}
                />
              </div>
            </div>
          </div>
        </RoleRestricted>
      ) : openAssignment === true ? (
        //handle opening an assignment
        <div className={styles.assignmentsBox}>
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
            <h4>Unit: {currentAssignment.unit.unitName}</h4>
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
              {currentAssignment?.files?.length > 0 && (
                <div className={styles.selectedFiles}>
                  <p>{selectedFiles.length > 0 && "Old"} files: </p>
                  {currentAssignment.files.map((file, index) => {
                    return (
                      <p
                        className={`${styles.chosenFile} ${
                          selectedFiles.length > 0 && styles.oldFile
                        }`}
                        key={index}
                      >
                        {file.fileName}
                      </p>
                    );
                  })}
                </div>
              )}
              <div className={styles.selectedFiles}>
                {selectedFiles.length > 0 && <p>New files: </p>}
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
                onClick={handleCreateNewAssignment}
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
                    className={styles.assignment}
                    onClick={() => handleOpenExistingAssignment(assignment)}
                  >
                    <p>{assignment.title}</p>
                    <p>{assignment.status}</p>
                    <p>Due in 2 days</p>
                  </button>
                );
              })}
            {assignments.length === 0 && (
              <p>You have no assignments for this selection</p>
            )}
          </div>
        </div>
      )}
      {(paramsRef.current.get("new") === "true" || openAssignment) && (
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
        </div>
      )}
    </div>
  );
};

export default Assignments;
