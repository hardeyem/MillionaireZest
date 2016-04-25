/**
 * Created by Adekunle Adeyemi on 04/03/2016.
 */
var HostProvider = require('../../../model-provider/host_provider');
var UserGame = require('../../../model-provider/general_game');
var FQGame = require('../../../models/fq_game');
var util = require('../util/util');

exports.getHosts = function(req, res){
    if(req.payload && req.payload.username){
        //lets try and check to see we have this user in our database
        console.log('host request by the admin');
        HostProvider.getAllHost(function(done , hosts){
            if(done && hosts){
                util.sendJSONResponse(res, 200, {error : false, hosts : hosts});
            }else{
                util.sendJSONResponse(res, 401, {error : true, hosts : false});
            }
        });
    }else{
        console.log("hosts req does not include payload");
        util.sendJSONResponse(res, 404, {error : true, msg : "Admin not Authenticate"});
    }
};

exports.getFinalGamers = function(req, res){
    if(req.payload && req.payload.username){
        console.log('getting final gamer detail');
        UserGame.getFinalGamersDetail(function(done, finalGamer){
           if(done){
               if(finalGamer.length > 0)
                util.sendJSONResponse(res, 200, {error : false, finalGamers : finalGamer});
               else util.sendJSONResponse(res, 200, {error : false, finalGamers : false});
           } else{
               util.sendJSONResponse(res, 401, {error : true, finalGamers : false});
           }
        });
    }else{
        console.log("hosts req does not include payload");
        util.sendJSONResponse(res, 404, {error : true, msg : "Admin not Authenticate"});
    }
};

exports.assignFinalGame = function(req, res){
    if(req.payload && req.payload.username){
        if(req.body.playerId && req.body.hostId){
            var fqGame = new FQGame();
            var date = util.getCurrentDadteString(),
                host = req.body.hostId,
                player = req.body.playerId;

            var random = Math.floor(Date.now() /1000000 * 2) + "";
            var gameRoom = 'game'+random.toString();
            FQGame.update({date : date, player : player },{
                host : host,
                gameRoom : gameRoom
            },{upsert : true},function(err){
                if(err){
                    console.log(err);
                    util.sendJSONResponse(res, 401, {error : true, msg : 'error saving the game'});
                }else{
                    console.log('done assigning fq game');
                    util.sendJSONResponse(res, 200, {error : false, msg : 'success assigning game'});
                }
            })
        }else{
            util.sendJSONResponse(res, 401, {error : true, msg : 'Request is empty'});
        }
    }else{
        util.sendJSONResponse(res, 401, {error : true, msg : 'User denied not authenticated'});
    }
};