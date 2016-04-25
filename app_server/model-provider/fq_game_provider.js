/**
 * Created by Adekunle adeyemi on 06/03/2016.
 */
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
//var dbs = require("./db");
var FQGame = require('../models/fq_game');


var util = require('../util/util');

var fqGame = {};

fqGame.converse = function(converseData, callback){
    var _id = new ObjectId(converseData.gameId);
    console.log(_id);
    FQGame.update({_id : _id}, {
        $push :{
            conversations : {
                time : converseData.time,
                user : converseData.user,
                msg : converseData.msg
            }
        }
    }, function(err, update){
        if(err){
            console.log('error adding comment');
            console.log(err);
            callback(false, 'error adding comment');
        }else{
            console.log('comment added');
            //console.log(update);
            if(update.ok && update.nModified) {
                callback(true, true);
            }else{
                callback(true, false);
            }
        }
    })
};

fqGame.validateUser = function(userData, callback){
    var curDate = util.getCurrentDadteString();
    var _id = new ObjectId(userData.userId);
    var querySelect;
    if(userData.userType == 'player'){
        querySelect = {
            date : curDate,
            player : _id
        }
    }  else if(userData.userType == 'host'){
        querySelect = {
            date : curDate,
            host : _id
        }
    }

    FQGame.findOne(querySelect, {gameRoom : 1}, function(err, doc){
        if(err){

        }else{
            console.log(doc);
            if(doc && doc != undefined && doc != null){
                callback(true, doc);
            }else{
                callback(false, 'User not exist');
            }
        }
    })
};

fqGame.movePlayerForward = function(gameId, callback){
    var _id = new ObjectId(gameId);
    FQGame.update({_id : _id},{
        $inc : {
            level_reached : 1
        }
    }, function(err, updated){
        if(err){
            callback(false)
        }else{
            if(updated.ok && updated.nModified){
                callback(true);
            }
        }
    })

};

fqGame.updateLive = function(gameData, callback){
    var _id = new ObjectId(gameData.gameId);

    var projection;
    if(gameData.liveUsed == 0){
        projection = {
            $set :{
                'lives.revert_option' : false
            }
        }
    }else if(gameData.liveUsed == 0){
        projection = {
            $set :{
                'lives.double_option' : false
            }
        }
    }else if(gameData.liveUsed == 0){
        projection = {
            $set :{
                'lives.extra_option' : false
            }
        }
    }
    FQGame.update({_id : _id},projection, function(err, updated){
        if(err){
            callback(false)
        }else{
            if(updated.ok && updated.nModified){
                callback(true);
            }
        }
    });
};
module.exports = fqGame;