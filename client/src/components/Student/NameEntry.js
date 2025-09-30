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
        <h1 className={styles.title}>Let's Get Started</h1>
        <p className={styles.subtitle}>Enter your name, and you'll be ready to answer the questions once the poll starts.</p>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your Name"
          required
        />
        <button className={styles.continueButton} type="submit">Continue</button>
      </form>
    </div>
  );
}

export default NameEntry;