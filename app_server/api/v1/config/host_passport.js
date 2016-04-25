/**
 * Created by Adekunle Adeyemi on 03/03/2016.
 */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var HostUser = mongoose.model('HostUser');

passport.use('host', new LocalStrategy({
        usernameField: 'username'
    },
    function(username, password, done) {
        HostUser.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));