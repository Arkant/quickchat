const express = require('express');

const app = express();

const server = app.listen(3001, () => {
  console.log('server running on port 3001');
});
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  io.emit('addition of connected user', socket.id);
  //   console.log('user connected to', roomname);
  socket.username = 'Anonymous';
  socket.on('change_username', (data) => {
    socket.username = data.username;
  });

  const time = (new Date()).toLocaleTimeString();

  socket.on('send_message', ({ username, message }) => {
    io.sockets.emit('send_message', {
      username,
      message,
    });
  });

//   socket.on('send admin message', (msg) => {
//     io.emit('send', msg);
//   });

//   socket.on('join room', (data) => {
//     socket.join(`room ${data.name}`);

//     console.log('admin connected to room', data.name);

//     io.to(`room ${data.name}`).emit('send', {
//       ...data,
//       event: 'private',
//       user: data.name,
//       time,
//       name: 'admin',
//     });
//   });

//   socket.on('operator logged out', () => {
//     socket.emit('clear all messages');
//   });

//   socket.on('disconnect', () => {
//     io.emit('delete users', username);
//     console.log('user disconnected');
//   });
});
