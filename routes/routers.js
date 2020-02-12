const express = require('express'),
      router = express.Router(),
      User = require('../core/user'),
      user = new User(),
      userMiddleware = require('../core/userMiddleware');

userMiddleware.getUser(user);

var errors = [];

router.get('/', (req, res, next) => {
    let User = req.session.user;
    errors = [];
    // If there is a session named 'user' that means the user is logged in. 
    // so we redirect him to home page by using /home route below
     for (let [key, value] of Object.entries(req.session)) {
            console.log(`${key}: ${value}`);
        }
   if (User) {

        res.redirect('/home');
        return;
   }
    // IF not we just send the index page.
    
   res.render('index', {
       errors: errors
   });
});

router.get('/loggout', userMiddleware.isAuthorized, (req, res, next) => {
    res.redirect('/');
});

router.get('/home', (req, res, next) => {
    let User = req.session.user;
    errors = [];

    if (User) {
        for (let [key, value] of Object.entries(req.session)) {
            console.log(`${key}: ${value}`);
        }
        userMiddleware.getHistory(user, errors, function(result) {
            result.forEach(mess => {
                if(mess.Message.charAt(0) == "w") {
                    mess.Message = `<span class='whisper'><div><b>${mess.Login}: </b> ${mess.Message.substr(1)}</div></span>`;
                }
                else mess.Message = `<div><b>${mess.Login}: </b> ${mess.Message}</div>`;
            });
            res.render('home',{
                name: User.Login,
                userId: User.idUser,
                errors: errors,
                messages: result
            });
        });
   }
    else res.redirect('/');
});

router.post('/register', (req, res, next) => {
    errors = [];
    let login = req.body.login;
    let pwd = req.body.password;
    
    new Promise(function(resolve, reject) {
        user.create(login, pwd, function (created) {
            if (created != null) {
                user.find(login, function (result) {
                    req.session.user = result;
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
        res.redirect('/');
    })
    .catch(function(errors) {
        errors.push(new Error("Can`t create a new user. Change your data or contact us! Error code" + errors));
    });  
    
});

router.post('/login', (req, res, next) => {
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
            req.session.user = result;
        }
        res.redirect('/');
    });
});


module.exports = router;