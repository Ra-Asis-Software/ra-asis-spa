import styles from "../css/Assignments.module.css";
import { useState } from "react";
import { stripHTML, useUrlParams } from "../../../utils/assignments";
import { FileSelector } from "./FileSelector";

export const TeacherAssignmentContent = ({
  content,
  setContent,
  showButton,
  setShowButton,
  trigger,
  setTrigger,
  currentAssignment,
  canEdit,
  assignmentFiles,
  setMessage,
  clearMessage,
}) => {
  const [sectionData, setSectionData] = useState({
    instruction: "",
    question: "",
    answer: "",
    textArea: "",
    title: "",
  });
  const [showAnswerButton, setShowAnswerButton] = useState(null);

  const { isOpened } = useUrlParams();

  //make changes to an already added section
  const handleChangeText = (e, index) => {
    const tempArray = [...content];
    tempArray[index].data = e.target.innerHTML;

    setContent(tempArray); //replace-in the new changes
  };

  //allows teachers to set answers for the questions during creation and editing
  const handleSetCorrectAnswer = (answer, questionIndex) => {
    const tempArray = [...content];

    tempArray[questionIndex].answer = answer; //change current answer

    setContent(tempArray);
  };

  const handleChangeAnswerExists = (e, questionIndex, answerIndex) => {
    const tempArray = [...content];
    tempArray[questionIndex].answers[answerIndex] = e.target.innerHTML;

    setContent(tempArray);
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
    setShowAnswerButton(null); // hide the add answer input
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
    const tempArray = [...content];
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
    const tempArray = [...content];
    tempArray.splice(index, 1);
    setContent(tempArray);
    setTrigger(!trigger); //trigger a rerender of the page
  };

  //handles adding an instructions section to the assignment
  const handleInstruction = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, instruction: input.value });
  };

  //handles adding a title to the assignment
  const handleTitle = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, title: input.value });
  };

  //handles adding a question section to the assignment
  const handleQuestion = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, question: input.value });
  };

  //handles adding textarea to the assignment
  const handleTextArea = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
    setSectionData({ ...sectionData, textArea: input.value });
  };

  const addBlock = (type, data, extra = {}) => {
    if (!data) {
      setMessage("Cannot add an empty field");
      clearMessage();
    } else {
      setContent((prev) => [...prev, { type, data, ...extra }]);
      setSectionData({ ...sectionData, [type]: "" });
      setShowButton(null);
    }
  };

  const handleAddInstruction = () =>
    addBlock("instruction", sectionData.instruction);

  const handleAddTitle = () => addBlock("title", sectionData.title);

  const handleAddQuestion = () =>
    addBlock("question", sectionData.question, { answers: [] });

  const handleAddTextArea = () => addBlock("textArea", sectionData.textArea);

  let questionNumber = 1;
  return (
    <div className={styles.textContent}>
      {isOpened && (
        <>
          {assignmentFiles.files.length > 0 && (
            <FileSelector selector={assignmentFiles} />
          )}
          {currentAssignment?.files?.length > 0 && (
            <div className={styles.selectedFiles}>
              <p>{assignmentFiles.files.length > 0 && "Old"} files: </p>
              {currentAssignment.files.map((file, index) => {
                return (
                  <div
                    className={`${styles.chosenFile} ${
                      assignmentFiles.files.length > 0 && styles.oldFile
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
        </>
      )}

      {content.map((item, index) => {
        return (
          <div
            key={item.id || index}
            className={`${styles.edDivWork} ${styles.edDiv}`}
          >
            {item.type === "instruction" && (
              <p
                className={`${styles.textInstruction} ${styles.editable} ${
                  !canEdit && styles.textInstructionWork
                }`}
                contentEditable={canEdit}
                suppressContentEditableWarning
                onBlur={(e) => handleChangeText(e, index)}
              >
                {stripHTML(item.data)}
              </p>
            )}

            {item.type === "title" && (
              <h4
                className={`${styles.textTitle} ${styles.editable} ${
                  !canEdit && styles.textTitleWork
                }`}
                contentEditable={canEdit}
                suppressContentEditableWarning
                onBlur={(e) => handleChangeText(e, index)}
              >
                {stripHTML(item.data)}
              </h4>
            )}

            {item.type === "question" && (
              <div
                className={`${styles.questionContainer} ${
                  !canEdit && styles.questionContainerWork
                }`}
              >
                <div className={styles.questionHolder}>
                  <p>{`${questionNumber++}.) `}</p>
                  <p
                    className={`${styles.textQuestion} ${styles.editable} ${
                      !canEdit && styles.textQuestionWork
                    }`}
                    contentEditable={canEdit}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChangeText(e, index)}
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
                        contentEditable={canEdit}
                        suppressContentEditableWarning
                        onChange={(e) =>
                          handleChangeAnswerExists(e, index, answerIndex)
                        }
                      >
                        {ans}
                      </p>
                    </div>
                  );
                })}

                {canEdit && (
                  <>
                    {showAnswerButton === index && (
                      <div className={styles.showAnswer}>
                        <input
                          className={styles.answerInput}
                          placeholder="Enter answer here"
                          type="text"
                          onChange={(e) => handleChangeAnswer(e)}
                        />
                        <i
                          onClick={() => handleAddAnswer(index)}
                          className={`fa-solid fa-plus ${styles.faPlus}`}
                        ></i>
                      </div>
                    )}

                    {showAnswerButton !== index && (
                      <button
                        className={styles.addAnswer}
                        onClick={() => setShowAnswerButton(index)}
                      >
                        <i className={`fa-solid fa-plus ${styles.faPlus}`}></i>
                        answer
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {item.type === "textArea" && (
              <div className={styles.questionAnswerBox}>
                <div className={styles.questionHolder}>
                  <p>{`${questionNumber++}.) `}</p>
                  <div
                    className={`${styles.textLong} ${styles.editable} ${
                      !canEdit && styles.textLongWork
                    }`}
                    contentEditable={canEdit}
                    suppressContentEditableWarning
                    onBlur={(e) => handleChangeText(e, index)}
                  >
                    {stripHTML(item.data)}
                  </div>
                </div>
              </div>
            )}

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
          </div>
        );
      })}

      {/* display area for adding instruction */}
      {showButton === "instruction" && (
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
      {showButton === "title" && (
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
      {showButton === "question" && (
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
      {showButton === "textArea" && (
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
    </div>
  );
};
