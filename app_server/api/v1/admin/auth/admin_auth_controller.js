/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */

var passport = require('passport');
var mongoose = require('mongoose');
var AdminUser = mongoose.model('AdminUser');
var util = require('../../util/util');

exports.register = function(req, res) {
    console.log('registering admin user');
    if (!req.body.username || !req.body.password || !req.body.secret) {
        util.sendJSONResponse(res, 400, {
            "message": "All fields required"
        });
    }else{
        var adminSecret = process.env.ADMIN_SECRET;
        if(req.body.secret == adminSecret){
            var adminUser = new AdminUser();
            adminUser.username = req.body.username;
            adminUser.setPassword(req.body.password);
            adminUser.save(function(err){
                var token;
                if (err) {

                    util.sendJSONResponse(res, 404, err);
                } else {
                    token = adminUser.generateJWT();
                    util.sendJSONResponse(res, 200, {
                        "token": token
                    });
                }
            })
        }else{
            util.sendJSONResponse(res, 400, {
                "message": "Unauthorised access, secret not valid"
            });
        }
    }

};


exports.login = function(req, res){
    if(!req.body.username || !req.body.password) {
        util.sendJSONResponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    console.log('about to log admin in');
    passport.authenticate('admin', function(err, adminUser, info){
        var token;
        if (err) {
            console.log(err);
            util.sendJSONResponse(res, 404, err);
            return;
        }
        if(adminUser){
            token = adminUser.generateJWT();
            util.sendJSONResponse(res, 200, {
                "token" : token
            });
        } else {
            util.sendJSONResponse(res, 401, info);
        }
    })(req, res);
};