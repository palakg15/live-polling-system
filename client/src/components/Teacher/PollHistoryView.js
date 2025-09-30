import React from 'react';
import LiveResults from '../common/LiveResults';
import styles from './PollHistoryView.module.css';

function PollHistoryView({ history, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Poll History</h2>
        {history.length === 0 ? (
          <p>No past polls in this session yet.</p>
        ) : (
          history.map((poll, index) => (
            <div key={index} className={styles.historyItem}>
              <h3 className={styles.historyQuestionTitle}>Question {index + 1}: {poll.question}</h3>
              <LiveResults results={poll.results} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PollHistoryView;