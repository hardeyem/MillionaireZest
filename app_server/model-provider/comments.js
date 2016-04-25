/**
 * Created by TK on 29/02/2016.
 */
var dbs = require("./db");
var util = require('../util/util');
var ObjectId = require('mongodb').ObjectID;

var comments = {};

comments.newComment = function(userData, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){
            var commentColl = db.collection('comments');
            var curDate = util.getCurrentDadteString();

            var _id = new ObjectId(userData.userId);
            commentColl.update({date : curDate}, {
                $push : {
                    comments : {
                        userId : _id,
                        comment : userData.comment
                    }
                }
            },{upsert : true},function(err, updated){
                if(err){
                    console.log('error when creating comment');
                    callback(false);
                    db.close();
                }
                if(updated.result.ok){
                    callback(true);
                    db.close();
                }
            });
        }else{
            console.log('unable to connect to db');
            callback(false);
        }
    });
};

var curDate = util.getCurrentDadteString();
comments.getComments = function(callback){
    dbs.connect(function(isConnect, db){
        if(isConnect) {
            var commentColl = db.collection('comments');

            console.log('db connectiong to comment..');
            commentColl.aggregate([{$match : {date : curDate}},
                {$unwind : '$comments'},
                { $lookup : {from : 'userdetails' , localField : 'comments.userId', foreignField : 'userId', as : 'userDet'}},
                {$limit : 30}]).toArray(function(err, commentDocs){

                console.log(commentDocs);
                //console.log(commentDocs.comments);
                if(commentDocs == null || commentDocs == undefined){
                    console.log('comment is empty '+ commentDocs);
                    var curSplit = curDate.split('-')[0] - 1;
                    var rewindDay = parseInt(curSplit[0]) - 1;
                    if(rewindDay <= 0){
                        //there is no comment for that month again
                        callback(true, 'no comment');
                        db.close();
                        return;
                    }
                    curDate = rewindDay + '-' + curSplit[1]+ '-'+ curSplit[2];
                    comments.getComments(callback);
                }else{
                    var commentRes = [];
                    commentDocs.forEach(function(comment){
                          var singleComment = {
                              comment : comment.comments.comment,
                              firstName : comment.userDet[0] != null ? comment.userDet[0].first_name : 'first_name',
                              lastName : comment.userDet[0] != null ? comment.userDet[0].last_name : 'last_name',
                              country : comment.userDet[0] != null ? comment.userDet[0].country : 'country',
                              image : comment.userDet[0] != null ? comment.userDet[0].profile_immage : 'image'
                          };

                        commentRes.push(singleComment);
                    });

                    console.log('comment is !empty ');
                    console.log(commentRes);
                    callback(true, commentRes);
                    db.close();
                }
            });
        }else{
            console.log('unable to connect to db');
            callback(false, 'unable to connect to db');
        }
    });
};

module.exports = comments;