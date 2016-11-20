var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var userSchema = new mongoose.Schema({
  name:   String,
  //Changed 'handle' to email
  email: String,
  //Creating field for Google ID (Roy)
  googleId: String

});

var User = mongoose.model('User', userSchema);

module.exports = User;
