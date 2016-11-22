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

module.exports = router;
