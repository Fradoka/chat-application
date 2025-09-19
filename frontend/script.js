const socket = io("https://fradoka-group-chat-app-backend.hosting.codeyourfuture.io");

const messagesDiv = document.getElementById('messages');
const usernameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

function renderMessage(msg) {
  // Update if message already exists
  let existing = document.getElementById(`msg-${msg.id}`);
  if (existing) {
    existing.querySelector('.likes-count').textContent = msg.likes;
    existing.querySelector('.dislikes-count').textContent = msg.dislikes;
    return;
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.id = `msg-${msg.id}`;
  messageDiv.innerHTML = `<span class="username">${msg.username}:</span> ${msg.text}
    <div class="reactions">
      <button class="like-btn">👍 <span class="likes-count">${msg.likes}</span></button>
      <button class="dislike-btn">👎 <span class="dislikes-count">${msg.dislikes}</span></button>
    </div>`;

  // Like button
  messageDiv.querySelector('.like-btn').addEventListener('click', () => {
    socket.emit('update reaction', { id: msg.id, type: 'like' });
  });

  // Dislike button
  messageDiv.querySelector('.dislike-btn').addEventListener('click', () => {
    socket.emit('update reaction', { id: msg.id, type: 'dislike' });
  });

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
socket.on('reaction updated', (msg) => renderMessage(msg));

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
