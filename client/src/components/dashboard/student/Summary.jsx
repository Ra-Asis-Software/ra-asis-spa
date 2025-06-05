import React, { useEffect, useState } from 'react';
import styles from '../css/Summary.module.css';

const progressData = [
  { label: 'Completed', percent: 80, class: styles.completed },
  { label: 'Pending', percent: 50, class: styles.pending },
  { label: 'Overdue', percent: 20, class: styles.overdue },
];

const Summary = () => {
    
  const [progressWidths, setProgressWidths] = useState(progressData.map(() => '0%'));

    useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressWidths(progressData.map(p => `${p.percent}%`));
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles['summary-section']}>
            <h2>Summary of Assignments</h2>
                <div className={styles.progressBars}>
                    {progressData.map((item, index) => (
                    <div key={index} className={styles.progressRow}>
                            <div className={styles.labelRow}>
                              <span>{item.label}</span>
                              <span>{item.percent}%</span>
                            </div>
                        <div className={styles.progressTrack}>
                            <div
                                className={`${styles.progressFill} ${item.class}`}
                                style={{ width: progressWidths[index] }}
                            />
                        </div>
                    </div>
                    ))}
                </div>
     </div>
  )
}

export default Summary
