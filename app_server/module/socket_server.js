/**
 * Created by TK on 15/02/2016.
 */

var socketServer = {};
var connectionSocket = {};

var jwt = require('express-jwt');
var socketioJwt = require('socketio-jwt');
var Entry = require('../model-provider/entry-provider');
var Question = require('../model-provider/questions');
var UserGame = require('../model-provider/general_game');
var UserAccount = require('../model-provider/users_account');
var GameUpdate = require('../model-provider/gameUpdate');
var Comment = require('../model-provider/comments');

var FQGame = require('../model-provider/fq_game_provider');

var cronServer = require('../cron/cron_server');


var secret = process.env.JWT_SECRET;

var hostSecret = process.env.HOST_SECRET;
var adminSecret = process.env.ADMIN_SECRET;

socketServer.init = function(server, sessionStore, myCookieParser){

    socketServer.io = require('socket.io')(server);

    socketServer.gameGenIO =  socketServer.io.of('/gameGeneral');
    socketServer.gemeSportIo = socketServer.io.of('/gameSport');
    socketServer.adminIO = socketServer.io.of('/admin');
    socketServer.finalIO = socketServer.io.of('/finalQuest');

    socketServer.commentIo = socketServer.io.of('/comment');
    socketServer.generalIO = socketServer.io.of('/mq');

    ///////  Game Type /////////////////
    /*** make sure you get the type the user entered with from the db********/


    console.log("socket init called");

    /**
     * handle authenticatiion for every socket request
     */
    socketServer.gameGenIO.use(socketioJwt.authorize({
        secret : secret,
        handshake : true
    }));

    socketServer.commentIo.use(socketioJwt.authorize({
        secret : secret,
        handshake : true
    }));
    var SECRETS = {
        'player': secret,
        'host': hostSecret
    };

    var GENERAL_SECRETS = {
        'player' : secret,
        'admin' : adminSecret
    };
    socketServer.gemeSportIo.use(socketioJwt.authorize({
        secret : function(request, decodedToken, callback){
            callback(null, GENERAL_SECRETS[decodedToken.userType]);
        },
        handshake : true
    }));


    socketServer.finalIO.use(socketioJwt.authorize({
        secret : function(request, decodedToken, callback){
            // SECRETS[decodedToken.userId] will be used a a secret or
            // public key for connection user.
            //console.log(request);
            console.log('...................');
            //console.log(decodedToken);
            callback(null, SECRETS[decodedToken.userType]);
        },
        handshake : true
    }));

    /*socketServer.finalIO.on('connection', function(socket){
        console.log('user connected to final quest');
        console.log(socket.decoded_token);
    });*/


    socketServer.gameGenIO.use(function(socket, next){
        console.log('route socket middleware');
        if(socket.decoded_token){
            console.log("got socket");
            //console.log(socket.handshake);
            next();

            //// used to join user immediately to its question type
            //socket.join(type);
        }
        console.error('user ' + socket.decoded_token.email);
        console.log("token not valid");
        next(new Error('UnauthorizedError'));
        //next();135-

    });

    ////////////////////////Handling comment socket/////////////////

    handleCommentSocket();



    /////////////////////////Handling final quest socket ////////////////////////////
    handleFinalQuestSocket();



    ///////////////////////////Handle general socket ////////////////////////////
    handleGeneralSocket();

    socketServer.gameGenIO.on('connection', function(socket){
        console.log("socket connected..............");
        //console.log(socket);

        Entry.getDetail(socket.decoded_token._id, function(err, entry, msg){
            if(!err){
                console.log("got entry from socket");
                //console.log(entry);
                if(entry) {
                    if ((entry.entries != undefined || entry.entries != null) && entry.entries.length > 0) {
                        var type = entry.entries[0].gameType;
                        console.log("connecting to " + type);
                        var entryId = entry.entries[0].entryId;

                        //We can't just add user to phase default we neeed to check for the current phase
                        //and check to see if the user is in the phase and allow the user to join correct phaase
                        //if valid

                        //var curPhase = socketServer.currentPhase;
                        var socketId = socket.id;
                        console.log('got entry of ' + entryId);
                        var data = {
                            entryId: entryId,
                            socketId: socketId
                        };
                        console.log(data);
                        console.log(socket.id);//got the socket id on connection

                        /* update users socket */
                        Entry.addSocketId(data, function (updated) {
                            if (updated) {
                                console.log('unable to update record');
                            } else {
                                console.log('updated record');
                            }
                        });

                        GameUpdate.getCurrentPhase(function (done, phase) {
                            if (done) {
                                var data = {
                                    entryId: entryId,
                                    phase: phase
                                };

                                console.log('current phase frm socket init : ' + phase);
                                if (phase == 1) {
                                    console.log('joining default room ' + type);
                                    socket.join(type);
                                } else {

                                    UserGame.confirmUserInCurrentPhase(data, function (done, isInPhase) {
                                        if (done && isInPhase) {
                                            ////user still in game  add socket
                                            var phaseRoom = "phase" + phase + type;
                                            console.log('user joing quest type ' + phaseRoom);
                                            socket.join(phaseRoom);

                                        } else {
                                            console.log('user not in current phase');
                                            socket.emit('game:loose', {msg: 'sorry you loosed the game'});
                                        }
                                    });
                                }
                                ///get game details
                                UserGame.getUserGameAccount(entryId, function (done, userAccount) {
                                    if (done) {
                                        console.log(userAccount);
                                        socket.emit('game:earned', userAccount);
                                    } else {
                                        console.log('error getting user game account');
                                    }
                                });

                            } else {
                                console.log('error getting phase for socket init');
                            }
                        });


                        //console.log('removing socket from room');
                        //var socketId = socket.id;//we need to have a reference of the socket id

                        //console.log(socketServer.gameGenIO.sockets);
                        //console.log(socketId);
                        //socketServer.gameGenIO.connected[socketId].leave(type);//work for removing client from room

                    } else {
                        console.log("entry not found from socket");
                    }
                }else{
                    console.log('entry null unable to connect to db');
                }

            }else{
                /// Deny user here not entry registered user
                socketServer.emitDenyUser(socket);
            }


        });

        console.log('getting sockets/..........');
        //var socketId = Object.keys(socketServer.gameGenIO.sockets)[0].toString();
        //console.log(Object.keys(socketServer.gameGenIO.sockets)[0].toString());

        /*var clientsInRoom = socketServer.io.sockets.adapter.rooms['typeC'];
        console.log(socketServer.gameGenIO.in['typeC']);
        for(var id in socketServer.gameGenIO.connected){
            //console.log(socketServer.gameGenIO.connected[id]);
            var index = socketServer.gameGenIO.connected[id].rooms.indexOf('typeC');
            if(index !==-1){
                console.log(socketServer.gameGenIO.connected[id]);
            }
        }*/
        //console.log(Object.keys(socketServer.gameGenIO.in('typeC').adapter.rooms));

        /*socketServer.gameGenIO.in('typeC').clients(function(error, clients){
            if (error) throw error;
            console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
        });*/
        //console.log(socketServer.io.nsps['/gameGeneral'].adapter.rooms['typeC']);
        //removeAllClientsInTypeRoom(socketServer.gameGenIO, 'typeC');
        //var userSocketsIds = Object.keys(socketServer.gameGenIO.adapter.rooms['typeC']);
        //console.log(socketServer.gameGenIO);

        socket.on('user:gameEntered', function(userData){
            console.log(userData);
        });

        socket.on('user:gameMove', function(userData){
            console.log('add winner to the next socket');
            console.log(userData);

            //ToDo we need to confirm that the user upgrade to the next phase of the game
            //and add the user socket to the right room
            var userId = socket.decoded_token._id;
            if(userId != null || userId != undefined){
                Entry.getDetail(userId, function(err, entry , msg){
                    if((entry.entries != undefined || entry.entries != null) && entry.entries.length > 0) {
                        //console.log("connecting to " + type);
                        //socket.join(type);
                        var entryId = entry.entries[0].entryId;
                        var entryType = entry.entries[0].gameType;
                        var data = {
                            entryId : entryId,
                            phase : socketServer.currentPhase
                        };

                        console.log('current phase data for game move');
                        console.log(data);
                        UserGame.confirmUserInCurrentPhase(data, function(done, isInPhase){
                            if(done && isInPhase){
                                ////user still in game  add socket
                                var phaseRoom = "phase"+ socketServer.currentPhase + entryType;
                                console.log('user joing quest type ' + phaseRoom);
                                socket.join(phaseRoom);


                                UserGame.getUserGameAccount(entryId, function(done, userAccount){
                                    if(done){
                                        socket.emit('game:earned', userAccount);
                                    } else{
                                        console.log('error getting user game account');
                                    }
                                });

                            }else{
                                console.log('user not in phase');
                            }

                        });

                    }else{
                        //entry not found
                    }
                }) ;
            }


            //get last phase from game update and check user from the phase
            //if user found ad the user socket to next phase room type
        });
        socket.on('game:answer', function(data){
            var timeAnswered = Date.now();
            var timeUsed = (timeAnswered - socketServer.lastSent) / 1000;
            console.log("receive answer form user");
            console.log("time used : " + timeUsed);
            console.log(data);
            var remTime = 30 - timeUsed;
            var nextGameTime = remTime + 30 + (1 * 60);//30 for time left From the past round min, 1 is time for each phase

            if(Math.round(timeUsed) > 29){
                //used more than specified time
                socket.emit('game:deny', {err : "Can't process request", msg : "Used more than specified time"})
            }else {
                //still in time range
                Question.getCorrectOption(data.questId, function (err, correct) {
                    if (err) {
                        console.log('error retrieving correct answer');
                        socket.emit('game:error', {msg: "Sorry we couldn't validate your question"});
                    } else {
                        var isCorrect = false;
                        console.log(correct);
                        var correctOpt = correct.options.correct;
                        console.log('correct option is : ' + correctOpt);
                        var point = 1;

                        if (correctOpt == data.answer) {
                            isCorrect = true;
                            point = (30 - Math.round(timeUsed)) * 5;
                        }

                        Entry.getDetail(socket.decoded_token._id, function (err, entry, msg) {
                            if (err) {

                            } else {
                                var entryId = entry.entries[0].entryId;
                                var userId = socket.decoded_token._id;
                                var userData = {
                                    entryId: entryId,
                                    userId : userId,
                                    phase: data.phase,
                                    point: point
                                };

                                UserGame.updateUserGame(userData, function (isDone, gameUpdate) {
                                    if (isDone) {

                                        UserGame.getUserPoint(entryId, function(done, totalPoint) {
                                            if(done){
                                                socket.emit('game:validateAnswer', {
                                                    isCorrect: isCorrect,
                                                    correctOpt: correctOpt,
                                                    userOpt: data.answer,
                                                    totalPoint : totalPoint,
                                                    nextTime : nextGameTime
                                                });
                                                //socket.emit('game:userUpdate', userData);
                                            }else{
                                                console.log(totalPoint);
                                                socket.emit('game:validateAnswer', {
                                                    isCorrect: isCorrect,
                                                    correctOpt: correctOpt,
                                                    userOpt: data.answer,
                                                    nextTime : nextGameTime
                                                });
                                                //socket.emit('game:userUpdate', userData);
                                            }
                                        });

                                    } else {
                                        console.log(isDone + " : " + entry);
                                    }
                                });
                            }
                        });


                    }
                });
            }

        })

    });


};


