import React, { useState } from 'react';
import styles from './CreatePoll.module.css';
import IntervuePollTag from '../common/IntervuePollTag';

function CreatePoll({ onAsk }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { id: 1, value: '' },
    { id: 2, value: '' },
  ]);
  const [correctAnswerId, setCorrectAnswerId] = useState(null);
  const [IncorrectAnswerId, setIncorrectAnswerId] = useState(null);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleOptionChange = (id, value) => {
    setOptions(options.map(opt => (opt.id === id ? { ...opt, value } : opt)));
  };

  const handleAddOption = () => {
    setOptions([...options, { id: Date.now(), value: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pollOptions = options.map(opt => opt.value).filter(val => val.trim() !== '');
    const correctAnswerValue = options.find(opt => opt.id === correctAnswerId)?.value;

    if (question.trim() && pollOptions.length >= 2 && correctAnswerValue) {
      onAsk({ 
        question, 
        options: pollOptions, 
        timeLimit, 
        correctAnswer: correctAnswerValue 
      });
    } else {
        alert("Please fill in the question, at least two options, and select a correct answer.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <IntervuePollTag />
        <h1 className={styles.title}>Let's Get Started</h1>
        <p className={styles.subtitle}>You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>
        
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="question" className={styles.label}>Enter your question</label>
          <textarea id="question" className={styles.textarea} value={question} onChange={(e) => setQuestion(e.target.value)} required />
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <div className={styles.label}><b>Edit Options</b></div>
            {options.map((option, index) => (
            <div key={option.id} className={styles.optionInputContainer}>
                <div className={styles.optionInput}>
                    <div className={styles.index}>{index + 1}</div>
                    <input type="text" value={option.value} onChange={(e) => handleOptionChange(option.id, e.target.value)} required />
                </div>
                <div className={styles.correctAnswerGroup}>
                    <label>Is It Correct?</label>
                    <input type="radio" id={`yes-${option.id}`} name="correctAnswer" checked={correctAnswerId === option.id} onChange={() => setCorrectAnswerId(option.id)} required/>
                    <label htmlFor={`yes-${option.id}`}>Yes</label>

                    <input type="radio" id={`no-${option.id}`} name="incorrectAnswer" checked={IncorrectAnswerId === option.id} onChange={() => setIncorrectAnswerId(option.id)} />
                    <label htmlFor={`no-${option.id}`}>No</label>
                </div>
            </div>
            ))}
            <button type="button" className={styles.addOptionButton} onClick={handleAddOption}>+ Add More option</button>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="timeLimit" className={styles.label}>Time limit</label>
            <select id="timeLimit" className={styles.select} value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
            </select>
        </div>

        <button className={`${styles.askButton} ${styles.fullWidth}`} type="submit">Ask Question</button>
      </form>
    </div>
  );
}

export default CreatePoll;