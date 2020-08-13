const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { // unique email for each user
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: { // User Image
        type: String
    },
    role: { // Role of user it will be (normal or admin)
        type: Number,
        default: 0
    },
    history: { // order history
        type: Array,
        default: [],
    }
});

module.exports = User = mongoose.model('User', UserSchema)