socketServer.emitGameStart = function(timeStart){
    //console.log(connectionSocket);
    socketServer.gameGenIO.emit('system:game-start', {starting : true, timeToStart : timeStart});
};

socketServer.joinCategory = function(socket, type){
    socket.join(type);
};

socketServer.emitGeneralQuestion = function(type, questionData, options){
  //provide emitter with type of question and question data;

    socketServer.lastSent = Date.now();
    socketServer.gameGenIO.to(type).emit("game:question", {question : questionData, options : options});

};

socketServer.emitDenyUser = function(socket){
    socket.emit("system:deny", {msg : "user not enter for the game"});
};

socketServer.setCurrentPhase = function(phase){
    socketServer.currentPhase = phase;
};

socketServer.setMaxPhase = function(maxPhase){
    socketServer.maxPhase = maxPhase;
};

socketServer.emitCurrentPhase = function(phase){
    socketServer.generalIO.emit('game:Phase' , {currentPhase : phase});
};

/**
 * socket task run every last round of each phase to move winners to the next phase
 * called by the cron_server
 * @param msg //for testing
 * @param phase current phase to move user to
 */
socketServer.runLastRoundTask = function(msg, phase){
    console.log('removing clients...........');

    socketServer.currentPhase = phase;

    removeAllClientsInRoom(socketServer.currentPhase);

    UserGame.upgradeWinners(phase, function(){
        console.log('upgraded called ');

        //first get all entryId and userId from the current phase
        //then update userAccount
        UserGame.getAllPhaseUser(phase, function(done, usersGameDoc){
            if(done){
                // add earned amount for upgraded users
                console.log('trying to update user earned');
                console.log(usersGameDoc);
                var earned = calculateEarnedFromOdd(socketServer.currentPhase);
                console.log('earned : ' + earned);
                if(usersGameDoc !== null && usersGameDoc != undefined){
                    usersGameDoc.forEach(function(userDoc, index){

                        console.log(userDoc);
                        var entryId = userDoc.entryId;
                        var userData = {
                            userId : userDoc.userId,
                            earn : earned
                        };
                        UserAccount.addWinnersEarned(userData, function(done){

                            //update each user game here
                            var earndata = {
                                entryId : entryId,
                                earned : earned
                            };
                            UserGame.updateWinnerAccount(earndata, function(done){
                                if(done){
                                    console.log('updated user game account');
                                } else{
                                    console.log('error updating user game account');
                                }
                            });
                            //get user socketId and emit to user that he has won so so amount
                            if(done){
                                socketServer.gameGenIO.emit("game:lastRound", {lastRound : 3, phase : phase});
                                /*Entry.getSocketIdByEntryId(entryId, function(done, socketId){
                                    if(done){
                                        console.log(socketId);
                                        /// then we emit to the user about the updated acoount

                                        //request user to update there level via socket emition
                                        socketServer.gameGenIO.emit("game:lastRound", {lastRound : 3, phase : phase});
                                    }else{
                                        console.log(socketId);
                                    }
                                })*/
                            }
                        });
                    });

                }else{

                }

            } else{

            }
        });

    });
    console.log("got last round active...and handle winners");
    console.log("last round for phase " + phase);
    console.log(msg);

};


