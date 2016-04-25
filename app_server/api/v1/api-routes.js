/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 * Main Application Interface Routes
 */

'use strict';

var express = require('express');
var router = express.Router();
//var errors = require('../components/errors/index');
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var adminAuth = jwt({
    secret : process.env.ADMIN_SECRET,
    userProperty: 'payload'
});

var hostAuth = jwt({
    secret : process.env.HOST_SECRET,
    userProperty: 'payload'
});

/**
 *
 * Handles all api
 * @param app application serever setup
 */
module.exports = function(app){

    ////////////////////////////////////////////////////////////
    /////////////////API ROUTE GOES HERE////////////////////////
    ////////////////////////////////////////////////////////////
    //All Base API route goes here

    //secured REST endpoints(auth via JSON header tokens) with auth check/payload
    app.use('/api/todos', auth, require('./todo/index'));
    app.use('/api/things', auth, require('./thing/index'));
    app.use('/api/users/:id', function(req, res){
        res.json({"msg":"usermsg"});
    });

    //make api user details registration secured
    app.use('/api/register', auth, require('./register/index'));//(userProvider, app.secret))

    //general game entry route
    app.use('/api/game', auth, require('./game/index'));


    //Admin secured REST endpoint
    app.use('/api/admin', adminAuth, require('./admin/index'));

    //host secured REST endpoint
    app.use('/api/host', hostAuth, require('./host/index'));

    //ONLY usecured REST endpoint - Login & registration
    app.use('/api/auth', require('./access/index'));//(userProvider, app.secret))
    app.use('/api/auth/admin', require('./admin/auth/index'));
    app.use('/api/auth/host', require('./host/auth/index'));

    ///////////////////////End API ROUTE//////////////////////////////////////////


};
