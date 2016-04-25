/**
 * Created by Adekunle Adeyemi on 18/02/2016.
 */

var dbConn = require('../model-provider/db');
var ObjectId = require('mongodb').ObjectID;
var util = require('../util/util');

var game = {};

game.updateUserGame = function(userData, callback){
    dbConn.connect(function(isConnect , db){
        var gameCollection = db.collection('UserGame');

        //////// building a date string for each day for uniquenes //////////////
        var curDate = util.getCurrentDadteString();

        var _id = new ObjectId(userData.userId);

        gameCollection.find({date : curDate}, {_id : 1, "users.entry_id" : 1})
            .toArray(function(err , game){
           if(err){

           }else{
               console.log('got game doc of ' + typeof game);
               //console.log(game);
               if(game == undefined || game == null || game.length < 1){
                   //game is not yet created create game document for the day and add first user
                   gameCollection.insert({
                       "date" : curDate,
                       "users" : [{
                           "entryId" : userData.entryId,
                           "userId" : _id,
                           "last_phase" : userData.phase,
                           "last_point" : userData.point,
                           "last_earned" : 0.00,
                           "total_point" : userData.point,
                           "total_earned" : 0.00

                       }],"phase_2" : [],"phase_3" : [],"phase_4" : [],"phase_5" : [],
                       "phase_6" : [],"phase_7" : [],"phase_8" : []
                   },function(err, userGame){
                        if(err){
                            console.log('error creating game');
                            callback(false , userGame);
                            db.close();
                        } else {
                            console.log('finish creatin user gmae');
                            callback(true , userGame);
                            db.close();
                        }
                   });
               }else{
                   //game document exist update user record
                   console.log(game.users);
                   gameCollection.find({date : curDate, 'users.entryId' : userData.entryId}, {_id : 1, "users.entry_id" : 1}).toArray(function(err , game){

                       console.log(game);
                       if(game == undefined || game == null || game.length < 1){
                           //push user here
                           //user is new, add user game to the document
                           console.log(userData);
                           gameCollection.update({
                               "date" : curDate
                           }, {
                               $push: {
                                   "users": {
                                       "entryId": userData.entryId,
                                       "userId" : _id,
                                       "last_phase" : userData.phase,
                                       "last_point" : userData.point,
                                       "last_earned" : 0.00,
                                       "total_earned" : 0.00,
                                       //"socket_id": userData.socketId

                                       "total_point" : userData.point

                                   }
                               }
                           },function(err, userGame){
                               if(err){
                                   console.log('error updating new user');
                                   console.log(err);
                                   callback(false, userGame);
                                   db.close();
                               } else {
                                   console.log(userGame);
                                   console.log('success updating user record');
                                   callback(true , userGame);
                                   db.close();
                               }
                           });
                       }else{
                           //update user here
                           console.log('updating user ......');
                           console.log(userData);

                           gameCollection.update({
                               "date" : curDate,
                               "users.entryId" : userData.entryId
                           }, {
                               $set : {
                                   "users.$.last_phase" : userData.phase,
                                   "users.$.last_point" : userData.point
                                   //"socket_id": userData.socketId
                               },
                               $inc : {
                                   "users.$.total_point" : userData.point
                               }

                           },function(err, userGame){
                               console.log('got users game ');
                               //console.log(userGame);
                               if(err){
                                   console.log('error updating old user game');
                                   //callback(false, userGame);
                                   console.log(err);
                               } else {
                                   if(userGame.result.nModified == 0 && !userGame.result.ok){

                                       console.log('error updating old user game');
                                       //console.log(userGame);
                                       callback(false, 'error updating game');
                                   }else {
                                       console.log('success updating old user game');
                                       //console.log(userGame);
                                       callback(true, userGame);
                                   }
                               }
                           });
                       }
                    });
                }
           }
       });
    });
};


game.updateWinnerAccount = function(userData, callback){
    dbConn.connect(function (isConnect, db) {
        if (isConnect) {

            var curDate = util.getCurrentDadteString();
            var gameCollection = db.collection('UserGame');

            gameCollection.update({
                "date" : curDate,
                "users.entryId" : userData.entryId
            }, {
                $set : {
                    "users.$.last_earned" : userData.earned
                },
                $inc : {
                    "users.$.total_earned" : userData.earned
                }

            },function(err, userGame) {
                console.log('got users game ');
                console.log(userGame);
                if(userGame.result.ok){
                    callback(true);
                }else{
                    callback(false);
                }
            });
        }else{
            console.log('error connecting to db');
            callback(false);
        }
    });
};

