const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { formatMessage } = require('./utils/message');
const { addUser, getUser, removeUser, getRoomUsers } = require('./utils/user');

const PORT = process.env.PORT || 3000;
const BOT_NAME = 'ChatCord Bot';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = addUser({ id: socket.id, username, room });

    socket.join(user.room);

    socket.emit('message', formatMessage(BOT_NAME, 'Welcome to the chat app'));

    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(BOT_NAME, `${user.username} has joined the chat`)
      );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on('chatMessage', msg => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(BOT_NAME, `${user.username} was disconnected`)
      );

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
