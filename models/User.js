const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['User', 'Admin'],
        default: 'User'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
