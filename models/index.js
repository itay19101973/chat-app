const sequelize = require('./database');
const User = require('./User');
const Message = require('./Message');

// Define associations
Message.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'userId' });

// Sync all models
async function syncDatabase() {
    try {
        await sequelize.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

module.exports = {
    sequelize,
    User,
    Message,
    syncDatabase
};