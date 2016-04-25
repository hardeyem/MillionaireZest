/**
 * Created by Adekunle Adeyemi on 18/02/2016.
 */


var ObjectId = require('mongodb').ObjectID;

var dbs = require("./db");
var util = require("../util/util");

var entry = {};

entry.enterGame = function(userData, callback){

    dbs.connect(function(isConnect , db){
        console.log("got db connected");


        if(isConnect){
            console.log("connected");
            var entryCollection = db.collection('entries');

            //////// building a date string for each day for uniquenes //////////////
            var curDate = util.getCurrentDadteString();
            var _id = new ObjectId(userData.id);

            entryCollection.find({date : curDate, 'entries.user' : _id}, {_id : 1, "entries.user" : 1}).toArray(function(err , doc){
                if(err) throw err;

                console.log(doc);
                /**
                 * check to see if document is not yet created
                */

                var entryId = Math.floor(Date.now() /10000 * 2) + "";
                var entryType;
                for(var i = 0; i < 10; i++){
                    entryType = generateType();
                }

                console.log('got entry doc of ' + typeof doc);
                if(doc == 'undefined' || doc == null || doc.length <1){

                    entryCollection.update({date: curDate}, {
                        $push: {
                            "entries": {
                                "entryId": entryId,
                                "user": _id,
                                "gameFor": userData.type,
                                "gameType": entryType
                            }
                        }
                    },{upsert : true}, function (err, updated) {
                        if (err) {
                            console.log("error adding new entry");
                            callback(false, null, "Database Error");
                        }else {
                            console.log(updated);
                            console.log("entry updated");
                            callback(true, entryId, "User entered");

                            db.close()
                        }
                    });

                    /*var entryType = generateType();
                    console.log('creating new entry');
                    ////// entry not added create new entry for the day /////////////

                    entryCollection.insert({
                        "date" : curDate,
                        "entries" : [{
                            "entryId" : entryId,
                            "user" : _id,
                            "gameFor": userData.type,
                            "gameType" : entryType
                        }]
                    }, function(err, entry){
                        if(err){
                            console.log("error adding new entry");
                            callback(false, null, "Database Error");
                        }
                        console.log("entry updated");
                        callback(true, entryId, "User entered");

                        db.close();
                    })*/
                }else {
                    console.log('found entry with the user');
                    console.log("user with this id has registered before");
                    callback(true, null, "User already registered");

                    /*entryCollection.find({date: curDate, 'entries.user' : _id},{'entries.entryId' : 1}).toArray(function(err, entryDoc){
                        console.log('got entry current entry ' + typeof entryDoc);
                        console.log(entryDoc);
                        if(err){
                            console.log(err);

                            return;
                        }
                        if(entryDoc == undefined || entryDoc == null || entryDoc.length < 1){
                            var entryType = generateType();
                            entryCollection.updateOne({date: curDate}, {
                                $push: {
                                    "entries": {
                                        "entryId": entryId,
                                        "user": _id,
                                        "gameFor": userData.type,
                                        "gameType": entryType
                                    }
                                }
                            }, function (err, updated) {
                                if (err) {
                                    console.log("error adding new entry");
                                    callback(false, null, "Database Error");
                                }else {
                                    console.log(updated);
                                    console.log("entry updated");
                                    callback(true, entryId, "User entered");

                                    db.close()
                                }
                            });
                        } else{
                            //user has already entered game we can't accept any mor e request
                            console.log("user with this id has registered before");
                            callback(true, null, "User already registered");
                        }
                    });*/
                }
            });
        }else{
            console.log("db error from entry provider");
            callback(false, null, "Unable to connect to database");
        }
    });
};

entry.getDetail = function(userId, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){

            var entryCollection = db.collection('entries');
            //////// building a date string for each day for uniquenes //////////////
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            month += 1;
            var dateString = day + "-"+ month + "-" + year;

            var userID = new ObjectId(userId);

            entryCollection.findOne({date : dateString}, function(err, entry){
                if(err){
                    callback(true, err, "Database Error");
                }else{
                    console.log("entry for today");
                    console.log(entry);
                    if(entry == 'undefined' || entry == null) {
                        console.log("inserting new entry");
                        entryCollection.insert({
                            "date": dateString,
                            "entries" : []
                        },function(err, entry){
                            callback(false, entry, "entry not found");
                            db.close()
                        });
                    }else{
                        entryCollection.findOne({date : dateString, 'entries.user' : userID},{'entries.$.entryId' : 1}, function(err, entry) {
                            if(err){

                            }else {
                                if(entry == null){
                                    console.log("user has not entered game");
                                    console.log(entry);
                                    callback(true, entry, "entry not Found");
                                    db.close();
                                }else{

                                    console.log(entry);
                                    console.log("user has entered game");
                                    //entry exists the get the deail

                                    callback(false, entry, "entry Found");
                                    db.close();
                                }

                            }
                        });
                    }
                }
            })

        }else{
            console.log("db error from entry provider");
            callback(false, null, "Unable to connect to database");
        }
    })
};

