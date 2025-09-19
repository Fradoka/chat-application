import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
// Enable CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://fradoka-group-chat-app-frontend.hosting.codeyourfuture.io"], // allowed frontend URLs
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: ["http://localhost:3000", "https://fradoka-group-chat-app-frontend.hosting.codeyourfuture.io"]
}));


// In-memory messages
let messages = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing messages to new client
  socket.emit('load messages', messages);

  socket.on('send message', (msg) => {
    const newMsg = {
      id: Date.now(), // unique ID
      username: msg.username,
      text: msg.text,
      likes: 0,
      dislikes: 0
    };
    messages.push(newMsg);
    io.emit('new message', newMsg);
  });

  // Like/dislike event
  socket.on('update reaction', ({ id, type }) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    if (type === 'like') msg.likes++;
    if (type === 'dislike') msg.dislikes++;
    io.emit('reaction updated', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
