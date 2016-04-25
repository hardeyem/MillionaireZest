/**
 * Created by Adekunle Adeyemi on 24/02/2016.
 */

var ObjectId = require('mongodb').ObjectID;
var UserGame = require('./general_game');
var Entry = require('./entry-provider');
var dbs = require("./db");

var util = require('../util/util');

var userAccount = {};

userAccount.addWinnersEarned = function(userData, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){
            var userAccount = db.collection('users_account');
            //first get all entryId from the current phase
            //second get user by entryId form entries doc
            //then update userAccount
            console.log(userData);
            var userId = userData.userId,
                earn = userData.earn;
                _id = new ObjectId(userId);
            userAccount.update(
                {
                    userId : userId
                },{

                    $set : {
                        last_earned: earn
                        /*last_deposit: 0,
                        last_withdraw: 0,
                        total_deposit: 0,
                        total_withdraw: 0,
                        deposited: [],
                        withdraw: [],
                        paypal_account: {},
                        card: [],
                        history: []*/
                    }, $inc : {
                        wallet : earn,
                        total_earned : earn
                    }
                },{upsert : true}, function(err, updated) {

                    if (err) {
                        console.log(err);
                        callback(false);

                    }
                    else {
                        console.log('user account updated');
                        //console.log(updated);
                        if(updated.result.ok) {
                            callback(true);
                            db.close();
                        }else{
                            console.log('error updating account');
                            callback(false);
                        }
                    }

                });

        }else{
            console.log('unable to connect');
            callback(false);
        }
    })
};

module.exports = userAccount;