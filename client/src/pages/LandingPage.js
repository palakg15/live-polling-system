import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css'; // This line is crucial
import IntervuePollTag from '../components/common/IntervuePollTag';

function LandingPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/${selectedRole.toLowerCase()}`);
    }
  };

  return (
    // This className connects the component to its stylesheet
    <div className={styles.container}>
      <IntervuePollTag />
      <h1 className={styles.title}>Welcome to the <strong>Live Polling System</strong></h1>
      <p className={styles.subtitle}>Please select the role that best describes you to begin using the live polling system</p>

      <div className={styles.rolesContainer}>
        <div
          className={`${styles.roleCard} ${selectedRole === 'Student' ? styles.selected : ''}`}
          onClick={() => setSelectedRole('Student')}
        >
          <h3>I'm a Student</h3>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
        </div>
        <div
          className={`${styles.roleCard} ${selectedRole === 'Teacher' ? styles.selected : ''}`}
          onClick={() => setSelectedRole('Teacher')}
        >
          <h3>I'm a Teacher</h3>
          <p>Submit answers and view live poll results in real-time.</p>
        </div>
      </div>

      <button
        className={styles.continueButton}
        onClick={handleContinue}
        disabled={!selectedRole}
      >
        Continue
      </button>
    </div>
  );
}

export default LandingPage;