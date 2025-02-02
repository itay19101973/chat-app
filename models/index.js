const sequelize = require('./database');
const User = require('./User');
const Message = require('./Message');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Sync all models
async function syncDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
        // Sync the session store
        myStore.sync();
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

const myStore = new SequelizeStore({
    db: sequelize
});

module.exports = {
    sequelize,
    User,
    Message,
    syncDatabase,
    myStore
};