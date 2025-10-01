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
        alert("Please fill in the question, at least two options, and select one correct answer.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <IntervuePollTag />
        <h1 className={styles.title}>Let's <strong>Get Started</strong></h1>
        <p className={styles.subtitle}>You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>
        
        <div className={styles.questionRow}>
          <div className={styles.questionInputSection}>

            <div className={styles.mycontainer}>
            <label htmlFor="question" className={styles.label}>Enter your question</label>
            <span className={styles.timeLimitSection}>
            <label htmlFor="timeLimit" className={styles.label}>&nbsp;</label>
            <select 
                id="timeLimit" 
                className={styles.select} 
                value={timeLimit} 
                onChange={(e) => setTimeLimit(Number(e.target.value))}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
            </select>
          </span>
          </div>


            <textarea 
                id="question" 
                className={styles.textarea} 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                maxLength="100"
                required 
            />
            <span className={styles.charCounter}>{question.length}/100</span>
          </div>
          
        </div>

        <div>
            <div className={styles.optionsHeader}>
                <div className={styles.label}>Edit Options</div>
                <div className={styles.label}>Is It Correct?</div>
            </div>
            <div>
                {options.map((option, index) => (
                <div key={option.id} className={styles.optionInputContainer}>
                    <div className={styles.optionNumber}>{index + 1}</div>
                    <div className={styles.optionInputGroup}>
                        <input type="text" value={option.value} onChange={(e) => handleOptionChange(option.id, e.target.value)} required />
                    </div>
                    <div className={styles.correctAnswerGroup}>
                        <label className={styles.radioLabel}>
                          <input type="radio" name="correctAnswer" checked={correctAnswerId === option.id} onChange={() => setCorrectAnswerId(option.id)} required/> Yes
                        </label>
                        <label className={styles.radioLabel}>
                          <input type="radio" name={`isCorrect-no-${option.id}`} checked={correctAnswerId !== option.id && correctAnswerId !== null} readOnly /> No
                        </label>
                    </div>
                </div>
                ))}
                <button type="button" className={styles.addOptionButton} onClick={handleAddOption}>+ Add More option</button>
            </div>
        </div>
        
        <hr className={styles.divider} />

        <div className={styles.buttonContainer}>
            <button className={styles.askButton} type="submit">Ask Question</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePoll;