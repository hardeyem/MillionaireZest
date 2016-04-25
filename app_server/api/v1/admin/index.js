/**
 * Created by Adekunle Adeyemi on 04/03/2016.
 */

var express = require('express');
var controller = require('./admin_controller');

var router = express.Router();

router.get('/gethosts', controller.getHosts);
router.get('/getfinalgamers', controller.getFinalGamers);
router.post('/assign_final_game', controller.assignFinalGame);

module.exports = router;
