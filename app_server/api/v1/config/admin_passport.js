/**
 * Created by TK on 02/03/2016.
 */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var AdminUser = mongoose.model('AdminUser');

passport.use('admin', new LocalStrategy({
        usernameField: 'username'
    },
    function(username, password, done) {
        AdminUser.findOne({ username: username }, function (err, user) {
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