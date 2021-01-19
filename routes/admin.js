const router = require("express").Router();
const admin = require("../middleware/admin");
const Post = require("../models/Post");
const User = require("../models/User");

router.delete("/:id", admin, async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post) {
    return res
      .status(400)
      .json({ msg: "No post found with that id connected to current user" });
  }
  const deletedPost = await Post.findByIdAndDelete(req.params.id);
  res.json(deletedPost);
});

router.delete("/user/:id", admin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
