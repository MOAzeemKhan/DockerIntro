const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

// Create a server and socket.io instance
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle GET request for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Set up Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages from the client
  socket.on('chat message', (msg) => {
    console.log('Message: ' + msg);
    // Broadcast the message to everyone
    io.emit('chat message', msg);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Real-time app running on port ${port}`);
});
