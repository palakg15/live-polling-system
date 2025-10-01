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
  const [students, setStudents] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isPollEnded, setIsPollEnded] = useState(false);
  const [wasKicked, setWasKicked] = useState(false);

  useEffect(() => {
    socket.connect();

    const newQuestionListener = (pollData) => {
      setPoll(pollData);
      setResults(pollData.results);
      setHasAnswered(false);
      setIsPollEnded(false);
    };
    const resultsUpdateListener = (updatedResults) => setResults(updatedResults);
    const pollEndedListener = () => setIsPollEnded(true);
    const kickedListener = () => setWasKicked(true);
    const studentUpdateListener = (updatedStudents) => setStudents(Object.entries(updatedStudents));

    socket.on('server:newQuestion', newQuestionListener);
    socket.on('server:resultsUpdate', resultsUpdateListener);
    socket.on('server:pollEnded', pollEndedListener);
    socket.on('server:youWereKicked', kickedListener);
    socket.on('server:studentUpdate', studentUpdateListener);

    return () => {
      socket.off('server:newQuestion', newQuestionListener);
      socket.off('server:resultsUpdate', resultsUpdateListener);
      socket.off('server:pollEnded', pollEndedListener);
      socket.off('server:youWereKicked', kickedListener);
      socket.off('server:studentUpdate', studentUpdateListener);
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
          <p>Looks like the teacher had removed you from the poll system. Please Try again sometime.</p>
        </div>
      );
    }
    
    if (!hasJoined) {
      return <NameEntry onJoin={handleJoin} />;
    }
    
    if (!poll) {
      return (
         <div className="card-container waiting">
            <IntervuePollTag />
            <div className="spinner"></div>
            <p>Wait for the teacher to ask questions..</p>
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
  };

  // This is a simple sub-component to render the avatars
  const ParticipantAvatars = ({ students }) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', gap: '-8px' }}>
          {students.slice(0, 3).map(([id, student]) => (
              <div key={id} style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-violet)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '600', border: '2px solid white'
              }}>
                  {student.name.charAt(0).toUpperCase()}
              </div>
          ))}
          {students.length > 3 && <div style={{marginLeft: '12px', color: 'var(--border-color)', fontWeight: '500'}}>+{students.length - 3}</div>}
      </div>
  );

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {hasJoined && <ParticipantAvatars students={students} />}
        {renderMainContent()}
        {hasJoined && !wasKicked && <Chat userName={name} students={students} />}
    </div>
  );
}

export default StudentView;