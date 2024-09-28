const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Track the number of connected users
let users = 0;

io.on('connection', (socket) => {
  users++; // Increment user count when a new user connects
  console.log(`A user connected, total users: ${users}`);

  // Broadcast to everyone that a new user has connected
  io.emit('chat message', `A new user has joined the chat. Current users: ${users}`);

  // Handle incoming messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    users--; // Decrement user count when a user disconnects
    console.log(`A user disconnected, total users: ${users}`);
    io.emit('chat message', `A user has left the chat. Current users: ${users}`);
  });
});

server.listen(port, () => {
  console.log(`Real-time app running on port ${port}`);
});
