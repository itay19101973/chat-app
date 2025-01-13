// models/users.js
const users = [];

module.exports = {

    validateEmail (email) {
        const [localPart, domain] = email.split('@');
        return localPart.length >= 3 &&
            domain.length <= 32 &&
            /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+$/.test(email);
    },

    validateName(value) {
        return value.length >= 3 &&
            value.length <= 32 &&
            /^[a-zA-Z]+$/.test(value);
    },

    // Add a new user
    addUser(user) {
        if (this.findByEmail(user.email || !this.validateEmail(user.email)  || ! this.validateName(user.firstName)) || !this.validateName(user.lastName) ||
                user.password.length > 32) {
            throw new Error("An error occurred while adding user, please try again.");
        }
        users.push(user);
        console.log(users);
    },

    // Find user by email
    findByEmail(email) {
        return users.find(user => user.email === email);
    },


    // Get all users (for testing purposes)
    getAllUsers() {
        return users;
    }
};