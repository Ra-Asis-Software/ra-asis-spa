import { useEffect, useState } from "react";
import styles from "./css/Assignments.module.css";
import Title from "./Title";
import { getUserDetails } from "../../services/userService";
import RoleRestricted from "../ui/RoleRestricted";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Assignments = ({ showNav, user }) => {
  const [assignments, setAssignments] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const [units, setUnits] = useState([]);
  const [openAssignment, setOpenAssignment] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [content, setContent] = useState([]); //array for holding all assignment content
  const [sectionData, setSectionData] = useState({
    instruction: "",
    question: "",
    answer: "",
    textArea: "",
  });
  const [showButton, setShowButton] = useState({
    instruction: false,
    question: false,
    answer: false,
    textArea: false,
  });
  const [assignmentUnit, setAssignmentUnit] = useState("");
  const [trigger, setTrigger] = useState(false);
  const assignmentContentRef = useRef(null);
  const navigate = useNavigate();

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
  }, []);

  useEffect(() => {
    setTrigger((prev) => prev);
  }, [trigger]);

  const handleFilterUnit = (e) => {
    const unitId = e.target.value;
    if (unitId === "") {
      setAssignments(allAssignments);
    } else {
      setAssignments(() => {
        return allAssignments.filter(
          (assignment) => assignment.unit === unitId
        );
      });
    }
  };

  //handles adding an instructions section to the assignment
  const handleInstruction = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, instruction: input.value });
  };

  const handleAddInstruction = () => {
    const tempArray = [sectionData.instruction, "instruction"];

    setContent((prev) => [...prev, tempArray]); // add the instruction to the contents array

    setSectionData({ ...sectionData, instruction: "" }); //return instruction to empty
    setShowButton({ ...showButton, instruction: false }); // hide the add instruction area
  };

  //handles adding a question section to the assignment
  const handleQuestion = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, question: input.value });
  };

  const handleAddQuestion = () => {
    const tempArray = [sectionData.question, "question", []];

    setContent((prev) => [...prev, tempArray]); // add the instruction to the contents array

    setSectionData({ ...sectionData, question: "" }); //return instruction to empty
    setShowButton({ ...showButton, question: false }); // hide the add instruction area
  };

  //handles adding textarea to the assignment
  const handleTextArea = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, textArea: input.value });
  };

  const handleAddTextArea = () => {
    const tempArray = [sectionData.textArea, "textArea"];

    setContent((prev) => [...prev, tempArray]); // add the instruction to the contents array

    setSectionData({ ...sectionData, textArea: "" }); //return textArea to empty
    setShowButton({ ...showButton, textArea: false }); // hide the add textArea area
  };

  //adding an answer to a question
  const handleChangeAnswer = (e) => {
    const input = e.target;

    input.style.width = "auto";
    input.style.height = "4vh";
    input.style.width = `${input.scrollWidth}px`;

    setSectionData({ ...sectionData, answer: input.value });
  };

  const handleAddAnswer = (index) => {
    let tempArray = [...content];
    tempArray[index][2].push(sectionData.answer);

    setContent(tempArray);

    setSectionData({ ...sectionData, answer: "" }); //return answer to empty
    setShowButton({ ...showButton, answer: false }); // hide the add answer input
  };

  const handleChangeAnswerExists = (e, questionIndex, answerIndex) => {
    const tempArray = content;
    tempArray[questionIndex][2][answerIndex] = e.target.innerHTML;

    setContent(tempArray);
  };

  //make changes to an already added section
  const handleChangeText = (e, index) => {
    const tempArray = content;
    tempArray[index][0] = e.target.innerHTML;

    setContent(tempArray); //replace-in the new changes
  };

  //replace html elements with their appropriate spaces and breaks
  function stripHTML(html) {
    return html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");
  }

  //move an item in the assignment either up or down
  const handleMoveItemUp = (index) => {
    const tempArray = content;
    const itemClicked = tempArray[index];
    const itemToSwap = index - 1 > -1 ? tempArray[index - 1] : tempArray[index];

    if (index - 1 > -1) {
      tempArray[index - 1] = itemClicked;
      tempArray[index] = itemToSwap;
    }
    setContent(tempArray);
    setTrigger(!trigger); //trigger a rerender of the page
  };

  const handleMoveItemDown = (index) => {
    const tempArray = content;
    const itemClicked = tempArray[index];
    const itemToSwap =
      index + 1 < tempArray.length ? tempArray[index + 1] : tempArray[index];

    if (index + 1 < tempArray.length) {
      tempArray[index + 1] = itemClicked;
      tempArray[index] = itemToSwap;
    }
    setContent(tempArray);
    setTrigger(!trigger); //trigger a rerender of the page
  };

  const handleDeleteNoteItem = (index) => {
    const tempArray = content;
    tempArray.splice(index, 1);
    setContent(tempArray);
    setTrigger(!trigger); //trigger a rerender of the page
  };

  //handles publishing assignment
  const handlePublishAssignment = () => {};

  return (
    <div className={`${styles.hero} ${showNav ? "" : styles.marginCollapsed}`}>
      {params.get("new") ? ( //for teachers to create assignments
        <RoleRestricted allowedRoles={["teacher"]}>
          <div className={styles.assignmentsBox}>
            <div className={styles.assignmentsHeader}>
              <h3>Create New Assignment</h3>
            </div>
            <div>
              <select onChange={(e) => setAssignmentUnit(e.target.value)}>
                <option value={""}>select unit</option>
                {units.map((unit) => {
                  return (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              className={styles.newAssignmentContent}
              ref={assignmentContentRef}
            >
              <div className={styles.textContent}>
                <h4>{assignmentUnit}</h4>
                {content.length === 0 && (
                  <p>Use the tools on the right to add content</p>
                )}
                {content.length > 0 &&
                  content.map((item, index) => {
                    return (
                      <div key={index} className={styles.edDiv}>
                        {item[1] === "instruction" ? (
                          <p
                            className={`${styles.textInstruction} ${styles.editable}`}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => handleChangeText(e, index)}
                          >
                            NOTE: {stripHTML(item[0])}
                          </p>
                        ) : item[1] === "question" ? (
                          <div className={styles.questionContainer}>
                            <p
                              className={`${styles.textQuestion} ${styles.editable}`}
                              contentEditable
                              suppressContentEditableWarning
                              onInput={(e) => handleChangeText(e, index)}
                            >
                              {stripHTML(item[0])}
                            </p>

                            {item[2].map((ans, index1) => {
                              return (
                                <div
                                  className={`${styles.answerBox}`}
                                  key={index1}
                                >
                                  <p
                                    className={styles.editable}
                                    contentEditable
                                    suppressContentEditableWarning
                                    onInput={(e) =>
                                      handleChangeAnswerExists(e, index, index1)
                                    }
                                  >
                                    {ans}
                                  </p>
                                </div>
                              );
                            })}

                            {showButton.answer === index && (
                              <div className={styles.showAnswer}>
                                <input
                                  className={styles.answerInput}
                                  placeholder="Enter answer here"
                                  type="text"
                                  onInput={(e) => handleChangeAnswer(e)}
                                />
                                <i
                                  onClick={() => handleAddAnswer(index)}
                                  className={`fa-solid fa-plus ${styles.faPlus}`}
                                ></i>
                              </div>
                            )}

                            {showButton.answer !== index && (
                              <button
                                className={styles.addAnswer}
                                onClick={() =>
                                  setShowButton({
                                    ...showButton,
                                    answer: index,
                                  })
                                }
                              >
                                <i
                                  className={`fa-solid fa-plus ${styles.faPlus}`}
                                ></i>
                                answer
                              </button>
                            )}
                          </div>
                        ) : (
                          item[1] === "textArea" && (
                            <div
                              className={`${styles.textLong} ${styles.editable}`}
                              contentEditable
                              suppressContentEditableWarning
                              onInput={(e) => handleChangeText(e, index)}
                            >
                              {stripHTML(item[0])}
                            </div>
                          )
                        )}
                        <div className={styles.edBtns}>
                          <i
                            className={`fa-solid fa-arrow-up ${styles.faSolid}  ${styles.faArrow}`}
                            onClick={() => handleMoveItemUp(index)}
                          ></i>
                          <i
                            className={`fa-solid fa-arrow-down ${styles.faSolid}  ${styles.faArrow}`}
                            onClick={() => handleMoveItemDown(index)}
                          ></i>
                          <i
                            class={`fa-solid fa-trash ${styles.faSolid}  ${styles.faTrash}`}
                            onClick={() => handleDeleteNoteItem(index)}
                          ></i>
                        </div>
                      </div>
                    );
                  })}

                {/* display area for adding instruction */}
                {showButton.instruction === true && (
                  <div
                    style={{
                      height: "max-content",
                      display: "flex",
                      gap: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <textarea
                      onChange={(e) => handleInstruction(e)}
                      placeholder="Enter Instruction here..."
                      style={{
                        fontSize: "1.0rem",
                        padding: "8px",
                        width: "650px",
                        backgroundColor: "#F0F8FF",
                        border: "none",
                        borderBottom: "1px solid #C0C0C0",
                      }}
                    />

                    <button
                      onClick={handleAddInstruction}
                      style={{
                        width: "max-content",
                        height: "5vh",
                        padding: "0 10px",
                      }}
                    >
                      Add instruction
                    </button>
                  </div>
                )}

                {/* display area for adding a question */}
                {showButton.question === true && (
                  <div
                    style={{
                      height: "max-content",
                      display: "flex",
                      gap: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <textarea
                      onChange={(e) => handleQuestion(e)}
                      placeholder="Enter Question here..."
                      style={{
                        fontSize: "1.0rem",
                        padding: "8px",
                        width: "650px",
                        backgroundColor: "#F0F8FF",
                        border: "none",
                        borderBottom: "1px solid #C0C0C0",
                      }}
                    />

                    <button
                      onClick={handleAddQuestion}
                      style={{
                        width: "max-content",
                        height: "5vh",
                        padding: "0 10px",
                      }}
                    >
                      Add question
                    </button>
                  </div>
                )}

                {/* display area for adding a lot of text */}
                {showButton.textArea === true && (
                  <div
                    style={{
                      height: "max-content",
                      display: "flex",
                      gap: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <textarea
                      onChange={(e) => handleTextArea(e)}
                      placeholder="Enter Text here..."
                      style={{
                        fontSize: "1.0rem",
                        padding: "8px",
                        width: "650px",
                        backgroundColor: "#F0F8FF",
                        border: "none",
                        borderBottom: "1px solid #C0C0C0",
                        minHeight: "30vh",
                      }}
                    />

                    <button
                      onClick={handleAddTextArea}
                      style={{
                        width: "max-content",
                        height: "5vh",
                        padding: "0 10px",
                      }}
                    >
                      ADD textArea
                    </button>
                  </div>
                )}
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
              <p>all assignments</p>
            </button>
          </div>
          <div className={styles.assignmentDetails}>
            <h3>Assignment: {currentAssignment.title}</h3>
            <h4>Unit: {"Soen 330"}</h4>
            <p className={styles.instruction}>
              Instructions: This assignment should be done in groups of five.
              the assignment should be submitted either on a Monday or a
              Wednesday
            </p>
          </div>
          <RoleRestricted allowedRoles={["teacher"]}>
            <button className={styles.addAssignment}>EDIT ASSIGNMENT</button>
          </RoleRestricted>
        </div>
      ) : (
        <div className={`${styles.assignmentsBox}`}>
          <h3>Assignments</h3>
          <div className={styles.assignmentsHeader}>
            <select onChange={(e) => handleFilterUnit(e)}>
              <option value={""}>All Units</option>
              {units.map((unit) => {
                //change backend response to populate unit names
                return (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                );
              })}
            </select>

            <RoleRestricted allowedRoles={["teacher"]}>
              <button
                className={styles.addAssignment}
                onClick={() => navigate("/dashboard/assignments?new=true")}
              >
                <i className="fa-solid fa-plus"></i>
                <p>Create New</p>
              </button>
            </RoleRestricted>
          </div>
          <div className={styles.assignmentsBody}>
            {assignments.map((assignment) => {
              return (
                <button
                  key={assignment._id}
                  className={styles.assignment}
                  onClick={() => {
                    setOpenAssignment(true);
                    setCurrentAssignment(assignment);
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
        {params.get("new") && (
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

              <button className={styles.addAssignment}>Title</button>

              <button className={styles.addAssignment}>File</button>
            </div>
            <div className={styles.extraTools}>
              <div className={styles.deadline}>
                <p>Deadline</p>
                <input type="date" />
              </div>
              <div className={styles.deadline}>
                <p>Max marks</p>
                <input type="number" max={100} />
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
      </div>
    </div>
  );
};

export default Assignments;