game.getUserPoint = function(entryId, callback) {
    dbConn.connect(function (isConnect, db) {
        if (isConnect) {
            var curDate = util.getCurrentDadteString();
            var gameCollection = db.collection('UserGame');

            gameCollection.find({date : curDate, 'users.entryId' : entryId}, {'users.$.total_point' : 1}).toArray(function(err, pointDoc){
                if(err){
                    console.log('error getting point from db');
                    callback(false, 'error getting point from db');
                }else{
                    if(pointDoc){
                        console.log('got point from user point');
                        console.log(pointDoc);
                        var point;
                        if(pointDoc != null &&  pointDoc != undefined  &&  pointDoc.length > 0) {
                            point = pointDoc[0].users[0].total_point;
                            console.log('got user point ' + point);
                            callback(true, point);
                        }else{
                            point = '0000';
                            callback(true, point);
                        }
                    }
                }
            });

        }else{
            console.log('error connecting to database');
            callback(false, 'error connecting to db');
        }
    });
};

game.getAveragePoint = function(callback){
    dbConn.connect(function (isConnect, db) {
        if (isConnect) {
            var curDate = util.getCurrentDadteString();
            var gameCollection = db.collection('UserGame');
            gameCollection.aggregate({$match: {date: "6-3-2016"}}, {$unwind: '$users'}, {$sort: {'users.total_point': -1}}, {$limit: 5}, function (err, pointDocs) {
                if(err){
                    console.log('error getting point from db');
                    callback(false, 'error getting point from db');
                }else{
                    if(pointDocs){
                        console.log('got points ...');
                        console.log(pointDocs);
                        callback(true, pointDocs);
                    }
                }
            });
            /*gameCollection.find({date : "6-3-2016"}, {'users.total_point' : 1}).toArray(function(err, pointDocs){
                if(err){
                    console.log('error getting point from db');
                    callback(false, 'error getting point from db');
                }else{
                    if(pointDocs){
                        console.log('got points ...');
                        console.log(pointDocs);
                        callback(true, pointDocs);
                    }
                }

            });*/
        }else {
            console.log('error connecting to database');
            callback(false, 'error connecting to db');
        }
    });
};



game.getUserGameAccount = function(entryId, callback){
    dbConn.connect(function (isConnect, db) {
        if (isConnect) {
            var curDate = util.getCurrentDadteString();
            var gameCollection = db.collection('UserGame');

            gameCollection.find({date : curDate, 'users.entryId' : entryId}, {
                'users.$' : 1
            }).toArray(function(err, dataDoc){
                if(err){
                    console.log('error retrieving user game acoount');
                    callback(false, 'error retrieving user game account')
                }else{
                    console.log(dataDoc);
                    if(dataDoc != null && dataDoc != undefined && dataDoc.length > 0) {
                        var userData = {
                            total_earned : dataDoc[0].users[0].total_earned,
                            total_point : dataDoc[0].users[0].total_point,
                            last_earned : dataDoc[0].users[0].last_earned
                        };
                        console.log(userData);
                        callback(true, userData);
                    }else{
                        var data = {
                            total_earned : 0.00,
                            total_point : '0000',
                            last_earned : 0.00
                        };

                        callback(true, data);
                    }

                }
            })
        }else{
            callback(false, 'error connecting to db');
        }
    })
};

/**
 * Upgrade winners to the next phase of the game
 * taking only 10%
 * @param phase phase to upgrade to
 * @param callback called when this function called
 */
