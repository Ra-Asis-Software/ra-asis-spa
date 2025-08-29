import { useEffect, useState, useRef } from "react";
import styles from "../css/Assignments.module.css";
import {
  studentBar,
  teacherBar,
  parentBar,
} from "../css/SideBarStyles.module.css";
import { getUserDetails } from "../../../services/userService";
import RoleRestricted from "../../ui/RoleRestricted";
import { useNavigate } from "react-router-dom";
import AssignmentContent from "./AssignmentContent";
import { handleDueDate, useUrlParams } from "../../../utils/assignments";
import { NewAssessment } from "./NewAssessment";
import Modal from "../../ui/Modal";
import CreateOptionsContent from "../CreateOptionsContent";

const Assessments = ({
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
  const submissions = useRef([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [content, setContent] = useState([]); //array for holding all assignment content
  const [message, setMessage] = useState("");

  const [showButton, setShowButton] = useState(null);

  const [trigger, setTrigger] = useState(false);
  const navigate = useNavigate();
  const [assignmentExtras, setAssignmentExtras] = useState({
    marks: 0,
    date: "",
    time: "",
  });
  const [timeLimit, setTimeLimit] = useState({
    value: 0,
    unit: "minutes",
  });
  const [loading, setLoading] = useState(true);
  const [openSubmission, setOpenSubmission] = useState(null);

  //keep tabs of url to see whether its new/open/all
  const { isNew, isOpened, type } = useUrlParams();
  const openAssignmentFromThisPageRef = useRef(null); //this should track open assignments from teacher/student page

  //useEffect for refreshing everything (assignments, units)
  //triggered with the state variable "trigger" during certain ops
  //also triggered when url changes (open, new, all)
  useEffect(() => {
    const fetchData = async () => {
      const myData = await getUserDetails(user.role, user.id);
      setLoading(false);

      if (myData.data.message) {
        const tempAssignments =
          myData.data.data?.[
            type === "assignment" ? "assignments" : "quizzes"
          ] || [];
        const tempSubmissions =
          myData.data.data?.[
            type === "assignment" ? "submissions" : "quizSubmissions"
          ] || [];

        setAssignments(tempAssignments);
        submissions.current = tempSubmissions;
        setAllAssignments(tempAssignments);
        setUnits(myData.data.data.units || []);

        //when the assignment is opened from teacher/student
        if (isOpened && !openAssignmentFromThisPageRef.current) {
          const toBeOpenedId = isOpened;
          const toBeOpenedData = tempAssignments.find(
            (assignment) => assignment._id === toBeOpenedId
          );
          if (toBeOpenedData) handleOpenExistingAssignment(toBeOpenedData);
          else navigate(`/dashboard/assessments?type=${type}`);
        }
      }
    };
    fetchData();
    persistSelectedUnit();
  }, [trigger, location.search, type]);

  //useEffect for displaying assignments only tied to the currently selected unit
  useEffect(() => {
    const unitId = selectedUnit.id;
    if (unitId === "all") {
      setAssignments(allAssignments);
    } else {
      setAssignments(allAssignments.filter((a) => a.unit._id === unitId));
    }
  }, [selectedUnit, allAssignments]);

  const resetAssignmentContent = () => {
    setContent([]);
    setAssignmentExtras({
      date: "",
      time: "",
      marks: 0,
    });
    setTimeLimit({
      value: 0,
      unit: "minutes",
    });
    setTrigger((prev) => !prev);
  };

  //create new assignment
  const handleCreateNewAssignment = () => {
    resetAssignmentContent();
    setCanEdit(true);
    navigate(`/dashboard/assessments?type=${type}&new=true`, {
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

    //check student submission on that assignment
    if (user.role === "student") {
      const tempSubmission = submissions.current.find(
        (submission) => submission.assignment === assignment._id
      );
      setOpenSubmission(tempSubmission);
    }

    //assign numbers to questions before displaying
    const tempAssignmentContent = JSON.parse(assignment.content);

    setContent(tempAssignmentContent);
    setCanEdit(false);
    navigate(`/dashboard/assessments?type=${type}&open=${assignment._id}`);
  };

  const submissionExists = (id) => {
    return submissions.current.some(
      (submission) => submission.assignment === id
    );
  };

  const clearMessage = () => {
    return setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const handleCloseAssignment = () => {
    resetAssignmentContent();
    navigate(`/dashboard/assessments?type=${type}`);
    setShowButton(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!type) {
    return (
      <Modal isOpen={true} onClose={() => navigate(-1)}>
        <CreateOptionsContent open={true} />
      </Modal>
    );
  }

  return (
    <div
      className={`${styles.container} ${showNav ? "" : styles.marginCollapsed}`}
    >
      {isNew ? ( //for teachers to create assignments
        <RoleRestricted allowedRoles={["teacher"]}>
          <NewAssessment
            {...{
              handleCloseAssignment,
              resetAssignmentContent,
              showButton,
              setShowButton,
              trigger,
              setTrigger,
              user,
              selectedUnit,
              handleOpenExistingAssignment,
              canEdit,
              currentAssignment,
              message,
              setMessage,
              clearMessage,
              assignmentExtras,
              setAssignmentExtras,
              timeLimit,
              setTimeLimit,
            }}
          />
        </RoleRestricted>
      ) : isOpened ? (
        <AssignmentContent
          {...{
            handleCloseAssignment,
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
            message,
            setMessage,
            clearMessage,
            timeLimit,
            setTimeLimit,
          }}
        />
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
                    <RoleRestricted allowedRoles={["student"]}>
                      <p>
                        {submissionExists(assignment._id) ? (
                          <i
                            className={`fa-regular fa-circle-check ${styles.faSubmission} ${styles.faSubmitted}`}
                          ></i>
                        ) : (
                          <i
                            className={`fa-solid fa-clock ${styles.faSubmission} ${styles.faPending}`}
                          ></i>
                        )}
                      </p>
                    </RoleRestricted>
                    <RoleRestricted allowedRoles={["teacher"]}>
                      <p>{assignment.status}</p>
                    </RoleRestricted>
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
    </div>
  );
};

export default Assessments;
