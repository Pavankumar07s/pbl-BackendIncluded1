// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true // Make sure email is required
    }
});

module.exports = mongoose.model('User', userSchema);
