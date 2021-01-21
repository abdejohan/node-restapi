const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    profession: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    userPosts: {
      type: Array,
      required: false,
    },
    totaltRecipes: {
      type: String,
      required: false,
    },
    totalFollowers: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
