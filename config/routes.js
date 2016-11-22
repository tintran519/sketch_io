var express = require('express'),
    router  = new express.Router();

// Auth related routes (Roy)
var passport = require('passport');

// Require controllers.
var pagesController = require('../controllers/pages');
var usersController = require('../controllers/users');

// root path:
// router.get('/', pagesController.welcome);

//Modifying root route to pass req.user to it (Roy)
router.get('/', function(req, res){
  res.render('./pages/index', {user: req.user });
});


//Google OAuth login route (Roy)
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));
// Google OAuth callback route (Roy)
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/',
    failureRedirect : '/'
  }
));

// OAuth logout route (Roy)
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// users resource paths:
router.get('/users',     usersController.index);
router.get('/users/:id', usersController.show);

//RESTful API- Create User Route (Roy)
router.post('/api/users', usersController.create);
//RESTful API- Show All Users (Roy)
router.get('/api/users', usersController.indexAPI);
//RESTful API- Show one user (Roy)
router.get('/api/users/:id', usersController.showAPI);
//RESTful API- Delete a user (Roy)
router.delete('/api/users/:id', usersController.destroy);
//RESTful API- Update a user info (Roy)
router.put('/api/users/:id', usersController.update);

//testing /api path (Roy)
router.get('/api', function(req, res, next){
  res.json({ message: "Sending JSON!"});
});


module.exports = router;