socketServer.runLastGameTask = function(lastPhase){
    console.log('general game finished adding winners to final quest');

    socketServer.currentPhase = lastPhase;
    removeAllClientsInRoom(lastPhase);
    GameUpdate.updateGameEnd(function(done, updated) {
        if(done) {
            UserGame.upgradeWinnersToFinalQuest(lastPhase, function (done) {
                if (done) {
                    console.log('added winners to final quest');

                    //uses 0 to represent last phase since it might varies depending on the number of entries
                    var phase = 0;

                    UserGame.getAllPhaseUser(phase, function (done, usersGameDoc) {
                        if (done) {
                            // add earned amount for upgraded users
                            console.log('trying to update user earned');
                            console.log(usersGameDoc);
                            var earned = calculateEarnedFromOdd(lastPhase + 1);
                            console.log('earned : ' + earned);
                            if (usersGameDoc !== null && usersGameDoc != undefined) {
                                usersGameDoc.forEach(function (userDoc, index) {

                                    console.log(userDoc);
                                    var entryId = userDoc.entryId;
                                    var userData = {
                                        userId: userDoc.userId,
                                        earn: earned
                                    };
                                    UserAccount.addWinnersEarned(userData, function (done) {

                                        if (done) {
                                            socketServer.gameGenIO.emit("game:lastGame", {
                                                lastRound: 3,
                                                phase: lastPhase
                                            });
                                            //update each user game here
                                            var earndata = {
                                                entryId: entryId,
                                                earned: earned
                                            };
                                            UserGame.updateWinnerAccount(earndata, function (done) {
                                                if (done) {
                                                    console.log('updated user game account');
                                                    UserGame.getUserGameAccount(entryId, function (done, userAccount) {
                                                        if (done) {
                                                            socketServer.gameGenIO.emit('game:earned', userAccount);
                                                        } else {
                                                            console.log('error getting user game account');
                                                        }
                                                    });
                                                } else {
                                                    console.log('error updating user game account');
                                                }
                                            });
                                        }
                                    });
                                });

                            } else {

                            }

                        } else {

                        }

                    });
                } else {
                    console.log('unable to add winners to final quest');
                }
            });
        }
    });
};

