import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./CustomCalendar.module.css";

const CustomCalendar = ({ deadlines = [] }) => {
  const [value, setValue] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const eventExists = deadlines.find(
        (event) => event.date === date.toISOString().slice(0, 10)
      );

      if (eventExists) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const timestamp = today.getTime();

        const eventDate = new Date(eventExists.date);
        eventDate.setHours(23, 59, 59, 999);
        const eventTimeStamp = eventDate.getTime();

        const difference = eventTimeStamp - timestamp;

        return (
          <div
            className={
              difference < 0 ? styles.specialDayPassed : styles.specialDay
            }
            onMouseEnter={() => setHoveredEvent(eventExists.event)}
            onMouseLeave={() => setHoveredEvent(null)}
          />
        );
      }
      return null;
    }
  };

  return (
    <div className={`${styles.container} ${styles.calendar}`}>
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
        nextLabel="›"
        prevLabel="‹"
        next2Label={null}
        prev2Label={null}
      />
      {hoveredEvent && (
        <div className={styles.eventTooltip}>{hoveredEvent} due</div>
      )}
    </div>
  );
};

export default CustomCalendar;
