/**
 * Created by Adekunle Adeyemi on 03/03/2016.
 */
var express = require('express');
var controller = require('./host_auth_ctrl');

var router = express.Router();


router.post('/register', controller.register);
router.post('/login', controller.login);

module.exports = router;