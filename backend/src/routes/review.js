const guard = require('express-jwt-permissions')({
  requestProperty: 'user',
  permissionsProperty: 'role'
});
const express = require('express');
const review = express.Router();
const reviewController = require('../controller/reviewController');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const roles = require('../config/auth').userRoles;

review.post(
  '/',
  requireAuth,
  guard.check([[roles.REGULAR], [roles.ADMIN]]),
  reviewController.createReview
); // POST REVIEW

review.get(
  '/:id',
  requireAuth,
  guard.check([[roles.REGULAR], [roles.OWNER], [roles.ADMIN]]),
  reviewController.getReview
); // GET REVIEW

review.put(
  '/:id',
  requireAuth,
  guard.check([[roles.OWNER], [roles.ADMIN]]),
  reviewController.updateReview
); // PUT RESTAURANT

review.delete(
  '/:id',
  requireAuth,
  guard.check([[roles.OWNER], [roles.ADMIN]]),
  reviewController.deleteReview
); // DELETE RESTAURANT



module.exports = review;
