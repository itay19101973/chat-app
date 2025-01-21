const User = require('../models/User');
const { Op } = require('sequelize');

exports.validateEmail = (email) => {
    const [localPart, domain] = email.split('@');
    return localPart.length >= 3 &&
        domain.length <= 32 &&
        /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+$/.test(email);
};

exports.validateName = (value) => {
    return value.length >= 3 &&
        value.length <= 32 &&
        /^[a-zA-Z]+$/.test(value);
};