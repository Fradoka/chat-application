import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory messages
let messages = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing messages to new client
  socket.emit('load messages', messages);

  socket.on('send message', (msg) => {
    messages.push(msg);
    io.emit('new message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
