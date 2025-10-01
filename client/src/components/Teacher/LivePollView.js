import React, { useState, useEffect } from 'react';
import socket from '../../socket/socket';
import LiveResults from '../common/LiveResults';
import styles from './LivePollView.module.css';

function LivePollView({ poll, onAskNew, onShowHistory }) {
  const [results, setResults] = useState(null);
  const [isPollEnded, setIsPollEnded] = useState(false);

  useEffect(() => {
    const resultsListener = (updatedResults) => setResults(updatedResults);
    const pollEndedListener = () => setIsPollEnded(true);

    socket.on('server:resultsUpdate', resultsListener);
    socket.on('server:pollEnded', pollEndedListener);
    
    // Set initial results when the component mounts
    setResults(poll.results);
    setIsPollEnded(false); // Reset for new polls

    return () => {
      socket.off('server:resultsUpdate', resultsListener);
      socket.off('server:pollEnded', pollEndedListener);
    };
  }, [poll]);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}></div>
      <button className={styles.historyButton} onClick={onShowHistory}>
    <span role="img" aria-label="View">👁️</span>
    View Poll History
  </button>
      
      <div className={styles.questionLabel}>Question</div>
      <LiveResults 
        question={poll.question}
        results={results} 
        correctAnswer={poll.correctAnswer}
        isPollEnded={isPollEnded}
      />

      <button className={styles.newQuestionButton} onClick={onAskNew}>
        + Ask a new question
      </button>
    </div>
  );
}

export default LivePollView;