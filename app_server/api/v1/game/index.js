/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

var express = require('express');
var controller = require('./entry.controller');
var commentCtrl = require('./comment.controller');
var fqController = require('./fqgame.controller');

var router = express.Router();

//new entry handler
router.post('/entry', controller.enterGame);
router.get('/entry-detail', controller.entryDetail);
router.get('/final-detail', controller.finalDetail);
router.get('/final_quest', fqController.fqGame);

router.post('/comment', commentCtrl.newComment);
router.get('/comments', commentCtrl.getComments);

module.exports = router;