/**
 * Created by TK on 02/03/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

var AdminUserSchema = new Schema({
    username :{
        type : String,
        unique : true,
        required : true
    },
    hash : String,
    salt : String
});

AdminUserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

AdminUserSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

//
AdminUserSchema.methods.generateJWT = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    return jwt.sign({
        _id: this._id,
        username: this.username,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000)
    },process.env.ADMIN_SECRET );
};
module.exports = mongoose.model('AdminUser', AdminUserSchema);