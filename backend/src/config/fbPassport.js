const config = require('./index');
const User = require('../models/User');
const FbPassport = require('passport-facebook').Strategy;
const passport = require('passport');

const fbOptions = {
  clientID: config.fbClient,
  clientSecret: config.fbSecret,
  callbackURL: 'http://localhost:4000/auth/social-callback',
  profileFields: ['id', 'name', 'displayName', 'email', 'gender'],
};

const fbLogin = new FbPassport(fbOptions, async (token, refreshToken, profile, done) => {
  try {
    let userData = {
      ...profile._json,
      token
    }
    return done(null, userData);
  } catch (err) {
    return done({
      message: 'Internal error',
      statusCode: 500,
    }, false);
  }
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user, done) {
  done(null, user);
});

passport.use(fbLogin);
