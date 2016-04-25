/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email : String,
    password : String,
    token : String
});

module.exports = mongoose.model('User' , UserSchema);