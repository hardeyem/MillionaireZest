/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

/*
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var util = require('../util/util');

module.exports.register = function(req, res){
    if(!req.body.name || !req.body.email || !req.body.password) {
        util.sendJSONResponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function(err) {
        var token;
        if (err) {
            util.sendJSONResponse(res, 404, err);
        } else {
            token = user.generateJwt();
            util.sendJSONResponse(res, 200, {
                "token" : token
            });
        }
    });
}*/
