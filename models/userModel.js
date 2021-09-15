const mongoose = require('mongoose');
module.exports = mongoose.model("User", new mongoose.Schema({
    username: {
        type: String,
        require: [true, "User must have a username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "User must have a password"]
    }
}))