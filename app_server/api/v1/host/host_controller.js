/**
 * Created by Adekunle Adeyemi on 05/03/2016.
 */
var HostProvider = require('../../../model-provider/host_provider');
var UserGame = require('../../../model-provider/general_game');
var UserDetail = require('../../../model-provider/users_detail');
var FQGame = require('../../../models/fq_game');
var questionProvider = require('../../../model-provider/questions');
var util = require('../util/util');

exports.getHostGame = function(req, res){
    if(!req.payload || !req.payload.username){
        console.log('request not authenticated');
        util.sendJSONResponse(res, 404, {error : true, hostGame : "User not Authenticated"});
    }else{
        console.log('getting host game');
        var curDate = util.getCurrentDadteString();
        FQGame.findOne({date : curDate, host : req.payload._id}, function(err , gameDoc){
            if(!err){
                console.log('found host game');
                console.log(gameDoc);

                if(gameDoc != null || gameDoc != undefined) {
                    var playerId = gameDoc.player;
                    UserDetail.getPlayerDetail(playerId, function (done, playerDoc) {
                        if (done && playerDoc) {
                            console.log(playerDoc[0]);
                            var userAcc = {};
                            var financial = {};
                            if (playerDoc[0].userAccount != undefined && playerDoc[0].userAccount != null) {
                                userAcc.wallet = playerDoc[0].userAccount[0].wallet;
                                userAcc.total_earned = playerDoc[0].userAccount[0].total_earned;
                                userAcc.last_earned = playerDoc[0].userAccount[0].last_earned;
                            } else {
                                userAcc.wallet = '';
                                userAcc.total_earned = '';
                                userAcc.last_earned = '';
                            }
                            if (playerDoc[0].financial_status == undefined) {
                                financial.worth = '';
                                financial.job = '';
                                financial.employer = '';
                                financial.income = '';
                            } else {
                                financial.worth = playerDoc[0].financial_status.worth;
                                financial.job = playerDoc[0].financial_status.current_job;
                                financial.employer = playerDoc[0].financial_status.employer;
                                financial.income = playerDoc[0].financial_status.income_range;
                            }
                            var education = {};
                            if (playerDoc[0].education == undefined) {
                                education.profession = '';
                                education.education = '';
                            } else {
                                education.profession = playerDoc[0].education.profession;
                                education.education = playerDoc[0].education.education_level;
                            }
                            var userDetail = {
                                first_name: playerDoc[0].first_name,
                                last_name: playerDoc[0].last_name,
                                sex: playerDoc[0].sex,
                                date_of_birth: playerDoc[0].date_of_birth,
                                country: playerDoc[0].country,
                                profile_img: playerDoc[0].profile_img,
                                worth: financial.worth,
                                job: financial.job,
                                employer: financial.employer,
                                income: financial.income,
                                profession: education.profession,
                                education: education.education
                            };
                            console.log(userDetail);

                            util.sendJSONResponse(res, 200, {
                                error: false,
                                hostGame: gameDoc,
                                playerDetail: userDetail,
                                playerAcc: userAcc
                            });
                        } else {
                            console.log('error retrieving game doc');
                            util.sendJSONResponse(res, 401, {error: true, hostGame: false});
                        }
                    });
                }else{
                    util.sendJSONResponse(res, 201, {error : true, hostGame : 'You have no game today'});
                }

            }else{
                util.sendJSONResponse(res, 401, {error : true, hostGame : false});
            }
        })
    }
};

exports.generateQuestion =  function(req, res){
    if(!req.payload || !req.payload.username){
        console.log('request not authenticated');
        util.sendJSONResponse(res, 404, {error : true, question: "User not Authenticated"});
    }else{
        if(!req.body.gameType || !req.body.level){
            util.sendJSONResponse(res, 401, {error : true, question : "Please provide level and type"});
        }else {
            var dataQuery = {
                gameType: req.body.gameType,
                level: req.body.level
            };
            console.log('getting question');
            console.log(dataQuery);
            questionProvider.generateQuestion(dataQuery, function (done, question) {
                console.log('question genereate request');
                if (done && question) {
                    console.log('got question');
                    util.sendJSONResponse(res, 200, {error: false, question: question});
                } else {
                    util.sendJSONResponse(res, 401, {error: true, question: "Error retrieving question from db"});
                }
            })
        }
    }
};
