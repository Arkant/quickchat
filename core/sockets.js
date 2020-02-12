const express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server),
      User = require('./user'),
      user = new User();

var connections = [],
users = {};

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log(`User successfully connected...`);
    
    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        console.log(`User successfully disconnected...`);
    });

    socket.on('send mess', function(data, callback) {
        users[data.name] = socket;
        var msg = data.msg.trim();
        if(msg.substr(0,3) === '/w ') {
            msg = msg.substr(3);
            let ind = msg.indexOf(' ');
            if(ind != -1) {
                let name = msg.substring(0, ind);
                let msg2 = msg.substring(ind+1);

                if(name in users) {
                    users[name].emit('whisper', {msg: msg2, name: data.name});
                    user.saveMessage(data.userID, 'w ' + msg2);
                    console.log("whisper");
                } else {
                    callback('Error! Enter a valid user!');
                }
            } else {
                callback('Error: Please enter a mesage for your whisper.');
            }
        } else {
            io.sockets.emit('add mess', {msg: data.msg, name: data.name});
            console.log(data);
            user.saveMessage(data.userID, data.msg);
        }
    });
});

module.exports = {app, server, express};