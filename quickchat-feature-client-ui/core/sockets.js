const express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server),
      User = require('./user'),
      user = new User(),
      session = require("express-session")({
        secret:'chat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 3600000
        }
      }),
      sharedsession = require("express-socket.io-session"),
      cookie = require('cookie');

      // Attach session
      app.use(session);
      // Share session with io sockets
      io.use(sharedsession(session, {autoSave: true}));

var connections = [],
    users = {},
    cookies = [],
    logins = [];

io.sockets.on('connection', function(socket) {
    let cookief = socket.handshake.headers.cookie; 
    let cookieP = cookie.parse(cookief);
    let userA = socket.handshake.session.user;
    let loginA = userA.Login;   

    cookies.push(cookieP['connect.sid']);
    connections.push(socket);
    console.log(`User successfully connected...`);

    if(userA) {
        let check = logins.find(function(element){
            return element == loginA;
        });
        if(check == undefined) {
            logins.push(loginA);
            console.log("New user...");
            console.log(`Active users: ${logins}`);
            if(cookies.length > 0) {
                for(var i = 0; i < cookies.length-1; i++) {
                    if(cookies[i] == cookieP['connect.sid']) {
                        console.log(`${cookies[i]} == ${cookieP['connect.sid']}`);
                        console.log("Same user detected...");
                        let ind = logins.indexOf(loginA);
                        connections[ind].emit('dublicate', function(){});
                    }
                }
            }   
        }
        else {
            let ind = logins.indexOf(loginA);
            console.log(`Dublicate... ${ind} position`);
            console.log(`His socket is ${connections[ind]}`);
            logins.push(loginA);
            connections[ind].emit("dublicate", function(){});
        }
    }


    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        logins.splice(connections.indexOf(socket), 1);
        cookies.splice(connections.indexOf(socket), 1);
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

module.exports = {app, server, express, session};