const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../connection/connection');

class RegistrationTokens extends Model { }

RegistrationTokens.init({
    token: {
        type: Sequelize.STRING,
        unique: true
    },
    userId: {
        type: Sequelize.STRING,
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
    },
},
    {
        sequelize,
        modelName: 'registrationTokens'
    })

module.exports = RegistrationTokens;