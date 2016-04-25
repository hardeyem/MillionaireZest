/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */

var express = require('express');
var controller = require('./admin_auth_controller');

var router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);

module.exports = router;
