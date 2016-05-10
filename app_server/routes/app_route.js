/**
 * Created by Adekunle Adeyemi on 12/02/2016.
 */

var express = require('express');
var router = express.Router();

module.exports = function(app, baseDir){
  'use strict';

    /* GET users listing. */
    app.route('/users')
        .get(function(req, res, next) {
            console.log('routing from global route');
            res.send('respond with a resource');
    });

    /* GET home page. */
    app.route('/home')
        .get(function(req, res, next) {
            console.log('routing from global route');
            res.render('index', { title: 'Express' });
    });

    app.route('/')
        .get(function(req, res, next){
            console.log('routing from global route to app_client');
            console.log('app path' + baseDir);
            res.sendFile(baseDir + '/main/index.html');
        });

    app.route('/access')
        .get(function(req, res, next){
            console.log('routing user access page');
            console.log('app path' + baseDir);
            res.sendFile(baseDir + '/zealous/access/index.html');
        });

    /*app.route('/access/register')
        .get(function(req, res, next){
            console.log('routing user register');
            console.log('app path' + baseDir);
            res.sendFile(baseDir + '/zealous/access/register/index.html');
        });
*/
    app.route('/zealous')
        .get(function(req, res,next){
            console.log('routing the zealous');
            res.sendFile(baseDir + '/zealous/index.html');
        });
    /*app.route('/zealous/!*')
        .get(function(req, res,next){
            console.log('routing the zealous');
            res.sendFile(baseDir + '/zealous/index.html');
        });*/

    app.route('/gameboard')
        .get(function(req, res,next){
            console.log('routing the gameboard');
            res.sendFile(baseDir + '/zealous/app/gameboard/index.html');
        });
    app.route('/entry')
        .get(function(req, res,next){
            console.log('routing the entry');
            res.sendFile(baseDir + '/zealous/app/entry/index.html');
        });
    app.route('/account')
        .get(function(req, res,next){
            console.log('routing the account');
            res.sendFile(baseDir + '/zealous/app/account/index.html');
        });
    app.route('/profile')
        .get(function(req, res,next){
            console.log('routing the profile');
            res.sendFile(baseDir + '/zealous/app/profile/index.html');
        });
    app.route('/history')
        .get(function(req, res,next){
            console.log('routing the history');
            res.sendFile(baseDir + '/zealous/app/history/index.html');
        });
    app.route('/finalquest')
        .get(function(req, res,next){
            console.log('routing the finalquest');
            res.sendFile(baseDir + '/zealous/app/finalquest/index.html');
        });
    app.route('/settings')
        .get(function(req, res,next){
            console.log('routing settings');
            res.sendFile(baseDir + '/zealous/app/settings/index.html');
        });
    app.route('/hostmania')
        .get(function(req, res, next){
            console.log('routing host');
            res.sendFile(baseDir + '/hostmania/index.html');
        });

    app.route('/authorizer')
        .get(function(req, res, next){
            console.log('routing admin');
            res.sendFile(baseDir + '/authorizer/index.html');
        });


};
/* GET users listing. */