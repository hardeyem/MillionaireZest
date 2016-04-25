/**
 * Created by Adekunle Adeyemi on 15/02/2016.
 */

/**
 *  GameUserUpdateSchemas for monitoring user game records
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Entry = mongoose.model('Entry');

var GameUserUpdateSchema = new Schema({
    entry_id : {
        type : Schema.ObjectId,
        ref : Entry
    },
    level : Number,
    point : Number,
    earned : String,
    last_earn : String,
    socket_id : String

});

module.exports = mongoose.model('UserGameUpdate', GameUserUpdateSchema);