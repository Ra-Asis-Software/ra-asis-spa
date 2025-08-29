import { useEffect, useState, useRef } from "react";
import styles from "../css/Assessments.module.css";
import {
  studentBar,
  teacherBar,
  parentBar,
} from "../css/SideBarStyles.module.css";
import { getUserDetails } from "../../../services/userService";
import RoleRestricted from "../../ui/RoleRestricted";
import { useNavigate } from "react-router-dom";
import AssessmentContent from "./AssessmentContent";
import { handleDueDate, useUrlParams } from "../../../utils/assessments";
import { NewAssessment } from "./NewAssessment";
import Modal from "../../ui/Modal";
import CreateOptionsContent from "../CreateOptionsContent";

const Assessments = ({
  showNav,
  user,
  selectedUnit,
  assessments,
  setAssessments,
  setUnits,
  canEdit,
  setCanEdit,
  persistSelectedUnit,
}) => {
  const [allAssessments, setAllAssessments] = useState([]);
  const submissions = useRef([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [content, setContent] = useState([]); //array for holding all assignment content
  const [message, setMessage] = useState("");

  const [showButton, setShowButton] = useState(null);

  const [trigger, setTrigger] = useState(false);
  const navigate = useNavigate();
  const [assessmentExtras, setAssessmentExtras] = useState({
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
  const openAssessmentFromThisPageRef = useRef(null); //this should track open assessments from teacher/student page

  //useEffect for refreshing everything (assessments, units)
  //triggered with the state variable "trigger" during certain ops
  //also triggered when url changes (open, new, all)
  useEffect(() => {
    const fetchData = async () => {
      const myData = await getUserDetails(user.role, user.id);
      setLoading(false);

      if (myData.data.message) {
        const tempAssessments =
          myData.data.data?.[
            type === "assignment" ? "assignments" : "quizzes"
          ] || [];
        const tempSubmissions =
          myData.data.data?.[
            type === "assignment" ? "submissions" : "quizSubmissions"
          ] || [];

        setAssessments(tempAssessments);
        submissions.current = tempSubmissions;
        setAllAssessments(tempAssessments);
        setUnits(myData.data.data.units || []);

        //when the assignment is opened from teacher/student
        if (isOpened && !openAssessmentFromThisPageRef.current) {
          const toBeOpenedId = isOpened;
          const toBeOpenedData = tempAssessments.find(
            (assignment) => assignment._id === toBeOpenedId
          );
          if (toBeOpenedData) handleOpenExistingAssessment(toBeOpenedData);
          else navigate(`/dashboard/assessments?type=${type}`);
        }
      }
    };
    fetchData();
    persistSelectedUnit();
  }, [trigger, location.search, type]);

  //useEffect for displaying assessments only tied to the currently selected unit
  useEffect(() => {
    const unitId = selectedUnit.id;
    if (unitId === "all") {
      setAssessments(allAssessments);
    } else {
      setAssessments(allAssessments.filter((a) => a.unit._id === unitId));
    }
  }, [selectedUnit, allAssessments]);

  const resetAssessmentContent = () => {
    setContent([]);
    setAssessmentExtras({
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
  const handleCreateNewAssessment = () => {
    resetAssessmentContent();
    setCanEdit(true);
    navigate(`/dashboard/assessments?type=${type}&new=true`, {
      replace: true,
    });
  };

  //open existing assignment
  const handleOpenExistingAssessment = (assessment) => {
    openAssessmentFromThisPageRef.current = true;
    setAssessmentExtras({
      ...assessmentExtras,
      date: assessment.deadLine.slice(0, 10),
      time: assessment.deadLine.slice(11),
      marks: assessment.maxMarks,
    });
    setTimeLimit(assessment?.timeLimit);
    setCurrentAssessment(assessment);

    //check student submission on that assignment
    if (user.role === "student") {
      const tempSubmission = submissions.current.find(
        (submission) => submission.assignment === assessment._id
      );
      setOpenSubmission(tempSubmission);
    }

    //assign numbers to questions before displaying
    const tempAssessmentContent = JSON.parse(assessment.content);

    setContent(tempAssessmentContent);
    setCanEdit(false);
    navigate(`/dashboard/assessments?type=${type}&open=${assessment._id}`);
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

  const handleCloseAssessment = () => {
    resetAssessmentContent();
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
      {isNew ? ( //for teachers to create assessments
        <RoleRestricted allowedRoles={["teacher"]}>
          <NewAssessment
            {...{
              handleCloseAssessment,
              resetAssessmentContent,
              showButton,
              setShowButton,
              trigger,
              setTrigger,
              user,
              selectedUnit,
              handleOpenExistingAssessment,
              canEdit,
              currentAssessment,
              message,
              setMessage,
              clearMessage,
              assessmentExtras,
              setAssessmentExtras,
              timeLimit,
              setTimeLimit,
            }}
          />
        </RoleRestricted>
      ) : isOpened ? (
        <AssessmentContent
          {...{
            handleCloseAssessment,
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
            message,
            setMessage,
            clearMessage,
            timeLimit,
            setTimeLimit,
          }}
        />
      ) : (
        <div className={`${styles.assignmentsBox}`}>
          <h3>{type === "assignment" ? "Assignments" : "Quizzes"}</h3>
          <div className={styles.assignmentsHeader}>
            <h3>{selectedUnit.name || "All assessments"}</h3>

            <RoleRestricted allowedRoles={["teacher"]}>
              <button
                className={styles.addAssignment}
                onClick={handleCreateNewAssessment}
              >
                <i className="fa-solid fa-plus"></i>
                <p>Create New</p>
              </button>
            </RoleRestricted>
          </div>
          <div className={styles.assignmentsBody}>
            {assessments
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
                    onClick={() => handleOpenExistingAssessment(assignment)}
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
            {assessments.length === 0 && (
              <p>You have no assignments for this selection</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;
