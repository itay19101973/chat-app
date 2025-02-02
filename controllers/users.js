const User = require('../models/User');
const { Op } = require('sequelize');

/**
 * Validates the format of an email address.
 * Ensures the email has a valid local part and domain, with specific length constraints.
 *
 * @param {string} email - The email address to be validated.
 * @returns {boolean} Returns true if the email is valid, otherwise false.
 */
exports.validateEmail = (email) => {
    const [localPart, domain] = email.split('@');
    return localPart.length >= 3 &&
        domain.length <= 32 &&
        /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+$/.test(email);
};

/**
 * Validates a name by ensuring it contains only alphabetic characters
 * and falls within the length constraints (between 3 and 32 characters).
 *
 * @param {string} value - The name to be validated.
 * @returns {boolean} Returns true if the name is valid, otherwise false.
 */
exports.validateName = (value) => {
    return value.length >= 3 &&
        value.length <= 32 &&
        /^[a-zA-Z]+$/.test(value);
};