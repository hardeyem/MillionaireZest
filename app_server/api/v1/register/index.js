/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

var express = require('express');
var controller = require('../access/access.controller');

var router = express.Router();

router.post('/details',controller.registerDetails);


module.exports = router;