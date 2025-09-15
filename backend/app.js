import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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
