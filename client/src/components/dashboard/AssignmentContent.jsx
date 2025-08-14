import RoleRestricted from "../ui/RoleRestricted";
import styles from "./css/Assignments.module.css";
import { useState } from "react";

const AssignmentContent = ({
  content,
  setContent,
  showButton,
  setShowButton,
  trigger,
  setTrigger,
  canEdit = false,
  role,
}) => {
  const [sectionData, setSectionData] = useState({
    instruction: "",
    question: "",
    answer: "",
    textArea: "",
    title: "",
  });

  //make changes to an already added section
  const handleChangeText = (e, index) => {
    const tempArray = [...content];
    tempArray[index].data = e.target.innerHTML;

    setContent(tempArray); //replace-in the new changes
  };

  //replace html elements with their appropriate spaces and breaks
  const stripHTML = (html) => {
    return html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");
  };

  //handles adding an instructions section to the assignment
  const handleInstruction = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, instruction: input.value });
  };

  const handleAddInstruction = () => {
    const tempInstruction = {
      type: "instruction",
      data: sectionData.instruction,
    };

    setContent((prev) => [...prev, tempInstruction]); // add the instruction to the contents array

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
    const tempTitle = { type: "title", data: sectionData.title };

    setContent((prev) => [...prev, tempTitle]); // add the title to the contents array

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
    const tempQuestion = {
      type: "question",
      data: sectionData.question,
      answers: [],
    };

    setContent((prev) => [...prev, tempQuestion]); // add the question to the contents array

    setSectionData({ ...sectionData, question: "" }); //return question to empty
    setShowButton({ ...showButton, question: false }); // hide the add question area
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
    const tempArray = [...content];
    tempArray[index].answers.push(sectionData.answer);

    setContent(tempArray);

    setSectionData({ ...sectionData, answer: "" }); //return answer to empty
    setShowButton({ ...showButton, answer: false }); // hide the add answer input
  };

  const handleChangeAnswerExists = (e, questionIndex, answerIndex) => {
    const tempArray = [...content];
    tempArray[questionIndex].answers[answerIndex] = e.targert.innerHTML;

    setContent(tempArray);
  };

  const handleSetCorrectAnswer = (answer, questionIndex) => {
    const tempArray = [...content];

    tempArray[questionIndex].answer = answer; //change current answer

    setContent(tempArray);
  };

  //handles adding textarea to the assignment
  const handleTextArea = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, textArea: input.value });
  };

  const handleAddTextArea = () => {
    const tempTextArea = { type: "textArea", data: sectionData.textArea };

    setContent((prev) => [...prev, tempTextArea]); // add the instruction to the contents array

    setSectionData({ ...sectionData, textArea: "" }); //return textArea to empty
    setShowButton({ ...showButton, textArea: false }); // hide the add textArea area
  };

  //move an item in the assignment either up or down
  const handleMoveItemUp = (index) => {
    const tempArray = [...content];
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

  return (
    <>
      {content.length > 0 &&
        content.map((item, index) => {
          return (
            <div
              key={index}
              className={`${styles.edDiv}  ${!canEdit && styles.edDivWork}`}
            >
              {item.type === "instruction" ? (
                <p
                  className={`${styles.textInstruction} ${styles.editable} ${
                    !canEdit && styles.textInstructionWork
                  }`}
                  contentEditable={canEdit && role === "teacher"}
                  suppressContentEditableWarning
                  onInput={(e) => handleChangeText(e, index)}
                >
                  <span className={styles.noteText}>NOTE:</span>{" "}
                  {stripHTML(item.data)}
                </p>
              ) : item.type === "question" ? (
                <div
                  className={`${styles.questionContainer} ${
                    !canEdit && styles.questionContainerWork
                  }`}
                >
                  <div className={styles.questionHolder}>
                    <p>{!canEdit && `${item.questionNumber}.) `}</p>
                    <p
                      className={`${styles.textQuestion} ${styles.editable} ${
                        !canEdit && styles.textQuestionWork
                      }`}
                      contentEditable={canEdit && role === "teacher"}
                      suppressContentEditableWarning
                      onInput={(e) => handleChangeText(e, index)}
                    >
                      {stripHTML(item.data)}
                    </p>
                  </div>

                  {item.answers.map((ans, answerIndex) => {
                    return (
                      <div className={`${styles.answerBox}`} key={answerIndex}>
                        {canEdit && (
                          <input
                            type="radio"
                            name={`question${index}Answer`}
                            defaultChecked={item?.answer === ans}
                            onChange={() => handleSetCorrectAnswer(ans, index)}
                          />
                        )}
                        <p
                          className={`${styles.editable} ${
                            !canEdit && styles.answerWork
                          }`}
                          contentEditable={canEdit && role === "teacher"}
                          suppressContentEditableWarning
                          onInput={(e) =>
                            handleChangeAnswerExists(e, index, answerIndex)
                          }
                        >
                          {ans}
                        </p>
                      </div>
                    );
                  })}

                  {canEdit && (
                    <RoleRestricted allowedRoles={["teacher"]}>
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
                    </RoleRestricted>
                  )}
                </div>
              ) : item.type === "textArea" ? (
                <div className={styles.questionHolder}>
                  <p>{!canEdit && `${item.questionNumber}.) `}</p>
                  <div
                    className={`${styles.textLong} ${styles.editable} ${
                      !canEdit && styles.textLongWork
                    }`}
                    contentEditable={canEdit && role === "teacher"}
                    suppressContentEditableWarning
                    onInput={(e) => handleChangeText(e, index)}
                  >
                    {stripHTML(item.data)}
                  </div>
                </div>
              ) : (
                item.type === "title" && (
                  <h4
                    className={`${styles.textTitle} ${styles.editable} ${
                      !canEdit && styles.textTitleWork
                    }`}
                    contentEditable={canEdit && role === "teacher"}
                    suppressContentEditableWarning
                    onInput={(e) => handleChangeText(e, index)}
                  >
                    {stripHTML(item.data)}
                  </h4>
                )
              )}
              <RoleRestricted allowedRoles={["teacher"]}>
                {canEdit && (
                  <div className={styles.edBtns}>
                    <i
                      className={`fa-solid fa-arrow-up ${styles.faSolid}  ${styles.faArrow}`}
                      onClick={() => handleMoveItemUp(index)}
                      title="Move block up"
                    ></i>
                    <i
                      className={`fa-solid fa-arrow-down ${styles.faSolid}  ${styles.faArrow}`}
                      onClick={() => handleMoveItemDown(index)}
                      title="Move block down"
                    ></i>
                    <i
                      className={`fa-solid fa-trash ${styles.faSolid}  ${styles.faTrash}`}
                      onClick={() => handleDeleteNoteItem(index)}
                      title="Delete block"
                    ></i>
                  </div>
                )}
              </RoleRestricted>
            </div>
          );
        })}

      {/* display area for adding instruction */}
      {showButton.instruction === true && (
        <div className={styles.addedDiv}>
          <textarea
            onChange={(e) => handleInstruction(e)}
            placeholder="Enter instruction here..."
            className={styles.addedTextArea}
          />

          <button onClick={handleAddInstruction} className={styles.addedButton}>
            <i className="fa-solid fa-plus" />
            Add Instruction
          </button>
        </div>
      )}

      {/* display area for adding title */}
      {showButton.title === true && (
        <div className={styles.addedDiv}>
          <textarea
            onChange={(e) => handleTitle(e)}
            placeholder="Enter title here..."
            className={styles.addedTextArea}
          />

          <button onClick={handleAddTitle} className={styles.addedButton}>
            <i className="fa-solid fa-plus" />
            Add Title
          </button>
        </div>
      )}

      {/* display area for adding a question */}
      {showButton.question === true && (
        <div className={styles.addedDiv}>
          <textarea
            onChange={(e) => handleQuestion(e)}
            placeholder="Enter question here..."
            className={styles.addedTextArea}
          />

          <button onClick={handleAddQuestion} className={styles.addedButton}>
            <i className="fa-solid fa-plus" />
            Add Question
          </button>
        </div>
      )}

      {/* display area for adding a lot of text */}
      {showButton.textArea === true && (
        <div className={styles.addedDiv}>
          <textarea
            onChange={(e) => handleTextArea(e)}
            placeholder="Enter text here..."
            className={`${styles.addedTextArea}
             ${styles.fullTextArea}`}
          />

          <button onClick={handleAddTextArea} className={styles.addedButton}>
            <i className="fa-solid fa-plus" />
            Add Text Area
          </button>
        </div>
      )}
    </>
  );
};

export default AssignmentContent;
