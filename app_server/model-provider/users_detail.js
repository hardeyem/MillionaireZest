/**
 * Created by Adekunle Adeyemi on 29/02/2016.
 */

var ObjectId = require('mongodb').ObjectID;
//var dbs = require("./db");
var UserDetail = require('../models/users_details');


var util = require('../util/util');

var usersDetail = {};

usersDetail.getUserCommentDetails = function(userId, callback){

};

usersDetail.getPlayerDetail = function(userId, callback){
    UserDetail.aggregate([{$match : {userId : userId}},{ $lookup : {from : 'users_account' , localField : 'userId', foreignField : 'userId', as : 'userAccount'}}],
        function(err, doc){
            if(err){
                console.log('error retrieving document for final');
                callback(false, 'error retrieving ')
            }else{
                console.log('success retrieving data');
                console.log(doc);
                callback(true, doc);
            }
        }
    );
};

module.exports = usersDetail;