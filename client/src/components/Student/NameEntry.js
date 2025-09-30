import React, { useState } from 'react';
import styles from './NameEntry.module.css';
import IntervuePollTag from '../common/IntervuePollTag';

function NameEntry({ onJoin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <IntervuePollTag />
        <h1 className={styles.title}>Let's <strong>Get Started</strong></h1>
        <p className={styles.subtitle}>If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates.</p>

        {/* New structure for the input field */}
        <div className={styles.inputGroup}>
          <label htmlFor="studentName" className={styles.label}>Enter your Name</label>
          <input
            id="studentName"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button className={styles.continueButton} type="submit">Continue</button>
      </form>
    </div>
  );
}

export default NameEntry;