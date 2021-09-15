const mongoose = require('mongoose');
const postScema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, "Post must have title"],
    },
    body: {
        type: String,
        required: [true, "Post must have a body"]
    }
});
const Post = mongoose.model("Post", postScema);
module.exports = Post