game.upgradeWinners = function(phase, callback) {
    dbConn.connect(function (isConnect, db) {
        if (isConnect) {
            console.log('connecting to db..');

            var curDate = util.getCurrentDadteString();

            var gameCollection = db.collection('UserGame');

            var currentPhaseProject;
            switch (phase) {
                case 2:
                    currentPhaseProject = {
                        'users.entryId': 1
                    };
                    break;
                case 3:
                    currentPhaseProject = {
                        'phase_2.entryId': 1
                    };
                    break;
                case 4:
                    currentPhaseProject = {
                        'phase_3.entryId': 1
                    };
                    break;
                case 5:
                    currentPhaseProject = {
                        'phase_4.entryId': 1
                    };
                    break;
                case 6:
                    currentPhaseProject = {
                        'phase_5.entryId': 1
                    };
                    break;
                case 7:
                    currentPhaseProject = {
                        'phase_6.entryId': 1
                    };
                    break;
                case 8:
                    currentPhaseProject = {
                        'phase.entryId': 1
                    };
                    break;
                /*case 8:
                 currentPhaseProject = {
                 'phase.entryId' : 1
                 };
                 columnCursor = game[0].phase_7;
                 break;*/
            }

            gameCollection.find({date: curDate}, currentPhaseProject).toArray(function (err, game) {
                console.log('getting game users');
                if (game != undefined && game != null && game.length > 0) {
                    var columnCursor;
                    if (phase == 2) {
                        columnCursor = game[0].users;
                    } else if (phase == 3) {
                        columnCursor = game[0].phase_2;
                    } else if (phase == 4) {
                        columnCursor = game[0].phase_3;
                    } else if (phase == 5) {
                        columnCursor = game[0].phase_4;
                    } else if (phase == 6) {
                        columnCursor = game[0].phase_5;
                    } else if (phase == 7) {
                        columnCursor = game[0].phase_6;
                    } else if (phase == 8) {
                        columnCursor = game[0].phase_7;
                    }
                    console.log(columnCursor);

                    var totalEntry = columnCursor.length;
                    var firstTenPercent = calculateTenPercent(totalEntry);
                    console.log('firstTenPercent is : ' + firstTenPercent);

                    var limit = firstTenPercent < 1 ? 1 : firstTenPercent;
                    console.log('using limit ' + limit);

                    gameCollection.aggregate({$match: {date: curDate}}, {$unwind: '$users'}, {$sort: {'users.total_point': -1}}, {$limit: limit}, function (err, doc) {
                        console.log('entries');
                        var winnersDetail = [];
                        doc.forEach(function (document, index) {
                            console.log(document.users.entryId);
                            var winner = {
                                entryId: document.users.entryId,
                                points: document.users.total_point,
                                userId: document.users.userId
                            };
                            winnersDetail.push(winner);
                        });

                        var projection;
                        switch (phase) {
                            case 2 :
                                projection = {
                                    $push: {
                                        phase_2: {
                                            $each: winnersDetail
                                        }
                                    }
                                };
                                break;
                            case 3:
                                projection = {
                                    $push: {
                                        phase_3: {
                                            $each: winnersDetail
                                        }
                                    }
                                };
                                break;
                            case 4:
                                projection = {
                                    $push: {
                                        phase_4: {
                                            $each: winnersDetail
                                        }
                                    }
                                };
                                break;
                            case 5:
                                projection = {
                                    $push: {
                                        phase_5: {
                                            $each: winnersDetail
                                        }
                                    }
                                };
                                break;
                            case 6:
                                projection = {
                                    $push: {
                                        phase_6: {
                                            $each: winnersDetail
                                        }
                                    }
                                };
                                break;
                            case 7:
                                projection = {
                                    $push: {
                                        phase_7: {
                                            $each: winnersDetail
                                        }
                                    }
                                };
                                break;
                            /*case 8:
                             projection = {
                             $push : {
                             phase_8 : {
                             $each : winnersDetail
                             }
                             }
                             };
                             break;*/
                        }

                        gameCollection.update({date: curDate}, projection,
                            function (err, updated) {
                                if (err) throw err;
                                console.log("got total winners of " + winnersDetail.length);
                                console.log(winnersDetail);

                                console.log('upgraded users completely');
                                //console.log(updated);
                                callback();
                                db.close();
                            }
                        );


                        //console.log(gamer.users.entryId);

                        //console.log(i);
                    });

                    /*gameUser.toArray(function(err, gamers){
                     gamers.forEach(function(gamer, index){
                     console.log('entries');
                     console.log(gamer.users.entryId);
                     console.log(index);
                     });
                     });*/
                }
                //callback();
            });

            //var gameUser = gameCollection.aggregate({$match : {date : dateString}},{$unwind : '$users'},{$sort : {'users.total_point' : -1}});

            //var gameUserCount = gameUser.count();

        }
    });
};


