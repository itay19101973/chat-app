const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Message = require('./Message');


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 32],
            is: /^[a-zA-Z]+$/
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 32],
            is: /^[a-zA-Z]+$/
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            len: [3, 255]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 32]
        }
    }
});


// Define associations
Message.belongsTo(User);
User.hasMany(Message);

module.exports = User;