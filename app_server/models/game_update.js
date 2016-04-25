/**
 * Created by Adekunle Adeyemi on 15/02/2016.
 */

/**
 *  Game update schemas
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = mongoose.model('User');
var Question = mongoose.model('Question');

var GameUpdateSchema = new Schema({
    date : {
        type : String
    },
    start_time : {
        type : String,
        required : true
    },
    game_start : {
        type : Boolean,
        default : false
    },
    game_end : {
        type : Boolean,
        default : false
    },
    game_update : {
        is_general : Boolean,
        phase_level : Number,
        round : Number,
        time_asked : {
            type : Date,
        },
        last_question_asked : {
            type : Schema.ObjectId,
            ref : Question
        }
    },
    questions_asked : [{
        type : Schema.ObjectId,
        ref : Question
    }],
    number_of_entry : Number,
    general_phase_winners : {
        phase_1 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        phase_2 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        phase_3 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        phase_4 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        phase_5 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        phase_6 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        phase_7 : [{
            type: Schema.ObjectId,
            ref : User
        }]
    },
    final_quest_winners : {
        level_1 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_2 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_3 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_4 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_5 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_6 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_7 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_8 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_9 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_10 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_11 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_12 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_13 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_14 : [{
            type: Schema.ObjectId,
            ref : User
        }],
        level_15 : [{
            type: Schema.ObjectId,
            ref : User
        }]
    }
});

module.exports = mongoose.model('GameUpdate', GameUpdateSchema);