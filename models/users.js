// models/users.js
const users = [];

module.exports = {
    // Add a new user
    addUser(user) {
        if (this.findByEmail(user.email)) {
            throw new Error("This email is already in use, please choose another one");
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