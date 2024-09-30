const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server);

app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});

app.use(express.static('public'));

let users = 0;

io.on('connection', (socket) => {
  users++;
  io.emit('user count', users);

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('typing', { id: socket.id, isTyping });
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { id: socket.id, message: msg });
  });

  // Handle media sharing
  socket.on('media', (mediaUrl) => {
    io.emit('media', { id: socket.id, mediaUrl });
  });

  // Handle message reactions
  socket.on('react', (reaction) => {
    io.emit('react', reaction);
  });

  socket.on('disconnect', () => {
    users--;
    io.emit('user count', users);
  });
});

server.listen(port, () => {
  console.log(`Real-time app running on port ${port}`);
});
