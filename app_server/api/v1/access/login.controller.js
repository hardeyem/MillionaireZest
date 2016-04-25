/*
/!**
 * Created by Adekunle Adeyemi on 31/01/2016.
 *!/

var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var util = require('../util/util');

module.exports.login = function(req, res) {
    if(!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    passport.authenticate('local', function(err, user, info){
        var token;
        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }
        if(user){
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token" : token
            });
        } else {
            sendJSONresponse(res, 401, info);
        }
    })(req, res);
};*/
