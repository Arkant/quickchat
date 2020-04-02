const express = require('express');

const app = express();

const server = app.listen(3001, () => {
  console.log('server running on port 3001');
});
const io = require('socket.io')(server);
const bodyParser = require('body-parser'),
User = require('../quickchat-feature-client-ui/core/user.js'),
user = new User();

app.use(express.urlencoded( { extended : false}));
app.use(bodyParser.json());

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

app.get('/db_messages', (req, res, next) => {

});

app.post('/sign-up', (req, res, next) => {
    errors = [];
    let login = req.body.login;
    let pwd = req.body.password;

    new Promise(function(resolve, reject) { 
        user.create(login, pwd, function (created) {
            if (created != null) {
                user.find(login, function (result) {
                    //req.session.user = result;
                    resolve(result);
                    console.log("user has been successfully created!");
                });
            } else {
                console.log("User already exists or database error!");
                errors.push(new Error("User already exists!"));
                resolve(errors);
            }
        });
    })
    .then(function(result) {
        return result.Login ? result.Login : errors;
    })
    .catch(function(errors) {
        errors.push(new Error("Can`t create a new user. Change your data or contact us! Error code" + errors));
    });  
});

app.post('/login', (req, res, next) => {
  errors = [];
  let login = req.body.login;
  let pwd = req.body.password;

  user.login(login, pwd, function(result) {
      if(result == 0) { // incorrect password
          errors.push(new Error('Password is incorrect!'));
      }
      else if(result == null) { // user is not registered
          errors.push(new Error('User is not registered yet!'));
      }
      else { // everythin is OK
          console.log("Everything is OK!");
          //req.session.user = result;
      }
      return result.Login ? result.Login : errors;
  });
});

app.get('/loggout', user.isAuthorized, (req, res, next) => {
  res.redirect('/');
});

app.get('/db_messages', (req, res, next) => {
  user.getHistory(user, errors, function(result) {
    result.forEach(mess => {
        mess.Message = `<div><b>${mess.Login}: </b> ${mess.Message}</div>`;
    });
    return result;
});
});

//.get('/db_messages') => () => [{username, message}];
//.post('/sign-up') => [{username, password}]; => username;
//.post('/login') => [{username, password}]; => username; 

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
