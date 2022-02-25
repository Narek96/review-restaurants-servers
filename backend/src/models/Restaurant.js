const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../connection/connection')
const User = require('../models/User')

class Restaurant extends Model { }

Restaurant.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
},
    {
        sequelize,
        timestamps: true,
        modelName: 'restaurant'
    });

User.hasMany(Restaurant, { foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true, as: 'restaurants' })
Restaurant.belongsTo(User, { foreignKey: 'ownerId', as: 'users' })

module.exports = Restaurant;