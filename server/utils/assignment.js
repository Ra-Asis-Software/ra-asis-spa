export const timeLeft = (dueDate) => {
  const dateTimeString = `${dueDate}:00`;
  const fullDateTimeString = new Date(dateTimeString);
  const milliSeconds = fullDateTimeString.getTime();

  const today = Date.now();
  const diff = (milliSeconds - today) / (1000 * 60); //in minutes

  return diff;
};
