const socket = io();

const messagesDiv = document.getElementById('messages');
const usernameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

function renderMessage(msg) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.innerHTML = `<span class="username">${msg.username}:</span> ${msg.text}`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const username = usernameInput.value.trim() || 'Anonymous';
  const text = messageInput.value.trim();
  if (!text) return;

  const msg = { username, text };
  socket.emit('send message', msg);
  messageInput.value = '';
}

socket.on('load messages', (msgs) => msgs.forEach(renderMessage));
socket.on('new message', (msg) => renderMessage(msg));

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