function calculateEarnedFromOdd(phase){
    var odd;
    if(phase == 2)
        odd = 2.5;
    else if(phase == 3)
        odd = 10;
    else if(phase == 4)
        odd = 100;
    else if(phase == 5)
        odd = 1000;
    else if(phase == 6)
        odd = 5000;
    else if(phase == 7)
        odd = 10000;
    else if(phase == 8)
        odd = 50000;

    return  1 * odd;//entry with a dollar

}

/**
 * This function remove all connected from game type room by getting there
 * socketId from the db
 */
function removeAllClientsInRoom(currentPhase){

    Entry.getAllUsersSocketId(function(done, entry){
        if(done){
            console.log('getting all entries');
            console.log(entry);

            //console.log(entries);
            if(entry != undefined || entry != null) {
                var entries = entry[0].entries;
                entries.forEach(function (entry, index) {
                    var socketId = entry.socketId;
                    var gameFor = entry.gameFor;

                    console.log('Removing users from phase ' + currentPhase);
                    var gameType;
                    var phase = currentPhase -1;
                    if(currentPhase == 2)
                        gameType = entry.gameType;
                    else if(currentPhase > 2)
                        gameType = 'phase'+ phase + entry.gameType;

                    console.log('user leaving room ' + gameType);
                    console.log(socketId);
                    if (gameFor == "general") {
                        if (socketServer.gameGenIO.connected[socketId] && socketServer.gameGenIO.connected[socketId] != null) {
                            //user is connected so remove
                            socketServer.gameGenIO.connected[socketId].leave(gameType);
                        } else {
                            console.log('unable to connect the user');
                            //user is not connected do nothing but something will be done if the userr is connecting back
                        }

                    } else if (gameFor == 'sport') {
                        if (socketServer.gemeSportIo.connected[socketId] && socketServer.gemeSportIo.connected[socketId] != null) {
                            //user is connected so remove
                            socketServer.gemeSportIo.connected[socketId].leave(gameType);
                        } else {
                            //user is not connected do nothing but something will be done if the userr is connecting back
                        }
                    }

                    //socketServer.gameGenIO.connected[socketId].leave(type);//work for removing client from room
                });
            }else{
                console.log('entry empty');
                console.log(entry);
            }
        } else{
            console.log('unable to retrieve all entries');
        }
    });

}

