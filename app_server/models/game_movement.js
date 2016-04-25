/**
 * Created by Adekunle Adeyemi on 15/02/2016.
 */

/**
 *  Game Movement for monitoring the users in each level schemas
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = mongoose.model('User');


var GameMovementSchema = new Schema({
    phase_1 : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        points : Number

    }],
    phase_2 : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        points : Number
    }],
    phase_3 : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        points : Number
    }],
    phase_4 : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        points : Number
    }],
    phase_5 : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        points : Number
    }],
    phase_6 : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        points : Number
    }],
    phase_7 : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        }
    }],
    phase_8 : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        points : Number
    }],
    final_quest : [{
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        points : Number
    }]

});

module.exports = mongoose.model('GeneralGame', GameMovementSchema);