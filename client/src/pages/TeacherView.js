import React, { useState, useEffect } from 'react';
import socket from '../socket/socket';
import CreatePoll from '../components/Teacher/CreatePoll';
import LivePollView from '../components/Teacher/LivePollView';
import PollHistoryView from '../components/Teacher/PollHistoryView';
import Chat from '../components/common/Chat';

function TeacherView() {
  const [poll, setPoll] = useState(null);
  const [students, setStudents] = useState([]); // This was the missing line
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.emit('teacher:join');

    const studentUpdateListener = (updatedStudents) => setStudents(Object.entries(updatedStudents));
    const historyListener = (pollHistoryData) => setHistory(pollHistoryData);

    socket.on('server:studentUpdate', studentUpdateListener);
    socket.on('server:pollHistory', historyListener);

    return () => {
      socket.off('server:studentUpdate', studentUpdateListener);
      socket.off('server:pollHistory', historyListener);
      socket.disconnect();
    };
  }, []);

  const handleAskQuestion = (pollData) => {
    socket.emit('teacher:askQuestion', pollData);
    setPoll(pollData);
  };
  
  const handleAskNewQuestion = () => {
    setPoll(null);
  };
  
  const handleKickStudent = (studentSocketId) => {
    socket.emit('teacher:kickStudent', studentSocketId);
  };

  const handleShowHistory = () => {
    socket.emit('teacher:getHistory');
    setShowHistory(true);
  };

  return (
    <>
      {!poll ? (
        <CreatePoll onAsk={handleAskQuestion} />
      ) : (
        <LivePollView 
          poll={poll} 
          onAskNew={handleAskNewQuestion}
          onKickStudent={handleKickStudent}
          onShowHistory={handleShowHistory}
        />
      )}
      {showHistory && <PollHistoryView history={history} onClose={() => setShowHistory(false)} />}
      <Chat 
        userName="Teacher" 
        students={students} 
        onKickStudent={handleKickStudent} 
      />
    </>
  );
}

export default TeacherView;