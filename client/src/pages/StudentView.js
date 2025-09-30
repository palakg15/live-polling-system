import React, { useState, useEffect } from 'react';
import socket from '../socket/socket';
import NameEntry from '../components/Student/NameEntry';
import LivePoll from '../components/Student/LivePoll';
import Chat from '../components/common/Chat';
import IntervuePollTag from '../components/common/IntervuePollTag';

function StudentView() {
  const [hasJoined, setHasJoined] = useState(false);
  const [name, setName] = useState('');
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isPollEnded, setIsPollEnded] = useState(false);
  const [wasKicked, setWasKicked] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('server:newQuestion', (pollData) => {
      setPoll(pollData);
      setResults(pollData.results);
      setHasAnswered(false);
      setIsPollEnded(false);
    });
    socket.on('server:resultsUpdate', (updatedResults) => {
      setResults(updatedResults);
    });
    socket.on('server:pollEnded', () => {
      setIsPollEnded(true);
    });
    socket.on('server:youWereKicked', () => {
      setWasKicked(true);
    });

    return () => {
      socket.off('server:newQuestion');
      socket.off('server:resultsUpdate');
      socket.off('server:pollEnded');
      socket.off('server:youWereKicked');
      socket.disconnect();
    };
  }, []);

  const handleJoin = (enteredName) => {
    socket.emit('student:join', { name: enteredName });
    setName(enteredName);
    setHasJoined(true);
  };

  const handleAnswerSubmit = (answer) => {
    if (!answer) return;
    socket.emit('student:submitAnswer', { answer });
    setHasAnswered(true);
  };

  const renderMainContent = () => {
    if (wasKicked) {
      return (
        <div style={{ color: 'var(--text-dark)', textAlign: 'center', backgroundColor: 'white', padding: '3rem', borderRadius: '12px' }}>
          <IntervuePollTag />
          <h1>You've been Kicked out!</h1>
          <p>The teacher has removed you from the poll system.</p>
        </div>
      );
    }
    
    if (!hasJoined) {
      return <NameEntry onJoin={handleJoin} />;
    }
    
    if (!poll) {
      return (
         <div style={{ color: 'var(--text-dark)', textAlign: 'center', backgroundColor: 'white', padding: '4rem 3rem', borderRadius: '12px', width: '550px' }}>
            <IntervuePollTag />
            <h2 style={{marginTop: '2rem'}}>Welcome, {name}!</h2>
            <p>Please wait for the teacher to start the poll...</p>
         </div>
      );
    }
    
    return (
      <LivePoll 
        poll={poll} 
        results={results} 
        onSubmit={handleAnswerSubmit} 
        hasAnswered={hasAnswered}
        isPollEnded={isPollEnded}
      />
    );
  }

  return (
    <>
      {renderMainContent()}
      {hasJoined && !wasKicked && <Chat userName={name} />}
    </>
  );
}

export default StudentView;