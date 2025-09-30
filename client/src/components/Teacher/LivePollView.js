import React, { useState, useEffect } from 'react';
import socket from '../../socket/socket';
import LiveResults from '../common/LiveResults';
import styles from './LivePollView.module.css';

function LivePollView({ poll, onAskNew, onKickStudent, onShowHistory }) {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState(null);
  const [isPollEnded, setIsPollEnded] = useState(false);

  useEffect(() => {
    const studentUpdateListener = (updatedStudents) => setStudents(Object.entries(updatedStudents));
    const resultsListener = (updatedResults) => setResults(updatedResults);
    const pollEndedListener = () => setIsPollEnded(true);

    socket.on('server:studentUpdate', studentUpdateListener);
    socket.on('server:resultsUpdate', resultsListener);
    socket.on('server:pollEnded', pollEndedListener);

    socket.emit('teacher:join');

    return () => {
      socket.off('server:studentUpdate', studentUpdateListener);
      socket.off('server:resultsUpdate', resultsListener);
      socket.off('server:pollEnded', pollEndedListener);
    };
  }, [poll]);

  return (
    <div className={styles.container}>
      <button className={styles.historyButton} onClick={onShowHistory}>
        View Poll History
      </button>
      <h2 className={styles.questionTitle}>{poll.question}</h2>
      
      <LiveResults 
        results={results} 
        correctAnswer={poll.correctAnswer}
        isPollEnded={isPollEnded}
      />

      <div className={styles.participantsContainer}>
        <h3 className={styles.participantsTitle}>Participants ({students.length})</h3>
        <ul className={styles.participantsList}>
          {students.map(([socketId, studentInfo]) => (
            <li key={socketId} className={styles.participantItem}>
              <span>{studentInfo.name}</span>
              <button 
                className={styles.kickButton}
                onClick={() => onKickStudent(socketId)}
              >
                Kick
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button className={styles.newQuestionButton} onClick={onAskNew}>
        + Ask a new question
      </button>
    </div>
  );
}

export default LivePollView;