entry.addSocketId = function(userData, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){

            var entryCollection = db.collection('entries');
            //////// building a date string for each day for uniquenes //////////////
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            month += 1;
            var dateString = day + "-"+ month + "-" + year;

            entryCollection.update({"date" : dateString,"entries.entryId" : userData.entryId},
                {
                    $set : {
                        'entries.$.socketId' : userData.socketId
                    }
                },function(err, updatedRecord){
                    if(err){
                        callback(false);
                    }else{
                        console.log(updatedRecord);
                        callback(true);
                        db.close();
                    }
                }
            );
        }else{
            callback(false);
        }
    });
};

entry.getSocketIdByEntryId = function(entryId, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){
            var entryColl = db.collection('entries');

            var curDate = util.getCurrentDadteString();

            //var entryId = entryId;
            entryColl.find({date : curDate, 'entries.entryId' : entryId},{'entries.socketId' : 1})
                .toArray(function(err, entryDoc){
                    if(err){
                        console.log('error in getting socket id');
                        callback(false, 'could not retrieve socket id');
                    }else{

                        if(entryDoc){

                            console.log(entryDoc);
                            var socketId = entryDoc[0].entries[0].socketId;
                            console.log('got socketId of ' + socketId);
                            callback(true, socketId);
                        }
                    }
            })
        }else{

        }
    }) ;
};

entry.getTotalEntry = function(callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){
            var entryColl = db.collection('entries');

            var curDate = util.getCurrentDadteString();

            //var entryId = entryId;
            entryColl.find({date : curDate},{'entries.entryId' : 1})
                .toArray(function(err, entryDoc){
                    if(err){
                        console.log('error in getting socket id');
                        callback(false, 'could not retrieve socket id');
                    }else{

                        if(entryDoc && entryDoc.length > 0){
                            console.log(entryDoc);
                            var numberOfEntry = entryDoc[0].entries.length;
                            console.log('got socketId of ' + numberOfEntry);
                            callback(true, numberOfEntry);
                        }
                    }
                })
        }else{

        }
    }) ;
};

entry.getAllUsersSocketId = function(callback){
    dbs.connect(function(isConnect , db){
        if(isConnect){
            var entryCollection = db.collection('entries');
            //////// building a date string for each day for uniquenes //////////////
            var date = new Date();
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            month += 1;
            var dateString = day + "-"+ month + "-" + year;

            entryCollection.find({date: dateString}, {'date' : 0, 'entries.user' : 0})
                .toArray(function(err, entries){
                   if(err){
                       callback(false, "error retrieving all entries")
                   } else{
                       callback(true, entries);
                       db.close();
                   }
                });
        }else{
            callback(false, "error connecting to db");
        }
    })  ;
};

entry.getUserIdByEntryId = function(entryId, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){
            var entryColl = db.collection('entries');
            var curDate = util.getCurrentDadteString();
            entryColl.find({date : curDate, 'entries.entryId' : entryId}, {'entries.user' : 1})
                .toArray(function(err, doc){
                    if(err){
                        console.log('error retrieving user id from entry');
                        callback(false, 'error retrieving user id from entry');
                    } else{
                        console.log(doc[0].entries);
                        var userId = doc[0].entries[0].user;
                        console.log(userId);
                        callback(true, userId);
                        db.close();
                    }
                });
        }else{
            console.log('unable to connect database');
            callback(false, 'unable to connect database');
        }
    })  ;
};


entry.getUserEntryIdByUserId = function(userId, callback){
    dbs.connect(function(isConnect, db){
        if(isConnect){
            var entryColl = db.collection('entries');
            var curDate = util.getCurrentDadteString();

            var _id = new ObjectId(userId);
            entryColl.find({date : curDate, 'entries.user' : _id}, {'entries.$.entryId' : 1})
                .toArray(function(err, doc){
                    if(err){
                        console.log('error retrieving user id from entry');
                        callback(false, 'error retrieving user id from entry');
                    } else{
                        console.log(doc);
                        if(doc != null && doc.length > 0 && doc != undefined) {
                            console.log(doc[0].entries);
                            var entryId = doc[0].entries[0].entryId;
                            console.log(entryId);
                            callback(true, entryId);
                            db.close();
                        }else{
                            console.log('no entry for the day');
                        }
                    }
                });
        }else{
            console.log('unable to connect database');
            callback(false, 'unable to connect database');
        }
    })  ;
};

function generateType(){
    var from = 'ABC';
    var rand =  Math.floor((Math.random() * (from.length - 1)));

    console.log('generate round : '+ rand);
    var type = from.charAt(Math.abs(rand));
    type = 'type'+type;
    console.log("round generate " + type);
    return type;

}

entry.newEntry = function(docId, userdata, callback){

};

module.exports = entry;
