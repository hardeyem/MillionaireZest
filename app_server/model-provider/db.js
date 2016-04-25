/**
 * Created by Adekunle Adeyemi on 18/02/2016.
 */

var db = {};

db.connect = function(callback){
    var MongoClient = require('mongodb').MongoClient,
    //var dbURI = 'mongodb://remoteZest:zesting@/opt/bitnami/mongodb/tmp/mongodb-27017.sock/mz';//for production
        url = 'mongodb://127.0.0.1:27017/lmq';
    var self = this;
    MongoClient.connect(url, function(err, db) {
        if(err){
            console.log('there is error');
            callback(false, err);

        }
        else{
            console.log("connected");
            callback(true, db);
            db.dbConn = db;
        }
    });
};

db.close = function(){
    db.dbConn.close();
};

module.exports = db;
