import { useRef, useState } from "react";
export const handleDueDate = (dateTime) => {
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

export const timeLeft = (dueDate) => {
  const dateTimeString = `${dueDate}:00`;
  const fullDateTimeString = new Date(dateTimeString);
  const milliSeconds = fullDateTimeString.getTime();

  const today = Date.now();
  const diff = (milliSeconds - today) / (1000 * 60); //in minutes

  return diff;
};

export const useFileUploads = () => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const chooseFiles = () => inputRef.current?.click();
  const onChange = (e) => setFiles(Array.from(e.target.files));
  const resetFiles = () => setFiles([]);

  return { files, setFiles, chooseFiles, onChange, resetFiles, inputRef };
};

export const stripHTML = (html) => {
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "");
};

export const useUrlParams = () => {
  const params = new URLSearchParams(location.search);

  const isNew = params.get("new");
  const isOpened = params.get("open");

  return { isNew, isOpened };
};

export const correctAnswerNotSet = (content) => {
  let questionNumber = 0;
  for (const item of content) {
    if (item.type === "question" || item.type === "textArea") {
      questionNumber++;
    }
    if (item.type === "question") {
      if (item.answers.length > 0) {
        //check if the correct answer has been set
        if (
          item.answer == null ||
          item.answer === "" ||
          item.answer == undefined
        ) {
          return questionNumber;
        }
      }
    }
  }
  return false;
};

export const hasSingleAnswerOption = (content) => {
  let questionNumber = 0;

  for (const item of content) {
    if (item.type === "question" || item.type === "textArea") {
      questionNumber++;
    }

    if (item.type === "question" && item.answers.length === 1) {
      return questionNumber;
    }
  }
  return false;
};

export const isAnyAnswerEmpty = (content) => {
  let questionNumber = 0;

  for (const item of content) {
    if (item.type === "question" || item.type === "textArea") {
      questionNumber++;
    }

    if (item.type === "question" && item.answers.length > 0) {
      for (const answer of item.answers) {
        if (!answer) {
          return questionNumber;
        }
      }
    }
  }
  return false;
};
