'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TodoSchema = new Schema({
  todo: String
});

module.exports = mongoose.model('Todo', TodoSchema);
