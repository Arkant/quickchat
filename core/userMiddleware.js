module.exports.getUser = function(user) {
    module.exports.isAuthorized = function(req, res, next) {
        if(req.session.user) {
            console.log(req.session.user);
            // destroy the session and redirect the user to the index page.
            req.session.destroy(function() {
                next();
            });
        } else next();
    },
    module.exports.getHistory = function(user, errors, callback) {
        new Promise(function(resolve, reject) {
            user.getHistory(errors, function(result) {
                if(result[0]) {
                    errors.push(new Error("Can`t load messages history!" + result[1]));
                } else {
                    console.log("History was loaded successfully...");
                }
                resolve(result[1]);
            });
        })        
        .then(function(result) {
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            console.log(result);
            if(!user.sent) {
                errors.push(new Error("Message wasn`t saved!"));
            }
            return result;
        })
        .then(function(result) {
            console.log(result);
            callback(result);
        })
        .catch(function(err) {
            errors.push(new Error("Can`t load messages history! Error code" + err));
        });
    }
};