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
        <span>Question 1</span>
        <span className={styles.timer}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
      </div>
      <h2 className={styles.questionTitle}>{poll.question}</h2>
      
      <div>
        {poll.options.map(option => {
          const voteCount = results ? results[option] : 0;
          const percentage = totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100;
          
          let optionClass = styles.optionButton;
          if (showResults) {
            if (option === poll.correctAnswer) {
              optionClass += ` ${styles.correct}`;
            }
          } else if (selectedOption === option) {
            optionClass += ` ${styles.selected}`;
          }

          return (
            <button
              key={option}
              className={optionClass}
              onClick={() => setSelectedOption(option)}
              disabled={showResults}
            >
              {showResults && <div className={styles.progressBar} style={{ width: `${percentage}%` }}></div>}
              <span className={styles.optionContent}>{option}</span>
            </button>
          );
        })}
      </div>

      {!showResults &&
        <button
          className={styles.submitButton}
          onClick={() => onSubmit(selectedOption)}
          disabled={!selectedOption}
        >
          Submit
        </button>
      }
    </div>
  );
}

export default LivePoll;