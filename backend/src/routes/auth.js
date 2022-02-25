require('../config/passport');
const express = require('express');
const passport = require('passport');
const authController = require("../controller/authController");
const auth = express.Router();
const loginToPassport = passport.authenticate('local', { session: false });
const loginToFbPassport = passport.authenticate('facebook');
const fbRedirect = passport.authenticate('facebook', { 
    successMessage: 'successs',
    failureMessage: 'dtmncho ho du vat ches'
 });


auth.post('/register', authController.register);
auth.post('/login', loginToPassport, authController.logIn);
auth.get('/social-login', loginToFbPassport);
auth.get('/social-callback', fbRedirect, authController.socialLogin)
auth.get('/confirm-registration/:token', authController.confirmRegistrationToken);

module.exports = auth;