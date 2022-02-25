const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../connection/connection');
const userRoles = require('../config/auth').userRoles;
const bcrypt = require('bcrypt');

class User extends Model { }

User.init({
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true
    },
    role: {
        type: Sequelize.ENUM('regular', 'owner', 'admin'),
        default: userRoles.REGULAR
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
    },
},
    {
        sequelize,
        timestamps: true,
        modelName: 'user'
    },

)

User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}
module.exports = User;