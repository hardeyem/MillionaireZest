/**
 * Created by Adekunle Adeyemi on 24/02/2016.
 */

var dbs = require("./db");
var util = require('../util/util');
var ObjectId = require('mongodb').ObjectID;

var gameUpdate = {};

gameUpdate.createGameUpdate = function(gameData, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){
            var updateColl = db.collection('gameupdates');

            var currentDate = util.getCurrentDadteString();

            updateColl.find({date : currentDate}, function(err, update){
                if(err){
                    //database error
                    callback(false, 'query error');
                } else{
                    /*if(gameUpdate == null || gameUpdate == undefined){
                        //create new game update*/
                        updateColl.update({date : currentDate},
                            {
                                date : currentDate,
                                start_time : gameData.gameTimeStart,
                                game_start : gameData.start,
                                game_end : false,
                                'game_update' : {
                                    'phase': 1
                                }


                            },{upsert : true},
                            function(err, gameUpdate){
                                if(err){
                                    console.log(err);
                                    callback(false, 'error creating game update');
                                    db.close();
                                }else{
                                    console.log('game update doc created..');
                                    callback(true, gameUpdate);
                                    db.close();
                                }
                            }
                        );
                    /*}else{
                        //update exist
                    }*/
                }
            });
        }else{
            console.log('unable to connect to database');
            callback(false , 'unable to connect to database');
        }
    })
};


gameUpdate.hasStarted = function(callback){
    dbs.connect(function(isConnect, db) {
        if (isConnect) {
            var gameColl = db.collection('gameupdates');

            var curdate = util.getCurrentDadteString();

            gameColl.find({date : curdate}, {'game_start' : 1}).toArray(function(err, updateDoc){
                if(err){
                    console.log('error retrieving game start from update');
                    callback(false, false);
                } else{
                    console.log('got game update for new entry');
                    console.log(updateDoc);
                    if(updateDoc == null || updateDoc == undefined || updateDoc.length < 1){
                        gameColl.insert(
                            {
                                date : curdate,
                                game_start : false,
                                game_end : false,
                                game_update : {
                                    phase : 1
                                }

                            },
                            function(err, gameUpdate){
                                if(err){
                                    console.log(err);
                                    callback(false, false);
                                    db.close();
                                }else{
                                    console.log('game update doc created..');
                                    console.log(gameUpdate);
                                    callback(true, false);
                                    db.close();
                                }
                            }
                        );
                    }else{
                        var started = updateDoc[0].game_start;
                        callback(true, started);

                    }

                }
            });

        }else{
            console.log('database connection error');

            callback(false, false);
        }
    })
};


gameUpdate.getCurrentPhase = function(callback){
    dbs.connect(function(isConnect, db) {
        if (isConnect) {
            var gameColl = db.collection('gameupdates');

            var curdate = util.getCurrentDadteString();

            gameColl.find({date: curdate}, {'game_update.phase': 1}).toArray(function (err, phaseDoc) {
                console.log('got game update for new entry');
                console.log(phaseDoc);
                if (phaseDoc == null || phaseDoc == undefined || phaseDoc.length < 1) {
                    gameColl.insert(
                        {
                            date: curdate,
                            game_start: false,
                            game_end: false,
                            'game_update' : {
                                'phase' : 1
                            }
                        },
                        function (err, gameUpdate) {
                            if (err) {
                                console.log(err);
                                callback(false, false);
                                db.close();
                            } else {
                                console.log('game update doc created..');
                                console.log(gameUpdate);
                                var phase = 1;
                                callback(true, phase);
                                db.close();
                            }
                        }
                    );
                } else {
                    var phase = phaseDoc[0].game_update.phase;
                    callback(true, phase);
                }
            });

        } else {
            console.log('database connection error');

            callback(false, 'database connection error');
        }
    });
};

gameUpdate.updateGame = function(updateData, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){

            var updateColl = db.collection('gameupdates');

            var curDate = util.getCurrentDadteString();

            var question0Id = new ObjectId(updateData.question[0].questionId);
            var question1Id = new ObjectId(updateData.question[1].questionId);
            var question2Id = new ObjectId(updateData.question[2].questionId);



            updateColl.update({date : curDate},
                {
                    $set : {
                        'game_update.isGeneral' : true,
                        'game_update.phase' : updateData.phase,
                        'game_update.round ' : updateData.round,
                        'game_update.lastAskedTime' : updateData.timeAsked,
                        'game_update.lastAskedQuestion' : [
                            {
                                type : updateData.question[0].type,
                                question : question0Id
                            },
                            {
                                type : updateData.question[1].type,
                                question : question1Id
                            },
                            {
                                type : updateData.question[2].type,
                                question : question2Id
                            }
                        ]

                    }
                }, function(err, updated){
                    if(err){
                        console.log('error updating game update');
                        console.log(err);
                        callback(false, 'rror updating game update');
                        db.close();
                    }else{
                        callback(true, updated);
                        db.close();
                    }
                })

        }else{
            console.log('error connecting to the db');
            callback(false, 'error connecting to the db');
        }
    })
};

gameUpdate.updateGameEnd = function (callback) {
    dbs.connect(function(isConnect, db){
        if(isConnect){

            var updateColl = db.collection('gameupdates');

            var curDate = util.getCurrentDadteString();


            updateColl.update({date : curDate},
                {
                    $set : {
                        game_end : true,
                        game_start :false

                    }
                }, function(err, updated){
                    if(err){
                        console.log('error updating game update');
                        console.log(err);
                        callback(false, 'rror updating game update');
                        db.close();
                    }else{
                        callback(true, updated);
                        db.close();
                    }
                })

        }else{
            console.log('error connecting to the db');
            callback(false, 'error connecting to the db');
        }
    })
};

module.exports = gameUpdate;