game.upgradeWinnersToFinalQuest = function(phase, callback){
    dbConn.connect(function (isConnect, db) {
        if (isConnect) {
            var curDate = util.getCurrentDadteString();

            var gameCollection = db.collection('UserGame');
            var currentPhaseProject;
            switch (phase){
                case 2:
                    currentPhaseProject = {
                        'users.entryId' : 1
                    };
                    break;
                case 3:
                    currentPhaseProject = {
                        'phase_2.entryId' : 1
                    };
                    break;
                case 4:
                    currentPhaseProject = {
                        'phase_3.entryId' : 1
                    };
                    break;
                case 5:
                    currentPhaseProject = {
                        'phase_4.entryId' : 1
                    };
                    break;
                case 6:
                    currentPhaseProject = {
                        'phase_5.entryId' : 1
                    };
                    break;
                case 7:
                    currentPhaseProject = {
                        'phase_6.entryId' : 1
                    };
                    break;
                case 8:
                    currentPhaseProject = {
                        'phase.entryId' : 1
                    };
                    break;
                /*case 8:
                 currentPhaseProject = {
                 'phase.entryId' : 1
                 };
                 columnCursor = game[0].phase_7;
                 break;*/
            }

            gameCollection.find({date : curDate}, currentPhaseProject).toArray(function(err, game) {
                console.log('getting game users');
                var columnCursor;
                if (phase == 2) {
                    columnCursor = game[0].users;
                } else if (phase == 3) {
                    columnCursor = game[0].phase_2;
                } else if (phase == 4) {
                    columnCursor = game[0].phase_3;
                } else if (phase == 5) {
                    columnCursor = game[0].phase_4;
                } else if (phase == 6) {
                    columnCursor = game[0].phase_5;
                } else if (phase == 7) {
                    columnCursor = game[0].phase_6;
                } else if (phase == 8) {
                    columnCursor = game[0].phase_7;
                }
                console.log(columnCursor);

                var totalEntry = columnCursor.length;
                var firstTenPercent = calculateTenPercent(totalEntry);
                console.log('firstTenPercent is : ' + firstTenPercent);

                var limit = firstTenPercent <= 0 ? 1 : firstTenPercent;

                gameCollection.aggregate({$match: {date: curDate}}, {$unwind: '$users'}, {$sort: {'users.total_point': -1}}, {$limit: limit}, function (err, doc) {
                    console.log('entries');
                    var winnersDetail = [];
                    doc.forEach(function (document, index) {
                        console.log(document.users.entryId);
                        var winner = {
                            entryId: document.users.entryId,
                            points: document.users.total_point,
                            userId: document.users.userId
                        };
                        winnersDetail.push(winner);
                    });

                    var projection = {
                        $push: {
                            final_quest: {
                                $each: winnersDetail
                            }
                        }
                    };

                    gameCollection.update({date: curDate}, projection,
                        function (err, updated) {
                            if (err) throw err;
                            console.log("got total final winners of " + winnersDetail.length);
                            console.log(winnersDetail);

                            console.log('upgraded users completely');
                            //console.log(updated);
                            callback(true);
                            db.close();
                        }
                    );
                });
            });

        }else{
            console.log('unable to connect to db');
            callback(false);
        }
    });
};

game.confirmUserInCurrentPhase = function(data, callback){
    dbConn.connect(function(isConnect, db){
        if(isConnect){
            var gameColl = db.collection('UserGame');

            var curdate = util.getCurrentDadteString();

            console.log(data);
            console.log('todaya ' + curdate);
            var userGame;
            if(data.phase == 0)
                userGame = gameColl.find({date : curdate, 'final_quest.entryId' : data.entryId});
            else if(data.phase == 2)
                userGame = gameColl.find({date : curdate, 'phase_2.entryId' : data.entryId});
            else if(data.phase == 3)
                userGame = gameColl.find({date : curdate, 'phase_3.entryId' : data.entryId});
            else if(data.phase == 4)
                userGame = gameColl.find({date : curdate, 'phase_4.entryId' : data.entryId});
            else if(data.phase == 5)
                userGame = gameColl.find({date : curdate, 'phase_5.entryId' : data.entryId});
            else if(data.phase == 6)
                userGame = gameColl.find({date : curdate, 'phase_6.entryId' : data.entryId});
            else if(data.phase == 7)
                userGame = gameColl.find({date : curdate, 'phase_7.entryId' : data.entryId});
            else if(data.phase == 8)
                userGame = gameColl.find({date : curdate, 'phase_8.entryId' : data.entryId});
            else {

            }

            console.log('confirming user in current phase');
            //console.log(userGame);

            if(userGame != undefined || userGame != null) {
                userGame.toArray(function (err, game) {
                    if (err) {
                        console.log('error confirming user in current phase');
                        console.log(err);
                        callback(false, false);
                    } else {
                        console.log('confirming user');
                        console.log(game);
                        console.log(game.length);
                        if(game && !game.isEmpty && game.length > 0)
                            callback(true, true);
                        else
                            callback(true, false);
                        db.close();
                    }
                });
            }else{
                callback(false, false);
                db.close();
            }
        } else{
            console.log('error connecting to db');
            callback(false, false);
        }
    });
};

