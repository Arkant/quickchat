const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
const server = app.listen(3001, () => {
  console.log('server running on port 3001');
});
const io = require('socket.io')(server);
const bodyParser = require('body-parser'),
session = require('express-session'),
User = require('../core/user.js'),
user = new User();
var errors = [];
app.use(express.urlencoded( { extended : false}));
app.use(bodyParser.json());

app.use(session({
  secret:'chat',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 24 * 3600000
  }
}));

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
    // user.saveMessage(idUser, message); // тут бы в DATA пробросить нужно UserID, чтобы запись в БД сделать
  });
});

app.post('/sign-up', (req, res, next) => {
    errors = [];
    let username = req.body.username;
    let pwd = req.body.password;

    new Promise(function(resolve, reject) { 
        user.create(username, pwd, function (created) {
            if (created != null) {
                user.find(username, function (result) {
                    req.session.user = result;
                    resolve(result);
                    //console.log("user has been successfully created!");
                });
            } else {
                //console.log("User already exists or database error!");
                errors.push(new Error("User already exists!"));
                resolve(errors);
            }
        });
    })
    .then(function(result) {
      if(result.Login)
        res.status(200).send([result,"Authenticated"]);
      else
        res.status(403).send([errors,"Unauthenticated"]);
    })
    .catch(function(error) {
        errors.push(new Error("Can`t create a new user. Change your data or contact us! Error code" + error));
        res.status(500).send(['Internal Server Error' + errors,"Unauthenticated"]);
    });  
});

app.post('/login', (req, res, next) => {
  errors = [];
  let username = req.body.username;
  let pwd = req.body.password;

  user.login(username, pwd, function(result) {
      if(result == 0) { // incorrect password
          errors.push(new Error('Password is incorrect!'));
          res.status(403).send([errors,"Unauthenticated"]);
      }
      else if(result == null) { // user is not registered
          errors.push(new Error('User is not registered yet!'));
          res.status(403).send([errors,"Unauthenticated"]);
      }
      else { // everythin is OK
          console.log("Everything is OK!");
          res.status(200).send([result,"Authenticated"]);
          req.session.user = result;
      }
  });
});

app.get('/loggout', user.isAuthorized, (req, res, next) => {
  res.status(200).send("Unauthenticated");
});

app.get('/db_messages', (req, res, next) => {
  user.getHistory(user, errors, function(result) {
    console.log(result);
    res.status(200).send(result);
  });
});