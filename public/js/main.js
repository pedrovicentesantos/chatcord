const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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

const addMessageToDOM = message => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">UserName <span>Timestamp</span></p>
    <p class="text">
      ${message} 
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};