game.getAllPhaseUser = function(phase, callback){
    dbConn.connect(function(isConnect, db){
        if(isConnect){
            var gameColl = db.collection('UserGame');

            var curDate = util.getCurrentDadteString();

            var projection;
            switch (phase){
                case 0:
                    projection = {
                        'final_quest.entryId' : 1,
                        'final_quest.userId' : 1
                    };
                    break;
                case 2:
                    projection = {
                        'phase_2.entryId' : 1,
                        'phase_2.userId' : 1
                    };
                    break;
                case 3:
                    projection = {
                        'phase_3.entryId' : 1,
                        'phase_3.userId' : 1
                    };
                    break;
                case 4:
                    projection = {
                        'phase_4.entryId' : 1,
                        'phase_4.userId' : 1
                    };
                    break;
                case 5:
                    projection = {
                        'phase_5.entryId' : 1,
                        'phase_5.userId' : 1
                    };
                    break;
                case 6:
                    projection = {
                        'phase_6.entryId' : 1,
                        'phase_6.userId' : 1
                    };
                    break;
                case 7:
                    projection = {
                        'phase_7.entryId' : 1,
                        'phase_7.userId' : 1
                    };
                    break;
                case 8:
                    projection = {
                        'phase_8.entryId' : 1,
                        'phase_8.userId' : 1
                    };
                    break;

            }
            gameColl.find({date : curDate}, projection).toArray(function(err, doc){
                if(err){
                    console.log(err);
                    callback(false, 'error retrieving document');
                } else{
                    //console.log(doc);
                    //console.log(doc[0].phase_2);

                    var docEntries;
                    if(doc) {
                        if(phase == 0)
                            docEntries = doc[0].final_quest;
                        else if (phase == 2)
                            docEntries = doc[0].phase_2;
                        else if(phase == 3)
                            docEntries = doc[0].phase_3;
                        else if(phase == 4)
                            docEntries = doc[0].phase_4;
                        else if(phase == 5)
                            docEntries = doc[0].phase_5;
                        else if(phase == 6)
                            docEntries = doc[0].phase_6;
                        else if(phase == 7)
                            docEntries = doc[0].phase_7;
                        else if(phase == 8)
                            docEntries = doc[0].phase_8;

                        console.log('got users in current phase');
                        console.log(docEntries);
                        callback(true, docEntries);
                        db.close();
                        /*docEntries.forEach(function(entry, index){
                            console.log(entry);
                        })*/

                    }
                }
            });
        } else{
            console.log('database connect error');
            callback(false, 'error connecting to database');
        }
    });
};

game.getFinalGamersDetail = function(callback){
    dbConn.connect(function(isConnect, db){
        if(isConnect){
            var gameColl = db.collection('UserGame');
            var curDate = util.getCurrentDadteString();

            var finalGamers = [];
            var gamers = gameColl.aggregate([{$match : {date : curDate}},{$unwind : '$final_quest'},{ $lookup : {from : 'userdetails' , localField : 'final_quest.userId', foreignField : 'userId', as : 'userDetail'}}]);
            try {
                //console.log(gamers);
                gamers.toArray(function(err, gamerDocs) {
                    if (gamerDocs != null || gamerDocs != undefined || gamerDocs.length > 0) {

                        console.log(gamerDocs);
                        var player = {};
                        gamerDocs.forEach(function (userDocs) {
                            console.log(userDocs);
                            //finalGamers.push(userDocs);
                            player.fq = userDocs.final_quest;
                            player.detail = userDocs.userDetail[0];
                            finalGamers.push(player);
                        });
                        callback(true, finalGamers);


                    } else {
                        console.log('can\'t find gamers yet');
                        console.log(gamerDocs);
                        callback(false, 'can\'t find gamers');
                    }
                });
            }finally {
                //db.close();
            }

        }else{
            console.log('Unable to connect to database');
        }
    })
};
function calculateTenPercent(total){
    return Math.round((10/100) * total);
}

module.exports = game;