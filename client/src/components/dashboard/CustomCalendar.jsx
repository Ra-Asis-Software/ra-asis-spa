import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './css/CustomCalendar.module.css';

const CustomCalendar = ({ deadlines = [] }) => {
  const [value, setValue] = useState(new Date());

  // const deadlineDates = deadlines.map(date => new Date(date).toDateString());

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const eventExists = deadlines.find(event => event.date === date.toISOString().slice(0, 10))

      if(eventExists) {
        const difference = new Date(eventExists.date).getTime() - new Date().getTime()

        return difference < 0 ? styles.specialDayPassed : styles.specialDay
      }
      return null
    }
  };

  return (
    <div className={`${styles.container} ${styles.calendar}`}>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
        nextLabel="›"
        prevLabel="‹"
        next2Label={null}
        prev2Label={null}
        // calendarType="ISO 8601"
      />
    </div>
  );
};

export default CustomCalendar;
