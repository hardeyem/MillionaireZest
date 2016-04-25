/* ---------------------------------------------------------
  Request Session (this call only)
 ------------------------------------------------------------ */
module.exports = function (mongoWrap) { 'use strict';
  var wrap = mongoWrap;
  return function(req, res, next){
    // share mongoWrap and mongoWrap.db with all routes
    // even though it is passed in to each provider
    req.dbWrap = mongoWrap;
    req.db = mongoWrap.db;

    // db keys on owner
    if(req.user){
      // user's unique identifier to key DB records
      req.owner = req.user.email;
      //req.owner = req.user.username;
    }
    next();
  };
};