/**
 * Created by Adekunle Adeyemi on 31/01/2016.
 */

var util = {};

util.getCurrentDadteString = function(){

    //////// building a date string for each day for uniquenes //////////////
    var date = new Date();
    var year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getDate();
    month += 1;
    return day + "-"+ month + "-" + year;
};


module.exports =  util;
