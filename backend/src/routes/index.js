const auth = require('./auth');
const users = require('./users');
const restaurant = require('./restaurant');
const review = require('./review');


module.exports = function(app) {
  app.use('/auth', auth);
  app.use('/user', users),
  app.use('/restaurant', restaurant)
  app.use('/review', review)
};