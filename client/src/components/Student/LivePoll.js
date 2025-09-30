import React, { useState, useEffect } from 'react';
import styles from './LivePoll.module.css';

function LivePoll({ poll, results, onSubmit, hasAnswered, isPollEnded }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(poll.timeLimit);

  useEffect(() => {
    setTimeLeft(poll.timeLimit);
  }, [poll]);

  useEffect(() => {
    if (timeLeft <= 0 || isPollEnded) {
      if (timeLeft !== 0) setTimeLeft(0);
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime > 0 ? prevTime - 1 : 0);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isPollEnded]);

  const totalVotes = results ? Object.values(results).reduce((sum, count) => sum + count, 0) : 0;
  const showResults = hasAnswered || isPollEnded || timeLeft === 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span><strong>Question 1</strong></span>
        <span className={styles.timer}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
      </div>

      {/* The wrapper div is now removed from around these two sections */}
      <div className={styles.questionBox}>{poll.question}</div>

      {!showResults ? (
        // --- VOTING VIEW ---
        <>
          <div className={styles.optionsContainer}>
            {poll.options.map((option, index) => (
              <div
                key={option}
                className={`${styles.optionItem} ${styles.selectable} ${selectedOption === option ? styles.selected : ''}`}
                onClick={() => setSelectedOption(option)}
              >
                <div className={styles.optionNumber}>{index + 1}</div>
                <span className={styles.optionText}>{option}</span>
              </div>
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.submitButton}
              onClick={() => onSubmit(selectedOption)}
              disabled={!selectedOption}
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        // --- RESULTS VIEW ---
        <>
          <div className={styles.optionsContainer}>
            {poll.options.map((option, index) => {
              const percentage = totalVotes === 0 ? 0 : ((results[option] || 0) / totalVotes) * 100;
              return (
                <div key={option} className={styles.optionItem}>
                  <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>
                  <div className={styles.optionNumber}>{index + 1}</div>
                  <span className={styles.optionText}>{option}</span>
                  <span className={styles.percentageText}>{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
          <p className={styles.waitMessage}>Wait for the teacher to ask a new question..</p>
        </>
      )}
    </div>
  );
}

export default LivePoll;