/**
 * Created by Adekunle Adeyemi on 05/03/2016.
 */
var express = require('express');
var controller = require('./host_controller');

var router = express.Router();

router.get('/get_host_game', controller.getHostGame);
router.post('/generate_question', controller.generateQuestion);
/*router.get('/getfinalgamers', controller.getFinalGamers);
 router.post('/assign_final_game', controller.assignFinalGame);*/

module.exports = router;