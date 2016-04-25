/**
 * Created by TK on 07/02/2016.
 */

var mongoose = require( 'mongoose' );
//var dbURI = 'mongodb://remoteZest:zesting@/opt/bitnami/mongodb/tmp/mongodb-27017.sock/mz';//for production
var dbURI = 'mongodb://localhost/lmq';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});


// For app termination
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});



var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

require("./users");
require("./users_details");
require("./admin_users");
require('./host_users');
require("./questions");
require("./fq_game");
/*
require("./game_entry");
require("./general_game");
require("./game_movement");
require("./game_update");
*/
