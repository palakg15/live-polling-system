import React from 'react';
import styles from './LiveResults.module.css';

function LiveResults({ results }) {
  if (!results) return null;

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className={styles.wrapper}>
      {Object.entries(results).map(([option, count]) => {
        const percentage = totalVotes === 0 ? 0 : (count / totalVotes) * 100;
        return (
          <div key={option} className={styles.resultItem}>
            <div className={styles.labelContainer}>
              <span className={styles.optionText}>{option}</span>
              <span className={styles.percentageText}>{percentage.toFixed(1)}%</span>
            </div>
            {/* <div className={styles.progressBar}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${percentage}%` }}
              />
            </div> */}
          </div>
        );
      })}
    </div>
  );
}

export default LiveResults;