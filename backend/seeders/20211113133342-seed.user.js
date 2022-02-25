'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('users', [
      {
        email: 'admin@reviewer.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin',
        firstName: 'admin',
        lastName: 'admin',
        confirmed: true,
        createdAt:  Sequelize.literal('CURRENT_TIMESTAMP'),
        updatedAt:  Sequelize.literal('CURRENT_TIMESTAMP')
      }
    ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
