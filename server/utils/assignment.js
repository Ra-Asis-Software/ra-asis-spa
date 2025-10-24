export const timeLeft = (dueDate) => {
  const dateTimeString = `${dueDate}:00`;
  const fullDateTimeString = new Date(dateTimeString);
  const milliSeconds = fullDateTimeString.getTime();

  const today = Date.now();
  const diff = (milliSeconds - today) / (1000 * 60); //in minutes

  return diff;
};

export const getMilliSeconds = (time) => {
  const { value, unit } = time;

  return unit === "minutes"
    ? value * 60 * 1000
    : unit === "hours"
    ? value * 60 * 60 * 1000
    : unit === "seconds" && value * 1000;
};

export const submissionMadeOnTime = (startedAt, timeLimit) => {
  const milliSeconds = getMilliSeconds(timeLimit);
  startedAt = new Date(startedAt).getTime();

  const deadLine = startedAt + milliSeconds + 10000; //add some extra 10 seconds to accomodate request/network latency if the submission was made just-in-time

  return Date.now() <= deadLine;
};

export const prepareAssessment = (assessmentData) => {
  //we expect assignmentData to be an array

  //we separate the correct answers from the questions (for auto-graded questions that is)
  const { newData, correctAnswers } = assessmentData.reduce(
    (acc, dataItem) => {
      const id = crypto.randomUUID();

      if (dataItem.type === "question" && dataItem.answer) {
        // question with new ID
        acc.newData.push({
          type: dataItem.type,
          data: dataItem.data,
          answers: dataItem.answers,
          marks: dataItem.marks,
          id,
        });

        // matching answer
        acc.correctAnswers.push({
          id,
          answer: dataItem.answer,
          marks: dataItem.marks,
        });
      } else {
        acc.newData.push({ ...dataItem, id }); //if not a question with answers, return original
      }

      return acc;
    },
    { newData: [], correctAnswers: [] }
  );

  return { newData, correctAnswers };
};
