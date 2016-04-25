var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = mongoose.model('User'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');


var UserEduSchema = new Schema({
    profession : String,
    education_level : String,
    interest : String,
    hobby : String
});

var UserStatusSchema = new Schema({
    current_job : String,
    employer : String,
    income_range : String,
    worth : String
});

var UserKYCSchema = new Schema({
    kyc_type : String,
    kyc_img : {
        data : Buffer,
        contentType : String
    }
});

var UserMedalSchema = new Schema({
    f : Number,
    bronze : Number,
    silver : Number,
    gold : Number,
    diamond : Number
});
var UserDetailSchema = new Schema({
    userId : {
        type : Schema.ObjectId,
        ref : User
    },
    title : {
        type : String,
        required : true
    },
    first_name : {
        type : String,
        required : true
    },
    initial : {
        type : String,
        required : true
    },
    last_name : {
        type : String,
        required : true
    },
    sex : {
        type : String,
        required : true
    },
    date_of_birth : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required :true
    },
    state : {
        type : String,
        required :true
    },
    country : {
        type : String,
        required : true
    },
    agree_terms :{
        type : Boolean,
        required : true
    },
    profile_img : {
        data : Buffer,
        contentType : String
    },
    education : UserEduSchema,
    financial_status : UserStatusSchema,
    kyc : UserKYCSchema,
    medal : UserMedalSchema

});

module.exports = mongoose.model('UserDetail', UserDetailSchema);