var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;
//Need access to our User Model (Roy)
var User = require('../models/user');


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
  },
   function(accessToken, refreshToken, profile, cb) {
    User.findOne({ 'googleId': profile.id }, function(err, user) {
      if (err) return cb(err);
      if (user) {
        return cb(null, user);
      } else {
        // we have a new user via OAuth!
        var newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id
        });
        newUser.save(function(err) {
          if (err) return cb(err);
          return cb(null, newUser);
        });
      }
    });
  }
));

//serializeUser method to give Passport the data
//to put into the session for this authenticated user
passport.serializeUser(function(user, done){
  done(null, user.id);
});

//deserializeUser method to give Passport the user
//from the database we want assigned to the req.user object
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});








