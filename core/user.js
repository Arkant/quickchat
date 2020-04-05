const pool = require('./pool'),
      bcrypt = require('bcryptjs');

function User() {};

User.prototype = {
    find: function(login, callback) {
        let sql = `select * from user where Login = "${login}"`;
        console.log("sql = ", sql);
        pool.query(sql, function (err, result) {
            if(err) {
                console.log("user.js find error!" + err);
                callback(null);
            }
            else if(result.length) {
                console.log("result (length) = ");
                for (let [key, value] of Object.entries(result[0])) {
                    console.log(`${key}: ${value}`);
                }
                callback(result[0]);
                }
            else {
                console.log("else = " + result);
                callback(null);
            }
        });
    },
    login: function(login, password, callback) {
         // find the user data by his username.
         this.find(login, function (user) {
            // if there is a user by this username.
            if (user) {
                // now we check his password.

                if (bcrypt.compareSync(password, user.Password)) {
                    // return his data.
                    callback(user);
                    return;
                } else {
                    console.log("Password is incorrect!");
                    callback(0);
                    return;
                }
            } else {
                console.log("User doesn`t exist!");
                callback(null);
                return;
            }


        });
    },
    create: function(login, password, callback) {
        this.find(login, function(result) {
            if(result) {
                console.log("User was detected! Not unique!");
                callback(null);
            }
            else {
                let pwd = bcrypt.hashSync(password, 10);
                let sql = `insert into user(Login, Password) values("${login}", "${pwd}")`;

                pool.query(sql, function (err, result) {
                    if(err) {
                        console.log("user.js create error!" + err);
                        callback(null);
                    }
                    callback(0);
                });
            }
        });
    },
    saveMessage: function(idUser, message) {
        let sql = `insert into messages(idUser, Message, DateTime) values("${idUser}", "${message}", NOW())`;

        pool.query(sql, function(err, result) {
            if(err) {
                console.log("user.js saveMessage error!" + err);
                this.sent = false;
            }
            this.sent = true;
            console.log("Message was succesfully saved! " + this.sent);
        });
    },
    sent: false,
    deleteHistory: function(callback) {
        let sql = `delete from messages where IDmessage >= 0`;
        pool.query(sql, function(err, result) {
            if(err) {
                console.log("User.js deleteHistory error!" + err);
                callback([1, err]);
            } else
            callback(0);
        });
    },
    isAuthorized: function(req, res, next) {
        if(req.session.user) {
            console.log(req.session.user);
            // destroy the session and redirect the user to the index page.
            req.session.destroy(function() {
                next();
            });
        } else next();
    },
    checkHistory: function(errors, callback) {
        let sql = `select DATE(DateTime) as LastMsg from messages ORDER BY idUser DESC LIMIT 1; select DATE(NOW()) as Now;`;
        let currUser = this;
        console.log(errors, "ERRORS CHECKHISTORY")
        pool.query(sql, function(err, result) {
            if(err) {
                console.log("User.js checkHistory error!" + err);
                callback([1, err]);
            }
            else if((result[0])[0] != undefined) {
                if(((result[0])[0].LastMsg).toString() == ((result[1])[0].Now).toString()) {
                    console.log(result);
                    callback([0]);
                } else {
                    console.log("They`re gonna be cleared all.....");
                    currUser.deleteHistory(function(deleted) {
                        if(deleted[0]) {
                            callback([1, deleted[1]]);
                        }
                        else callback([0]);
                    });
                }
            }
            else callback([0]);
        });
    },
    getHistory: function(user, errors, callback) {
        let currUser = this;
        new Promise(function(resolve, reject) {
            currUser.checkHistory(errors, function(result) {
                if(result[0]) {
                    errors.push(new Error("Can`t load messages history!" + result[1]));
                } else {
                    console.log("History was loaded successfully...");
                }
                console.log(result);
                resolve(result[1]);
            });
        })        
        .then(function(result) {
            let sql = `select Login, Message, DateTime from messages, user where user.idUser = messages.idUser`;
        
            pool.query(sql, function(err, result) {
                if(err) {
                    console.log("User.js getHistory error!" + err);
                    errors.push(new Error("GetHistory error!" + err));
                    callback([1, err]);
                }
                callback([0, result]);
            });
        })
        .catch(function(err) {
            console.log("User.js getHistory error!" + err);
            callback([1, err]);
        });
    }
}

module.exports = User;