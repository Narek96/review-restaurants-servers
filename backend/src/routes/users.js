const guard = require('express-jwt-permissions')({
  requestProperty: 'user',
  permissionsProperty: 'role'
});
const express = require('express');
const users = express.Router();
const usersController = require('../controller/userController');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });
const roles = require('../config/auth').userRoles;
const upload = require('../utils/upload');

users.get(
  '/',
  requireAuth,
  guard.check([[roles.ADMIN]]),
  usersController.getUsers
); // GET USERS


users.put(
  '/change-password/:id',
  requireAuth,
  guard.check([[roles.ADMIN], [roles.OWNER], [roles.REGULAR]]),
  usersController.changeUserPassword
); // CHANGE USER PASSWORD

users.get(
  '/:id',
  requireAuth,
  guard.check([[roles.ADMIN]]),
  usersController.getUser
); // GET USER

users.post(
  '/',
  requireAuth,
  guard.check([[roles.ADMIN]]),
  usersController.createUser
); // POST (Create) USER

users.put(
  '/:id',
  requireAuth,
  guard.check([[roles.ADMIN]]),
  usersController.updateUser
); // PUT (update) USER

users.delete(
  '/:id',
  requireAuth,
  guard.check([[ roles.ADMIN]]),
  usersController.deleteUser
); // DELETE

users.put(
  '/upload-image/:id',
  requireAuth,
  guard.check([[ roles.ADMIN], [roles.OWNER], [roles.REGULAR]]),
  upload.single,
  usersController.changeUserProfileImage
); // Change profile image

module.exports = users;
