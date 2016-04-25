/**
 * Created by Adekunle Adeyemi on 03/03/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

var HostUserSchema = new Schema({
    username :{
        type : String,
        unique : true,
        required : true
    },
    first_name :{
        type : String,
        required : true
    },
    last_name :{
        type : String,
        required : true
    },
    sex : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    hash : String,
    salt : String
});

HostUserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

HostUserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

//
HostUserSchema.methods.generateJWT = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    return jwt.sign({
        _id: this._id,
        username: this.username,
        last_name: this.last_name,
        userType: 'host',
        exp: parseInt(expiry.getTime() / 1000)
    },process.env.HOST_SECRET );
};
module.exports = mongoose.model('HostUser', HostUserSchema);