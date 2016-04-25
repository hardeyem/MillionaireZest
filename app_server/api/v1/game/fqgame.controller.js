/**
 * Created by Adekunle Adeyemi on 07/03/2016.
 */
var FQGame = require('../../../models/fq_game');
var util = require('../util/util');

exports.fqGame = function(req, res){
    if(req.payload && req.payload.email) {
        var userId = req.payload._id;
        var userType = req.payload.userType;

        var curDate = util.getCurrentDadteString();
        var querySelect;
        if(userType == 'player'){
            querySelect = {
                date : curDate,
                player : userId
            }
        }

        FQGame.findOne(querySelect,{peopleTalk : 0, host : 0}, function(err, gameDoc){
            if(err){
                console.log('error retrieving');
                console.log(err);
                util.sendJSONResponse(res, 404, {fqGame : false, game : 'Error getting your finaL quest detail'});
            }else {
                console.log('success getting game record');
                if (gameDoc == null || gameDoc == undefined) {
                    util.sendJSONResponse(res, 201, {fqGame: false, game: 'You are not in FQGAME.'});
                } else {
                    util.sendJSONResponse(res, 200, {fqGame: true, game: gameDoc});
                }
            }
        });
    }else{
        util.sendJSONResponse(res, 201, {fqGame : false, game : 'You are not authenticated'});
    }
};