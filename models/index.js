const sequelize = require('./database');
const User = require('./User');
const Message = require('./Message');

// Define associations
User.hasMany(Message);
Message.belongsTo(User);

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