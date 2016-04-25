/**
 * Created by Adekunle Adeyemi on 15/02/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Question = mongoose.model('Question');
var User = mongoose.model('User');
var HostUser = mongoose.model('HostUser');

/**
 * FQ conversation
 */

/*var FQMessageSchema = new Schema({
    time : Date.now(),
    user : String,
    msg : String
});*/
/*

var PeopleTalkSchema = new Schema({
    time : Date.now(),
    user : {
        type : Schema.ObjectId,
        ref : User
    },
    msg : String
});
*/


/**
 *  Final quest movement test schemas
 */

var FQMovementSchema = new Schema({
    date : String,
    player : {
        type : Schema.ObjectId,
        ref : User
    },
    host : {
        type : Schema.ObjectId,
        ref : HostUser
    },
    gameRoom : String,
    level_reached : {
        type : Number,
        default : 1
    },
    lives : {
        revert_option : {
            type : Boolean,
            default : true
        },
        double_option : {
            type : Boolean,
            default : true
        },
        extra_option : {
            type : Boolean,
            default : true
        }
    },
    game_trend : [{
        question : {
            type : Schema.ObjectId,
            ref : Question
        },
        correct : Boolean,
        choosed_answer : String,
        level_asked : Number
    }],
    peopleTalk : [{
        time : String,
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        msg : String
    }],
    conversations : [{
        time : String,
        user : String,
        msg : String
    }]

});

module.exports = mongoose.model('FQGame', FQMovementSchema);