import { useRef, useState } from "react";

export const handleDueDate = (dateTime) => {
  const dateTimeString = `${dateTime}:00`;
  const fullDateTimeString = new Date(dateTimeString);
  const milliSeconds = fullDateTimeString.getTime();

  const today = Date.now();
  const diff = milliSeconds - today;
  if (diff < 0) return "Overdue";
  const minutes = diff / (1000 * 60);
  if (minutes < 60) return `${Math.floor(minutes)} minutes `;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)} hours `;
  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)} days`;
  const weeks = days / 7;
  if (weeks < 4) return `${Math.floor(weeks)} weeks`;
  const months = weeks / 4;
  if (months < 12) return `${Math.floor(months)} months`;
  const years = months / 12;
  return `${Math.floor(years)} years`;
};

export const handleDueDateShort = (dateTime) => {
  const dateTimeString = `${dateTime}:00`;
  const fullDateTimeString = new Date(dateTimeString);
  const milliSeconds = fullDateTimeString.getTime();
  const today = Date.now();
  const diff = milliSeconds - today;
  if (diff < 0) return "Overdue";
  const minutes = diff / (1000 * 60);
  if (minutes < 60) return `${Math.floor(minutes)}m `;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}h `;
  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}d `;
  const weeks = days / 7;
  if (weeks < 4) return `${Math.floor(weeks)}w `;
  const months = weeks / 4;
  if (months < 12) return `${Math.floor(months)}mo `;
  const years = months / 12;
  return `${Math.floor(years)}y `;
};

export const timeLeft = (dueDate) => {
  const dateTimeString = `${dueDate}:00`;
  const fullDateTimeString = new Date(dateTimeString);
  const milliSeconds = fullDateTimeString.getTime();

  const today = Date.now();
  const diff = (milliSeconds - today) / (1000 * 60); //in minutes

  return diff;
};

export const absoluteTimeLeft = (timeLimit, startedAt) => {
  //this follows server stored times, which are not affected by the user changing their local time
  return (
    getMilliSeconds(timeLimit) - (Date.now() - new Date(startedAt).getTime())
  );
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

  const type = params.get("type");
  const isNew = params.get("new");
  const isOpened = params.get("open");
  const submission = params.get("submission");

  return { isNew, isOpened, type, submission };
};

export const pushUrlParams = (key, value) => {
  const params = new URLSearchParams(location.search);

  params.set(`${key}`, value);

  return window.history.pushState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`
  );
};

export const removeUrlParams = (key) => {
  const url = new URL(window.location);
  url.searchParams.delete(key);
  window.history.replaceState({}, document.title, url);
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

export const getMilliSeconds = (time) => {
  const { value, unit } = time;

  return unit === "minutes"
    ? value * 60 * 1000
    : unit === "hours"
    ? value * 60 * 60 * 1000
    : unit === "seconds" && value * 1000;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getAssessmentType = (type) => {
  return type === "assignment" ? "Assignments" : type === "quiz" && "Quizzes";
};

export const shortenTitle = (title) => {
  return window.innerWidth < 768 || title.length <= 15
    ? title
    : title.slice(0, 15).concat("...");
};

export const shortenContent = (content) => {
  return window.innerWidth < 768 || content.length <= 23
    ? content
    : content.slice(0, 23).concat("...");
};

export const sortAssessmentsByDeadline = (assignments, quizzes) => {
  assignments = assignType(assignments, "assignment");
  quizzes = assignType(quizzes, "quiz");
  const allAssessments = [...assignments, ...quizzes];

  return allAssessments.sort((a, b) => {
    const dateA = new Date(a.deadLine).getTime();
    const dateB = new Date(b.deadLine).getTime();
    return dateA - dateB;
  });
};

export const excludeSubmittedAssessments = (assessments, submissions) => {
  return assessments.filter((assessment) => {
    const hasSubmission = submissions.some(
      (submission) =>
        submission.assignment === assessment._id ||
        (submission.quiz === assessment._id && submission?.submittedAt)
    );
    return !hasSubmission;
  });
};

export const excludeMarkedAssessments = (assessments) => {
  return assessments.filter((assessment) => assessment.status !== "completed");
};

export const assignType = (assessments, type) => {
  return assessments.map((assessment) => {
    return { ...assessment, type: type };
  });
};
