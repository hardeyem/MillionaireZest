require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var mongoose = require("mongoose");

var async = require('async');

var passport = require('passport');
var dbConn = require('./app_server/model-provider/db');
var util = require('./app_server/util/util');

///////////////include db configurations /////////////////////
require("./app_server/models/db");



/*var routes = require('./app_server/routes/index');
var users = require('./app_server/routes/users');*/

var app = express();

console.log('*****************************************');
console.log('Currently operating in :' +  process.env.PORT);

///////////passport loading////////////////
require('./app_server/api/v1/config/passport');
require('./app_server/api/v1/config/admin_passport');
require('./app_server/api/v1/config/host_passport');


/**
 * used for storing session
 */
var appCookieSecret = "gm-secret";
var myCookieParser = cookieParser(appCookieSecret);
var sessionStore = new session.MemoryStore();



// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /app_client
app.use(favicon(path.join(__dirname, 'app_client', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(myCookieParser);
app.use(session({
  name : 'connect.session',
  secret: appCookieSecret,
  resave :true,
//    cookie:{
//        secure : false,
////        httpOnly : true
//    },
  saveUninitialized : true,
  store : sessionStore
}));

app.cookie = myCookieParser;
app.sessionStore = sessionStore;


/////////// middleware for rendering static folder ////////////////////////////
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(express.static(path.join(__dirname, 'app_client/access')));
//app.use(express.static(path.join(__dirname, 'app_client/access/login')));
//app.use(express.static(path.join(__dirname, 'app_client/access/register')));
app.use(express.static(path.join(__dirname, 'app_client/app/dashboard')));
app.use(express.static(path.join(__dirname, 'app_client/app/gameboard')));
app.use(express.static(path.join(__dirname, 'app_client/app/entry')));
app.use(express.static(path.join(__dirname, 'app_client/app/finalquest')));
app.use(express.static(path.join(__dirname, 'app_client/app/account')));
app.use(express.static(path.join(__dirname, 'app_client/app/history')));
app.use(express.static(path.join(__dirname, 'app_client/app/settings')));
app.use(express.static(path.join(__dirname, 'app_client/app/profile')));


/////////////////  end the middleware  ////////////////////////////////////////

//app.use(express.static(path.join(__dirname, 'app_client')));

/* replaced with global router
app.use('/', routes);
app.use('/users', users);
*/

var baseDir = path.join(__dirname, 'app_client');
//var clientDir = path.join(__dirname, 'app_client');
console.log(baseDir);
//console.log(clientDir);

/*********Load development questions *****************/
/*dbConn.connect(function(isConnect, db){
  var commColl = db.collection('comments');
  commColl.aggregate([{$match : {date : '28-2-1016'}},{$unwind : '$comments'},{ $lookup : {from : 'users' , localField : 'comments.userId', foreignField : '_id', as : 'userDet'}},{$limit : 2}]).forEach(function(commentDocs){
    console.log(commentDocs.comments);
    console.log(commentDocs.userDet);
  });

      /!*commColl.aggregate([{$lookup : {from : 'users' , localField : 'commentDoc.userId', foreignField : '_id', as : 'userDet'}}], function(err, comm){
        console.log(comm);
      });*!/
});*/

//////////initialize passport as middleware///////////
app.use(passport.initialize());

/**
 * App routing section
 */
//////////Call global view route handler///////////////////////
require('./app_server/routes/app_route')(app, baseDir);
//////////Call global API route handler///////////////////////
require('./app_server/api/v1/api-routes')(app);

/* /App routing */

/**
 * Cron jobs deprecated
 */

//require("./app_server/cron/cron_server");
/*var UserDetail = require('./app_server/models/users_details');
var userId = mongoose.Schema.ObjectId("56d4a21b2f76c8783598aca9");
UserDetail.aggregate([{$match : {_id : userId}},{ $lookup : {from : 'users_account' , localField : 'userId', foreignField : 'userId', as : 'userAccount'}}],
    function(err, doc){
      if(err){
        console.log('error retrieving document for final');

      }else{
        console.log('success retrieving data');
        console.log(doc)
      }
    }
);*/

/**
 *  App Middlewares
 */
/////////Express Route middleware ///////////
app.use(function timeLog(req, res, next){
  console.log('Exprss route called');
  console.log('Time:', Date.now());
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET , POST');
  res.setHeader('Access-Control-Allow-Headers', '-Requested-With,content-type, Authorization');
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/////////////////// error handlers/////////////////////////////////
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
