/**
* Created by Adekunle Adeyemi on 15/02/2016.
*/

/**
 *  Question schemas
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    type : String,
    for : String,
    level : Number,
    question : String,
    asked : {
        type : Boolean,
        default : false
    },
    askedDate : Date,
    options : {
        a : String,
        b : String,
        c : String,
        d : String,
        correct : String
    }
});

module.exports = mongoose.model('Question', QuestionSchema);