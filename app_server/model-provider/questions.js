/**
 * Created by Adekunle Adeyemi on 18/02/2016.
 */

var dbConn = require('../model-provider/db');
var ObjectId = require('mongodb').ObjectID;
//var Question = require('../models/questions');
var util = require('../util/util');

var question = {};

question.getRoundQuestion = function(level, callback){
    dbConn.connect(function(isConnect, db){
        if(isConnect){
            var questionCollection = db.collection("questions");

            questionCollection.find({type: "general", for : "general", level : level, asked :false},{ _id : 1}).toArray(function(err, docs){
                    if(err) throw err;

                    var questCount = docs.length;
                    var random = Math.floor((Math.random() * questCount) + 1) - 5;

                    var questions = questionCollection.find({type: "general", for : "general", level : level, asked : false}, {type : 0, level : 0, for : 0, asked : 0 ,'options.correct' : 0 });

                    console.log("skipping " + random);

                    var skip = random;
                    if(random < 0){
                        skip = Math.abs(random);
                        questions.sort({$natural : -1});
                    }
                    questions.skip(skip);
                    questions.limit(3);

                    questions.toArray(function(err , docs){
                        if(err){
                            console.log(err);
                            callback(true, "Database Error");
                        }
                        //console.log(doc);
                        if(docs){
                            console.log("count is  " + random);
                            console.log('got document');
                            //console.log(docs);
                            callback(false, docs);
                        }
                        db.close();
                    });
            })
        }else{
            callback.log(true, "Unable to connect to database");
        }
    })
};

question.getCorrectOption = function(questId, callback){
    dbConn.connect(function(isConnect, db){
        var questionCollection = db.collection("questions");

        var _id = new ObjectId(questId);
        questionCollection.findOne({_id : _id},{'options.correct' : 1}, function(err, option){
            if(err){
                callback(true, "error retrieving correct answer");
            }else{
                callback(false, option);
            }
        })

    })
};

question.generateQuestion = function(data , callback){
    dbConn.connect(function(isConnect, db) {
        console.log('question provider requested');

        var level = parseInt(data.level);
        var questSelect = {
            type: 'general',
            for: data.gameType,
            level: level,
            asked: false
        };

        var projection = {
            question: 1,
            options: 1
        };
        var questionColl = db.collection("questions");
        questionColl.find(questSelect, {_id: 1}).toArray(function (err, docs) {
            if (err) {
                console.log('error getting question from db');
                callback(false, false);
            } else {
                var questCount = docs.length;
                var random = Math.floor((Math.random() * questCount) + 1) - 3;

                var questions = questionColl.find(questSelect, projection);

                console.log("skipping " + random);

                var skip = random;
                if (random < 0) {
                    skip = Math.abs(random);
                    questions.sort({$natural: -1});
                }
                questions.skip(skip);
                questions.limit(1);

                questions.toArray(function (err, questDocs) {
                    if (err) {
                        console.log(err);
                        callback(false, "Database Error");
                        db.close();
                    }
                    //console.log(doc);
                    if (questDocs) {
                        console.log("count is  " + random);
                        console.log('got document');
                        console.log(docs);
                        callback(true, questDocs[0]);
                        db.close();
                    }

                });
            }
        });
    })
};

module.exports = question;