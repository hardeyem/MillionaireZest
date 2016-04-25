/**
 * Created by Adekunle Adeyemi on 18/02/2016.
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

var user = {};

/*
user.setPassword = function(password){
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return {
        salt : salt,
        hash : hash
    }
};

user.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};
*/

user.getUserIdByEmail = function(email, callback){
    User.findOne({email : email})
        .select('_id')
        .exec(function(err, userId){
            if(!user) {
                callback(true, "User not found");
                return;
            }

            callback(false, userId);

        }
    );
};

module.exports = user;
