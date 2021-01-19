const mongoose = require("mongoose");

const UserSearchSchema = new mongoose.Schema(
  {
    url: String,
    text: String,
    id: Number,
  },
  { collection: "users" }
);

module.exports = mongoose.model("UserSearch", UserSearchSchema);
