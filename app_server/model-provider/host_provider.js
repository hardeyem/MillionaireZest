/**
 * Created by Adekunle Adeyemi on 04/03/2016.
 */
var mongoose = require('mongoose'),
    Host = mongoose.model('HostUser');

var host = {};

host.getAllHost = function(callback){
   Host.find({},{hash : 0, salt : 0, username : 0}, function(err, docs){
       if(err){
           callback(false, 'error retrieving all host');
           throw err;
       }else{
           console.log('find hosts');
           console.log(docs);
           callback(true, docs);
       }
   });
} ;

module.exports = host;

