const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  socket.emit('message', 'Welcome to the chat app');

  socket.broadcast.emit('message', 'New user joined the chat');

  socket.on('disconnect', () => {
    io.emit('message', 'User was disconnected');
  });

  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
