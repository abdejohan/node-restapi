const mongoose = require("mongoose");

const SearchSchema = new mongoose.Schema(
  {
    url: String,
    text: String,
    id: Number,
  },
  { collection: "posts" }
);

module.exports = mongoose.model("Search", SearchSchema);
