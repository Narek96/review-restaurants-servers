const {sequelize} = require('../connection/connection')
require('../models')

exports.initDb = async function () {
  await sequelize.authenticate();
  console.log('Database authenticate successful.');
  await sequelize.sync();
  console.log('Database sync successful.');
}