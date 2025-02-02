/**
 * Sets up and exports the database connection, models, and session store.
 *
 * - Establishes a connection to the SQLite database using Sequelize.
 * - Synchronizes all models with the database (force sync will drop and recreate tables).
 * - Sets up a session store using Sequelize to store session data in the database.
 *
 * @module database-setup
 */


const sequelize = require('./database');
const User = require('./User');
const Message = require('./Message');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

/**
 * Function to synchronize all models with the database and set up session storage.
 * This will authenticate the connection, sync all models, and sync the session store.
 *
 * @async
 * @function syncDatabase
 * @returns {Promise<void>} Resolves once all models are synchronized.
 */
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