'use strict';

//var _ = require('lodash');
//var Todo = require('./todo.model');

// Get list of todos
exports.index = function(req, res) {
  console.log('you access the api backend');
  return res.json(200, {'msg' : "welcome"});
  //Todo.find(function (err, todos) {
  //  if(err) { return handleError(res, err); }
  //  return res.json(200, todos);
  //});
};

// Get a single todo
exports.show = function(req, res) {
  return res.json(200, {'msg' : "welcome" , "id" : req.params.id});
  /*Todo.findById(req.params.id, function (err, todo) {
    if(err) { return handleError(res, err); }
    if(!todo) { return res.send(404); }
    return res.json(todo);
  });*/
};

// Creates a new todo in the DB.
exports.create = function(req, res) {
  console.log("got create ");
  return res.json(201, res.body);
  /*Todo.create(req.body, function(err, todo) {
    if(err) { return handleError(res, err); }
    return res.json(201, todo);
  });*/
};

// Updates an existing todo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  console.log("got update ");
  return res.json(201, res.body);
  /*Todo.findById(req.params.id, function (err, todo) {
    if (err) { return handleError(res, err); }
    if(!todo) { return res.send(404); }
    var updated = _.merge(todo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, todo);
    });
  });*/
};

// Deletes a todo from the DB.
exports.destroy = function(req, res) {
  console.log("got destroy ");
  return res.json(201, res.body);
  /*Todo.findById(req.params.id, function (err, todo) {
    if(err) { return handleError(res, err); }
    if(!todo) { return res.send(404); }
    todo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });*/
};

function handleError(res, err) {
  return res.send(500, err);
}