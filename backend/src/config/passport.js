const User = require('../models/User');
const config = require('./auth');
const bcrypt = require('bcrypt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

const localOptions = {
  usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    const user = await User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
    const wrongCredentials = !user || !user.password;
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (wrongCredentials || !passwordMatch) {
      return done({
        message: 'Wrong email or password',
        statusCode: 401,
      }, false);
    }
    if (!user.confirmed) {
      return done({
        message: 'Please confirm your email.',
        statusCode: 403
      }, false);
    }
    return done(null, user);
  } catch (err) {
    return done({
      message: 'Internal error',
      statusCode: 500,
    }, false);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);

  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
