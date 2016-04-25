/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var UserDetail = mongoose.model('UserDetail');
var util = require('../util/util');

exports.register = function(req, res){
    //res.json({msg : req.body});
    //res.json({msg : req.body});
    if(!req.body.mobile || !req.body.email || !req.body.password || !req.body.confirmPassword) {
        util.sendJSONResponse(res, 400, {
            "message": "All fields required"
        });

    }
    else {
        console.log(req.body);
        if( req.body.password !== req.body.confirmPassword){
            util.sendJSONResponse(res, 400,
                "Password not match"
            );

            return;
        }
        console.log("registering user auth");
        var user = new User();
        user.mobile = req.body.mobile;
        user.email = req.body.email;
        user.setPassword(req.body.password);
        user.save(function (err) {
            var token;
            if (err) {

                util.sendJSONResponse(res, 404, err);
            } else {
                token = user.generateJWT();
                util.sendJSONResponse(res, 200, {
                    "token": token
                });
            }
        });
    }
};

exports.registerDetails = function(req, res){
    if(req.payload && req.payload._id) {
        if (!req.body.first_name || !req.body.last_name || !req.body.sex || !req.body.date_of_birth
            || !req.body.address || !req.body.city || !req.body.state || !req.body.country || !req.body.terms) {
            util.sendJSONResponse(res, 400, {
                "message": "All fields required"
            });
        } else {
            console.log("registering user details");
            //console.log(req.body);
            var userDetail = new UserDetail();
            userDetail.userId = req.payload._id;
            userDetail.title = req.body.title;
            userDetail.first_name = req.body.first_name;
            userDetail.last_name = req.body.last_name;
            userDetail.initial = req.body.initial;
            userDetail.sex = req.body.sex;
            userDetail.date_of_birth = req.body.date_of_birth;
            userDetail.address = req.body.address;
            userDetail.city = req.body.city;
            userDetail.state = req.body.state;
            userDetail.country = req.body.country;
            userDetail.agree_terms = req.body.terms;
            userDetail.save(function (err) {
                if (err) {

                    util.sendJSONResponse(res, 404, err);
                } else {
                    // create user acoount
                    util.sendJSONResponse(res, 200, {
                        response: "Registration complete"
                    });
                }
            });
        }
    }else{
        util.sendJSONResponse(res, 404,{ response : 'registration not complete. Try Again'});
    }
};

exports.login = function(req, res) {
    //res.json({msg : "routing the login"});
    if(!req.body.email || !req.body.password) {
        util.sendJSONResponse(res, 400, {
            "message": "All fields required"
        });
        return;
    }
    passport.authenticate('user', function(err, user, info){
        var token;
        if (err) {
            util.sendJSONResponse(res, 404, err);
            return;
        }
        if(user){
            token = user.generateJWT();
            util.sendJSONResponse(res, 200, {
                "token" : token
            });
        } else {
            util.sendJSONResponse(res, 401, info);
        }
    })(req, res);
};