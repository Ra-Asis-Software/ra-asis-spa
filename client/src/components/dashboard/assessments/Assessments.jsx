import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Assessments.module.css";
import { studentBar, teacherBar, parentBar } from "../SideBar.module.css";
import { handleDueDate, useUrlParams } from "../../../utils/assessmentUtils.js";
import { getUserDetails } from "../../../services/userService.js";
import RoleRestricted from "../../ui/RoleRestricted.jsx";
import Modal from "../../ui/Modal.jsx";
import AssessmentContent from "./AssessmentContent.jsx";
import NewAssessment from "./NewAssessment.jsx";
import CreateOptionsContent from "../CreateOptionsContent.jsx";
import ResponseModal from "../../ui/ResponseModal.jsx";
import WelcomeBoard from "../WelcomeBoard.jsx";

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
  units,
}) => {
  const [allAssessments, setAllAssessments] = useState([]);
  const submissions = useRef([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [content, setContent] = useState([]); //array for holding all assignment content
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const navigate = useNavigate();
  const [assessmentExtras, setAssessmentExtras] = useState({
    marks: 0,
    date: "",
    time: "",
    fileMarks: 0,
  });
  const [timeLimit, setTimeLimit] = useState({
    value: 0,
    unit: "minutes",
  });
  const [openSubmission, setOpenSubmission] = useState(null);

  //keep tabs of url to see whether its new/open/all
  const { isNew, isOpened, type } = useUrlParams();

  //useEffect for refreshing everything (assessments, units)
  //triggered with the state variable "trigger" during certain ops
  //also triggered when url changes (open, new, all)
  useEffect(() => {
    const fetchData = async () => {
      const myData = await getUserDetails(user.role, user.id);

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

        if (isOpened) {
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
    setAssessmentExtras({
      ...assessmentExtras,
      date: assessment.deadLine.slice(0, 10),
      time: assessment.deadLine.slice(11),
      marks: assessment.maxMarks,
      fileMarks: assessment.fileMarks,
    });
    setTimeLimit(assessment?.timeLimit);
    setCurrentAssessment(assessment);

    //check student submission on that assignment
    if (user.role === "student") {
      const tempSubmission = submissions.current.find(
        (submission) => submission?.[type] === assessment._id
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
    return type === "assignment"
      ? submissions.current.some((submission) => submission?.[type] === id)
      : submissions.current.some(
          (submission) => submission?.[type] === id && submission?.submittedAt
        );
  };

  const clearMessage = () => {
    return setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 5000);
  };

  const handleCloseAssessment = () => {
    resetAssessmentContent();
    navigate(`/dashboard/assessments?type=${type}`);
    setShowButton(null);
  };

  // Check if Teacher or Student has units
  const shouldShowWelcomeBoard = () => {
    const teacherOrStudent = ["teacher", "student"].includes(user.role);
    return teacherOrStudent && units.length === 0;
  };

  if (!type) {
    return (
      <Modal isOpen={true} onClose={() => navigate(-1)}>
        <CreateOptionsContent open={true} />
      </Modal>
    );
  }

  if (shouldShowWelcomeBoard()) {
    return (
      <div
        className={`${styles.container} ${
          showNav ? "" : styles.marginCollapsed
        }`}
      >
        <WelcomeBoard firstName={user.firstName} />
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${showNav ? "" : styles.marginCollapsed}`}
    >
      {message.text.length > 0 && (
        <ResponseModal isOpen={true} message={message} />
      )}

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
              selectedUnit,
              handleOpenExistingAssessment,
              currentAssessment,
              setMessage,
              clearMessage,
              assessmentExtras,
              setAssessmentExtras,
              timeLimit,
              setTimeLimit,
              loading,
              setLoading,
            }}
          />
        </RoleRestricted>
      ) : isOpened && currentAssessment ? (
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
            setMessage,
            clearMessage,
            timeLimit,
            setTimeLimit,
            loading,
            setLoading,
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
                <p>New {type}</p>
              </button>
            </RoleRestricted>
          </div>
          <div className={styles.assignmentsBody}>
            {assessments
              .filter((assessment) => {
                if (selectedUnit.id === "all") {
                  return assessment;
                }
                return assessment.unit._id === selectedUnit.id;
              })
              .map((assessment) => {
                return (
                  <button
                    key={assessment._id}
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
                    onClick={() => handleOpenExistingAssessment(assessment)}
                  >
                    <p>{assessment.title}</p>
                    <RoleRestricted allowedRoles={["student"]}>
                      <p>
                        {submissionExists(assessment._id) ? (
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
                      <p>{assessment.status}</p>
                    </RoleRestricted>
                    <p>{handleDueDate(assessment.deadLine)}</p>
                  </button>
                );
              })}
            {assessments.length === 0 && (
              <p>You have no {type} for this selection</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;
