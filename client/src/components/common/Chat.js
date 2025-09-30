import React, { useState, useEffect, useRef } from 'react';
import socket from '../../socket/socket';
import styles from './Chat.module.css';

function Chat({ userName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const messageListener = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on('chat:newMessage', messageListener);
    return () => {
      socket.off('chat:newMessage', messageListener);
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      const payload = {
        sender: userName,
        message: currentMessage.trim(),
      };
      socket.emit('chat:sendMessage', payload);
      setCurrentMessage('');
    }
  };

  return (
    <>
      <button className={styles.chatIcon} onClick={() => setIsOpen(!isOpen)}>💬</button>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>Live Chat</div>
          <div className={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div key={index} className={styles.message}>
                <div className={styles.messageSender}>{msg.sender}</div>
                <div className={styles.messageText}>{msg.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.chatForm} onSubmit={handleSendMessage}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button type="submit" className={styles.sendButton}>Send</button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chat;