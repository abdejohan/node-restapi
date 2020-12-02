const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  userName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  userPosts: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model('user', userSchema);
