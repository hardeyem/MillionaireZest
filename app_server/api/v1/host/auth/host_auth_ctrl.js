/**
 * Created by Adekunle Adeyemi on 03/03/2016.
 */

var passport = require('passport');
var mongoose = require('mongoose');
var HostUser = mongoose.model('HostUser');
var util = require('../../util/util');

exports.register = function(req, res) {
    console.log('registering host user');
    if (!req.body.username || !req.body.password || !req.body.first_name || !req.body.last_name
    || !req.body.sex || !req.body.country) {
        util.sendJSONResponse(res, 400, {
            "message": "All fields required"
        });
    }else{

        var hostUser = new HostUser();
        hostUser.username = req.body.username;
        hostUser.first_name = req.body.first_name;
        hostUser.last_name = req.body.last_name;
        hostUser.sex = req.body.sex;
        hostUser.country = req.body.country;
        hostUser.setPassword(req.body.password);
        hostUser.save(function(err){
            var token;
            if (err) {

                util.sendJSONResponse(res, 404, err);
            } else {
                token = hostUser.generateJWT();
                util.sendJSONResponse(res, 200, {
                    "token": token
                });
            }
        });
        /*}else{
            util.sendJSONResponse(res, 400, {
                "message": "Unauthorised access, secret not valid"
            });
        }*/
    }

};


exports.login = function(req, res){
    if(!req.body.username || !req.body.password) {
        util.sendJSONResponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    console.log('about to log host in');
    passport.authenticate('host', function(err, hostUser, info){
        var token;
        if (err) {
            console.log(err);
            util.sendJSONResponse(res, 404, err);
            return;
        }
        if(hostUser){
            token = hostUser.generateJWT();
            util.sendJSONResponse(res, 200, {
                "token" : token
            });
        } else {
            util.sendJSONResponse(res, 401, info);
        }
    })(req, res);
};