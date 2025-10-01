import React, { useState, useEffect, useRef } from 'react';
import socket from '../../socket/socket';
import styles from './Chat.module.css';

// The component now accepts students and the onKickStudent function
function Chat({ userName, students = [], onKickStudent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Chat'); // 'Chat' or 'Participants'
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const messageListener = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on('chat:newMessage', messageListener);
    return () => { socket.off('chat:newMessage', messageListener); };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      socket.emit('chat:sendMessage', { sender: userName, message: currentMessage.trim() });
      setCurrentMessage('');
    }
  };

  return (
    <>
      <button className={styles.chatIcon} onClick={() => setIsOpen(!isOpen)}>💬</button>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.tabHeader}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'Chat' ? styles.active : ''}`}
              onClick={() => setActiveTab('Chat')}
            >
              Chat
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'Participants' ? styles.active : ''}`}
              onClick={() => setActiveTab('Participants')}
            >
              Participants
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'Chat' ? (
              <>
                <div className={styles.messagesContainer}>
                  {messages.map((msg, index) => (
                    <div key={index} className={
            msg.sender === "Teacher" 
                ? styles.message 
                : `${styles.message} ${styles.studentRow}`
        }>
                       <div className={msg.sender == "Teacher"? styles.messageSender : styles.studentSender}>{msg.sender}</div>
                      <div className={msg.sender == "Teacher"? styles.messageText : styles.studentText}>{msg.message}</div>
                      
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form className={styles.chatForm} onSubmit={handleSendMessage}>
                  <input type="text" className={styles.chatInput} placeholder="Type a message..." value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
                  <button type="submit" className={styles.sendButton}>Send</button>
                </form>
              </>
            ) : (
              <ul className={styles.participantList}>
                {students.map(([socketId, studentInfo]) => (
                  <li key={socketId} className={styles.participantItem}>
                    <span>{studentInfo.name}</span>
                    {/* Only show kick button if the handler is provided (i.e., for the teacher) */}
                    {onKickStudent && (
                      <button className={styles.kickButton} onClick={() => onKickStudent(socketId)}>
                        Kick
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;