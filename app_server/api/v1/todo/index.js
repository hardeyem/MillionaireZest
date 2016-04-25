'use strict';

var express = require('express');
var controller = require('./todo.controller');

var router = express.Router();

//middleware that is specific to this router
router.use(function timeLog(req, res, next){
    console.log('Welcome from app route');
    console.log('Tme: , Date.now()');
    next();
});

///// Define app route////
router.get('/',  controller.index);
router.get('/hey', function(req,res){console.log('Saying hi'); res.send({"hey":"ewlcome hey"});});
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;