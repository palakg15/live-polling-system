const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use(cors());
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://live-polling-system-2-wey0.onrender.com"],
    methods: ["GET", "POST"]
  }
});

// State Management
let teacherSocketId = null;
let students = {};
let currentQuestion = null;
let pollTimer;
let pollHistory = [];

io.on('connection', (socket) => {
  console.log(`✅ New client connected: ${socket.id}`);

  // Teacher Events
  socket.on('teacher:join', () => {
    teacherSocketId = socket.id;
    console.log(`👩‍🏫 Teacher joined: ${socket.id}`);
    socket.emit('server:studentUpdate', students);
  });

  socket.on('teacher:askQuestion', (pollData) => {
    if (currentQuestion) {
      pollHistory.push(currentQuestion);
    }
    console.log('❓ Question Asked:', pollData.question, `for ${pollData.timeLimit}s`);
    if (pollTimer) clearTimeout(pollTimer);

    currentQuestion = pollData;
    currentQuestion.results = {};
    pollData.options.forEach(option => {
      currentQuestion.results[option] = 0;
    });

    Object.keys(students).forEach(studentSocketId => {
      io.to(studentSocketId).emit('server:newQuestion', currentQuestion);
    });
    io.emit('server:resultsUpdate', currentQuestion.results);

    pollTimer = setTimeout(() => {
      console.log('⏰ Poll ended for:', currentQuestion.question);
      io.emit('server:pollEnded', currentQuestion.results);
    }, pollData.timeLimit * 1000);
  });
  
  socket.on('teacher:kickStudent', (studentSocketId) => {
    if (socket.id === teacherSocketId) {
      const studentSocket = io.sockets.sockets.get(studentSocketId);
      if (studentSocket) {
        studentSocket.emit('server:youWereKicked');
        studentSocket.disconnect(true);
      }
    }
  });

  socket.on('teacher:getHistory', () => {
    if (socket.id === teacherSocketId) {
      socket.emit('server:pollHistory', pollHistory);
    }
  });

  // Student Events
  socket.on('student:join', (payload) => {
    students[socket.id] = { name: payload.name };
    console.log(`🙋 Student Joined: ${payload.name} (${socket.id})`);
    if (teacherSocketId) {
      io.to(teacherSocketId).emit('server:studentUpdate', students);
    }
  });

  socket.on('student:submitAnswer', (payload) => {
    const { answer } = payload;
    if (currentQuestion && typeof currentQuestion.results[answer] !== 'undefined') {
      currentQuestion.results[answer]++;
      io.emit('server:resultsUpdate', currentQuestion.results);
    }
  });

  // Chat Event
  socket.on('chat:sendMessage', (payload) => {
    console.log(`💬 Chat message from ${payload.sender}: ${payload.message}`);
    io.emit('chat:newMessage', payload);
  });

  // Disconnect Event
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    if (students[socket.id]) {
      delete students[socket.id];
      if (teacherSocketId) {
        io.to(teacherSocketId).emit('server:studentUpdate', students);
      }
    }
    if (socket.id === teacherSocketId) {
      teacherSocketId = null;
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});