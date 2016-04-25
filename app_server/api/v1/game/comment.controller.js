/**
 * Created by Adekunle Adeyemi on 29/02/2016.
 */

var user = require('../../../model-provider/user-provider');
var comments = require('../../../model-provider/comments');
var util = require('../util/util');


exports.newComment = function(req, res){
    if(req.payload && req.payload.email) {
        console.log("entry req include payload");
        if(req.body.comment != null && req.body.comment != undefined && !req.body.comment.empty()){
            var userData = {
                userId : req.payload._id,
                comment : req.body.comment
            };

            comments.newComment(userData, function(done){
                if(done){
                    util.sendJSONResponse(res, 200, {error : false, msg : 'Success'});
                }else{
                    util.sendJSONResponse(res, 401, {error : true, msg : 'Error occur when sending your comment'});
                }
            });
        }

    }
};

exports.getComments = function(req, res){
    console.log('requesting comments');
    if(req.payload && req.payload.email) {
        console.log("req comments payload");
        comments.getComments(function(done, commentDocs){
            //console.log(commentDocs);
            if(done && typeof commentDocs != String){
                //console.log('comment done');
                util.sendJSONResponse(res, 200, {error : false, comments: commentDocs});
            }else{
                util.sendJSONResponse(res, 401, {error : true, comments : 'Error occur when retriving your comment'});
            }
        });
    }else{
        util.sendJSONResponse(res, 404, {error : true, comments : 'UnAthorised user please make sure you sign in'});
    }
};
