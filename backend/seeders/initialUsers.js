'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('users', [
      {
        email: 'admin@reviewer.com',
        password: '123456',
        role: 'admin',
        firstName: 'admin',
        lastName: 'admin',
        confirmed: true
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
