/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

var express = require('express');
var controller = require('./access.controller');

var router = express.Router();

router.get('/', function(req, res){console.log('you cant access this'); res.json({msg : "you can't access this"})});
router.post('/', function(req, res){console.log('you cant access this post'); res.json({msg : "you can't access this post"})});
router.post('/register', controller.register);
router.post('/register-details',controller.registerDetails);
router.post('/login', controller.login);

module.exports = router;