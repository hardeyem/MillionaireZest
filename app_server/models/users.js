/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

var UserSchema = new Schema({
    email: {
        type : String,
        unique : true,
        required : true
    },
    mobile : {
        type : String,
        required : true
    },
    hash : String,
    salt : String
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
UserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

//
UserSchema.methods.generateJWT = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userType : 'player',
        exp: parseInt(expiry.getTime() / 1000)
    },process.env.JWT_SECRET );
};
module.exports = mongoose.model('User', UserSchema);