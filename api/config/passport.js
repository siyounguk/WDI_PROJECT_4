var LocalStrategy = require('passport-local').Strategy;
var User         = require("../models/user");
var jwt           = require('jsonwebtoken');

module.exports = function(passport) {
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    firstNameField: 'firstName',
    lastNameField: 'lastName',
    passReqToCallback : true
  }, function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'email' : email }, function(err, user) {

        if (err) return done(err);
        if (user) return done(null, false);

        var newUser       = new User();
        newUser.email  = email;
        newUser.password  = User.encrypt(password);
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;

        newUser.save(function(err) {
          if (err) return done(err);
          return done(null, newUser);
        });
      });
    });
  }));
}