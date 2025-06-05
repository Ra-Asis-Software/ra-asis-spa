import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './css/CustomCalendar.module.css';

const CustomCalendar = ({ deadlines = [] }) => {
  const [value, setValue] = useState(new Date());
  const deadlineDates = deadlines.map(date => new Date(date).toDateString());

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && deadlineDates.includes(date.toDateString())) {
      return 'calendar-deadline';
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
