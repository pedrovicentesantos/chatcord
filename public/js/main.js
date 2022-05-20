const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomUsers = document.querySelector('#users');
const msgTextArea = document.querySelector('#msg');

const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
  addRoomToDOM(room);
  roomUsers.innerHTML = '';
  users.forEach(addRoomUserToDOM);
});

socket.on('message', message => {
  addMessageToDOM(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const message = e.target.elements.msg.value;

  socket.emit('chatMessage', message);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

msgTextArea.addEventListener('keydown', e => {
  if (e.keyCode === 13 && e.ctrlKey) {
    chatForm.dispatchEvent(new Event('submit'));
  }
});

const addMessageToDOM = message => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

const addRoomToDOM = room => {
  const roomName = document.querySelector('#room-name');
  roomName.innerText = room;
};

const addRoomUserToDOM = user => {
  const li = document.createElement('li');
  li.innerText = user.username;
  roomUsers.appendChild(li);
};
