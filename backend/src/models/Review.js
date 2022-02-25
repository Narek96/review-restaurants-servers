const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../connection/connection')
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

class Review extends Model { }

Review.init({
    rate: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    visitDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: true
    },
    commentReply: {
        type: Sequelize.STRING,
        allowNull: true
    }
},
    {
        sequelize,
        timestamps: true,
        modelName: 'review'
    }
);

User.hasMany(Review, { foreignKey: 'reviewerId', onDelete: 'CASCADE', hooks: true });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'users' });

Restaurant.hasMany(Review, { foreignKey: 'restaurantId', onDelete: 'CASCADE', hooks: true });
Review.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurants' });

module.exports = Review;
