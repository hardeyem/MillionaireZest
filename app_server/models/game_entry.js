/**
 * Created by Adekunle Adeyemi on 15/02/2016.
 */

/**
 *  Question schemas
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = mongoose.model('User');

var EntrySchema = new Schema({
    date : String,
    entries : [{
        entryId : String,
        user : {
            type : Schema.ObjectId,
            ref : User
        },
        socketId : String,
        for : String,
        type : String
    }]

});

module.exports = mongoose.model('Entry', EntrySchema);