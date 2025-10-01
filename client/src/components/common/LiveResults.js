import React from 'react';
import styles from './LiveResults.module.css';

function LiveResults({ question, results, isPollEnded, correctAnswer }) {
  if (!results) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.questionHeader}>{question}</div>
            <div className={styles.resultsList}>
                <p>Waiting for the first vote...</p>
            </div>
        </div>
    );
  }

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);
  const options = Object.keys(results);

  return (
    <div className={styles.wrapper}>
      <div className={styles.questionHeader}>{question}</div>
      <div className={styles.resultsList}>
        {options.map((option, index) => {
          const count = results[option];
          const percentage = totalVotes === 0 ? 0 : (count / totalVotes) * 100;

          const itemClass = (isPollEnded && option === correctAnswer)
            ? `${styles.resultItem} ${styles.correct}`
            : styles.resultItem;

          return (
            <div key={option} className={itemClass}>
              <div className={styles.optionNumber}>{index + 1}</div>
              <div className={styles.progressBarContainer}>
                <div className={styles.progressBarFill} style={{ width: `${percentage}%` }} />
                <span className={styles.optionText}>{option}</span>
              </div>
              <span className={styles.percentageText}>{percentage.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LiveResults;