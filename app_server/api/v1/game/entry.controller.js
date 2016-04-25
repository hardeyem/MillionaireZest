/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

var user = require('../../../model-provider/user-provider');
var entry = require('../../../model-provider/entry-provider');
var gameUpdate = require('../../../model-provider/gameUpdate');
var userGame = require('../../../model-provider/general_game');
var util = require('../util/util');


exports.enterGame = function(req, res){
    console.log("receive game entry request");
    console.log(req.payload);
    //res.send("welcome receive your entry req");
    if(req.payload && req.payload.email){
        console.log("entry req include payload");
        var userData = {
            id : req.payload._id,
            for : "general",
            type : req.body.type.toString()
        };

        gameUpdate.hasStarted(function(done , started){
           if(done && started){
               console.log('sorry game has started do you join the entry now');
               var msg = 'Sorry you can\'t enter the game now. Try Tomorrow';
               util.sendJSONResponse(res, 400, {error : true, detail : msg});
           } else if(done && !started){
               entry.enterGame(userData, function(isUpdate, entryId, msg){
                   console.log(isUpdate);
                   if(isUpdate) {
                       console.log("entry with no error");
                       req.body.entryId  = entryId;
                       req.body.msg = msg;
                       util.sendJSONResponse(res, 200, {error : false, detail : req.body});
                   }else{
                       console.log("is not updated");
                       util.sendJSONResponse(res, 400, {error : true, msg : msg});
                   }
               });
           }else{
               console.log('error confirming that the game has not started');
               var msg = 'error confirming that the game has not started';
               util.sendJSONResponse(res, 400, {error : true, msg : msg});
           }
        });


    }else{
        console.log("entry req does not include payload");

        util.sendJSONResponse(res, 401, {error : true, msg : "User not Authenticate"});
    }
};

exports.entryDetail = function(req, res){
    if(req.payload && req.payload.email){
        var userId = req.payload._id;
        entry.getDetail(userId, function(err, entry , msg){
            if(!err){
                console.log("got entry detials");
                console.log(entry);

                if(entry == null){
                    entry = {};
                    entry.msg = msg;
                    entry.entered = false;

                    util.sendJSONResponse(res, 201, entry);
                }else{
                    entry.msg = msg;
                    entry.entered = true;
                    util.sendJSONResponse(res, 200, entry);
                }

            }else{
                console.log("error retrieving entry detail");
                util.sendJSONResponse(res, 202, {error : true, entered : false, msg : 'Entry Not Found'});
            }
        })
    }
};

exports.finalDetail = function(req, res){
    console.log('final detail requested');
    if(req.payload && req.payload.email){
        console.log('final detail requested payload');
        var userId = req.payload._id;
        entry.getUserEntryIdByUserId(userId, function(done, entryId){
            console.log('final detail got entry');
            if(done){
                console.log("got final quest detials");
                console.log(entryId);

                ///uses 0 as final quest id
                var data = {
                    entryId : entryId,
                    phase : 0
                };

                userGame.confirmUserInCurrentPhase(data, function(done, inPhase){
                    if(done && inPhase){
                        util.sendJSONResponse(res, 200, {inFQuest : true, entryId : entryId});
                    }else{
                        util.sendJSONResponse(res, 400, {inFQuest : false});
                    }

                });

            }else{
                console.log("error retrieving entry detail");
                util.sendJSONResponse(res, 400, {error : true, inFQuest : false, msg : 'Entry Not Found'});
            }
        })
    }
};

