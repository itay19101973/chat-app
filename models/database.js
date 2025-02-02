/**
 * Sets up and exports a connection to the SQLite database using Sequelize ORM.
 *
 * This instance is configured to use SQLite as the database dialect and
 * stores the database in the `./database.sqlite3` file.
 *
 * @module sequelize
 */

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3',
});

module.exports = sequelize;