function handleFinalQuestSocket(){
    socketServer.finalIO.on('connection', function(socket){
        console.log('handling final game....');
        console.log('user connected to final quest');
        console.log(socket.decoded_token);

        var userData = {
            userType : socket.decoded_token.userType,
            userId : socket.decoded_token._id
        };
        if(socket.decoded_token.userType == 'host'){
            //TODO check if the usser in final game and the store the game id in session
            //Also add user nd host to there respective gameRoom
            //userData.userType =
        }

        FQGame.validateUser(userData, function(done, gameDoc){
            if(done && gameDoc){
                console.log('got user game room');
                console.log(gameDoc);
                socket.room = gameDoc.gameRoom;
                console.log(socket.room);
                socket.join(socket.room);
                if(socket.decoded_token.userType == 'host'){
                    //let host intialize videoStream
                    console.log('host connected');
                    socket.emit('created', socket.room);
                }else if(socket.decoded_token.userType = 'player'){
                    console.log('player connected');
                    //notify host about the player joining the stream
                    socket.broadcast.in(socket.room).emit('join', socket.room);
                    //let player join the already created if any
                    socket.emit('joined', socket.room);
                }

            }else{
                console.log('not a valid user');
                socket.emit('system:Error', {msg : ''})
            }
        });


        /// used for the video stream

        socket.on('fStream', function(message) {
            console.log('reciving stream');
            console.log(message);
            //socket.emit('fStream', message);
            socket.broadcast.to(socket.room).emit('fStream', message);
        });

        //// end used for the video strem

        socket.on('game:askQuestion', function(data){
            console.log('got question....');
            console.log(data);
            socket.broadcast.to(socket.room).emit('game:playerQuestion', data);
        });

        socket.on('game:playerFinalAnswer', function(data){
            console.log('finalAnswer');
            socket.broadcast.to(socket.room).emit('game:finalAnswer', data);
        });

        socket.on('game:playerAnswer', function(data){
            socket.broadcast.to(socket.room).emit('game:hostValidateAnswer', data);
        });

        socket.on('game:playerCorrect', function(data){
            //upgrade user here
            FQGame.movePlayerForward(data.gameId, function(done){
                if(done){
                    socket.broadcast.to(socket.room).emit('game:correctAnswer', {gameLevel : data.gameLevel++});
                }
            })
        });

        socket.on('game:playerUseLive', function(data){

            socket.broadcast.to(socket.room).emit('game:playerUseLive', data);
        });

        socket.on('game:hostConfirmLiveUsed', function(data){
            FQGame.updateLive(data, function(done){
               if(done){
                   //update the player about any necessary option that need to take place
                   socket.broadcast.to(socket.room).emit('game:liveUseUpdated', data);
               }
            });
        });

        socket.on('Game:Converse', function(data){
            console.log('receive conversation ' + socket.decoded_token.userType);
            console.log(data);

            if(data.gameId && data.gameId != null && data.gameId != '') {
                var converseData = {
                    time: Date.now(),
                    user: socket.decoded_token.userType,
                    gameId: data.gameId,
                    msg: data.msg
                };

                FQGame.converse(converseData, function (done, feed) {
                    if (done && feed) {
                        socket.broadcast.to(socket.room).emit('game:userConverse', {user: converseData.user, msg: converseData.msg});
                        socket.emit('game:userConverse', {user: converseData.user, msg: converseData.msg});
                    } else {
                        socket.emit('system:Error', {msg: 'sorry we couldn\'t process your request'});
                    }
                })
            }else{
                socket.emit('system:Error', {msg: 'sorry you have no connected game'});
            }


        });
    });
}


function handleCommentSocket(){
    socketServer.commentIo.on('connection', function(socket){
        console.log('connected to comment namespc');
        console.log('found user for comment');
        console.log(socket.decoded_token);


        socket.on('game:comment', function(data){
            console.log('receive comment');
            console.log(data);
            var commentData = {
                userId : socket.decoded_token._id,
                comment : data.comment
            };
            Comment.newComment(commentData, function(done){
                if(done){
                    console.log('comment saved.......');
                    //socket.emit('game:newComment', commentData);
                    socketServer.commentIo.emit('game:newComment', commentData);
                }
            })
        })
    })
}


function handleGeneralSocket(){
    socketServer.generalIO.on('connection', function(socket){
       console.log('connected to general');
        GameUpdate.getCurrentPhase(function(done, phase){
            if(done){
                socketServer.emitCurrentPhase(phase);
            }
        });

        UserGame.getAveragePoint(function(done , pointDocs){
            console.log('getting points......');
            if(done){
                console.log("got points...");
            }
        })
    });
}


socketServer.isUserAuthenticated = function(){

    return false;
};
module.exports = socketServer;