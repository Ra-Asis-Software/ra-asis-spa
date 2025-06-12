import React from 'react';
import styles from '../css/StudentMain.module.css';
import Title from '../Title';
import AssignmentCard from '../AssignmentCard';
import CustomCalendar from '../CustomCalendar';
import DeadlineCard from './DeadlineCard';
import Summary from './Summary';
import Progress from '../Progress';
import RecentActivities from '../RecentActivities';

const assignmentsData = {
  Mathematics: [
    { title: 'Algebra Homework', teacher: 'Mr. Bekele', status: 'Completed', mark: 29 },
    { title: 'Geometry Worksheet', teacher: 'Mr. Bekele', status: 'Pending' },
    { title: 'Geometry Worksheet', teacher: 'Mr. Bekele', status: 'Not Started' },
  ],
  Chemistry: [
    { title: 'Lab Report', teacher: 'Dr. Smith', status: 'Not Started' },
  ],
};

const deadlinesData = {
  Mathematics: [
    { title: 'Algebra Assignment', dueDate: '2025-06-10', note: 'Chapter 1–3' },
    { title: 'Geometry Project', dueDate: '2025-06-14' },
  ],
  Chemistry: [
    { title: 'Lab Report', dueDate: '2025-06-08', note: 'Submit on LMS' },
  ],
};

const recentActivitiesData = {
  Mathematics: [
    { type: 'Submitted', item: 'Algebra Homework', date: '2025-06-03', time: '10:00 AM' },
    { type: 'Marked', item: 'Geometry Worksheet', date: '2025-06-02', time: '2:30 PM' },
  ],
  Chemistry: [
    { type: 'Feedback', item: 'Lab Report', date: '2025-06-01', time: '11:00 AM' },
  ],
};

const StudentMain = ({ showNav, subject }) => {
  const assignments = assignmentsData[subject] || [];
  const deadlines = deadlinesData[subject] || [];
  const activities = recentActivitiesData[subject] || [];

  // Dynamically get all deadlines for the calendar
  const allDeadlineDates = Object.values(deadlinesData).flat().map(d => d.dueDate);

  const handleView = (title) => {
    alert(`Viewing: ${title}`);
  };

  return (
    <main className={`${styles.main} ${!showNav ? styles.mainCollapsed : ''}`}>
      <Title page="Dashboard" />
      <h2 className={styles.heading}>
        {subject ? `${subject} Assignments` : 'Please select a subject'}
      </h2>
  
      <div className={styles.topRow}>
        <div className={styles.leftColumn}>
          {/* Assignment Cards */}
          <div className={styles.cardContainer}>
            {assignments.length > 0 ? (
              assignments.map((assignment, idx) => (
                <AssignmentCard
                  key={idx}
                  {...assignment}
                  onView={() => handleView(assignment.title)}
                />
              ))
            ) : (
              <p>No assignments for this subject.</p>
            )}
          </div>

          {/* Summary and Deadlines */}
          <div className={styles.summaryAndDeadlineRow}>
            <Summary />
            <DeadlineCard subject={subject} deadlines={deadlines} />
          </div>
        </div>

        <div className={styles.rightColumn}>
          <CustomCalendar deadlines={allDeadlineDates} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className={styles.bottomRow}>
        <Progress />
        <RecentActivities subject={subject} activities={activities} />
      </div>
    </main>
  );
};

export default StudentMain;