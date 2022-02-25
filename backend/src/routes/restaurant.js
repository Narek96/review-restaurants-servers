const guard = require('express-jwt-permissions')({
  requestProperty: 'user',
  permissionsProperty: 'role'
});
const express = require('express');
const restaurant = express.Router();
const restaurantController = require('../controller/restaurantController');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const roles = require('../config/auth').userRoles;

restaurant.get(
  '/',
  requireAuth,
  guard.check([[roles.ADMIN], [roles.REGULAR], [roles.OWNER]]),
  restaurantController.getRestaurants
); // GET restaurants

restaurant.get(
  '/:id',
  requireAuth,
  guard.check([[roles.REGULAR], [roles.OWNER], [roles.ADMIN]]),
  restaurantController.getRestaurant
); // GET RESTAURANT

restaurant.post(
  '/',
  requireAuth,
  guard.check([[roles.ADMIN], [roles.OWNER]]),
  restaurantController.createRestaurant
); // CRETATE restaurant

restaurant.put(
  '/:id',
  requireAuth,
  guard.check([[roles.ADMIN]]),
  restaurantController.updateRestaurant
); // PUT(update) RESTAURANT

restaurant.delete(
  '/:id',
  requireAuth,
  guard.check([[roles.ADMIN]]),
  restaurantController.deleteRestaurant
); // DELETE RESTAURANT

module.exports = restaurant;
