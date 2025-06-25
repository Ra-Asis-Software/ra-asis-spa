import { useEffect, useState, useRef } from "react";
import styles from "./css/Assignments.module.css";
import { getUserDetails } from "../../services/userService";
import RoleRestricted from "../ui/RoleRestricted";
import { useLocation, useNavigate } from "react-router-dom";
import { submitAssignment } from "../../services/assignmentServices";

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
  const [sectionData, setSectionData] = useState({
    instruction: "",
    question: "",
    answer: "",
    textArea: "",
    title: "",
  });
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

  //handles adding a title to the assignment
  const handleTitle = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, title: input.value });
  };

  const handleAddTitle = () => {
    const tempArray = [sectionData.title, "title"];

    setContent((prev) => [...prev, tempArray]); // add the title to the contents array

    setSectionData({ ...sectionData, title: "" }); //return title to empty
    setShowButton({ ...showButton, title: false }); // hide the add title area
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
                        ) : item[1] === "textArea" ? (
                          <div
                            className={`${styles.textLong} ${styles.editable}`}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => handleChangeText(e, index)}
                          >
                            {stripHTML(item[0])}
                          </div>
                        ) : (
                          item[1] === "title" && (
                            <h4
                              className={`${styles.textTitle} ${styles.editable}`}
                              contentEditable
                              suppressContentEditableWarning
                              onInput={(e) => handleChangeText(e, index)}
                            >
                              {stripHTML(item[0])}
                            </h4>
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

                {/* display area for adding title */}
                {showButton.title === true && (
                  <div
                    style={{
                      height: "max-content",
                      display: "flex",
                      gap: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <textarea
                      onChange={(e) => handleTitle(e)}
                      placeholder="Enter title here..."
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
                      onClick={handleAddTitle}
                      style={{
                        width: "max-content",
                        height: "5vh",
                        padding: "0 10px",
                      }}
                    >
                      Add Title
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
              <p>Back</p>
            </button>
          </div>
          <div className={styles.assignmentDetails}>
            <h3>Assignment: {currentAssignment.title}</h3>
            <h4>Unit: {currentAssignment.unit.unitName}</h4>
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
      </div>
    </div>
  );
};

export default Assignments;
