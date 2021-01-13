const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false,
  },
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
});

// eslint-disable-next-line no-multi-assign
module.exports = mongoose.model("post", postSchema);
