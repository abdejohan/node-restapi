const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  postOwner: {
    type: String,
    required: false,
  },
});

// eslint-disable-next-line no-multi-assign
module.exports = mongoose.model('post', postSchema);
