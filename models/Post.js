const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
});

// eslint-disable-next-line no-multi-assign
module.exports = mongoose.model("post", postSchema);
