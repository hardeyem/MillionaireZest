/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

var util = {};

util.sendJSONResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

util.getCurrentDadteString = function(){

    //////// building a date string for each day for uniquenes //////////////
    var date = new Date();
    var year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate();
    month += 1;
    var dateString = day + "-"+ month + "-" + year;

    return dateString;
};


module.exports =  util;
    /*function() {
    return{
        sendJSONResponse : function sendResponse(res, status, content){
            res.status(status);
            res.json(content);
        }
    }
}*/