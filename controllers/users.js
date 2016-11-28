// Require resource's model(s).
var User = require("../models/user");

var index = function(req, res, next){
  User.find({}, function(err, users) {
    if (err) {
      res.json({message: err});
    } else {
      res.render('users/index', {users: users});
    }
  });
};

//Show All users API (Roy)
var indexAPI = function(req, res, next){
  User.find({}, function(err, users) {
    if (err) {
      res.json({message: err});
    } else {
     res.json(users);
    }
  });
};

var show = function(req, res, next){
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.json({message: 'Could not find user because ' + err});
    } else if (!user) {
      res.json({message: 'No user with this id.'});
    } else {
      res.render('users/show', {user: user});
    }
  });
};

//Show One user API (Roy)
var showAPI = function(req, res, next){
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.json({message: 'Could not find user because ' + err});
    } else if (!user) {
      res.json({message: 'No user with this id.'});
    } else {
      res.json(user);
    }
  });
};

//Create New User API (Roy)
var create = function(req, res, next){
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.googleId = req.body.googleId;

    user.save(function(err){
      if(err) res.send(err);
      res.json({message: 'User Created!'});
    });
  };

//Delete User API (Roy)
var destroy = function(req, res, next){
  User.remove({ _id: req.params.id }, function(err, user){
    if(err){
      res.json({ success: false, error: err });
    } else {
      res.json({ success: true, message: "Deleted user!"});
    }
  })
};

//Update a User API (Roy)
function update(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    var userData = req.body;
    if (userData.name && userData.name !== user.name) user.name = userData.name;
    if (userData.email && userData.email !== user.email) user.email = userData.email;
    if (userData.googleId && userData.googleId !== user.googleId) user.googleId = userData.googleId;
    user.save(function(err, updatedUser) {
      if (err) {
        res.json({ success: false, error: err });
      } else {
        res.json({ success: true, user: updatedUser });
      }
    });
  })
};

module.exports = {
  index: index,
  show:  show,
  create: create,
  indexAPI: indexAPI,
  showAPI: showAPI,
  destroy: destroy,
  update: update
};
