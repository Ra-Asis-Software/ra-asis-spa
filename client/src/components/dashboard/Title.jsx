import React from 'react';
import styles from './title.module.css';

const Title = ({page}) => {
  return (
    <div className={styles.Title}>
      <h1>{page}</h1>
      <nav>
        <ol className={styles.breadCrumb}>
            <li className={styles.breadCrumbItem}>
                <a href="/">
                <i className={`${styles.icon} fas fa-home`}></i>
                </a>
                <span className={styles.separator}>/</span>
            </li>
            <li className={`${styles.Item} ${styles.active}`}>Dashboard</li>
        </ol>

      </nav>
    </div>
  )
}

export default Title;
