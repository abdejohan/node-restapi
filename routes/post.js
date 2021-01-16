const router = require("express").Router();
const { json } = require("express");
const auth = require("../middleware/auth");
const Post = require("../models/Post");

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, ingredients, instructions, author } = req.body;
    // validation
    if (!title) {
      return res
        .status(400)
        .json({ msg: "Post is missing title. title is required" });
    }
    if (!ingredients) {
      return res.status(400).json({
        msg: "Post is missing ingredients. ingredients are required.",
      });
    }
    if (!instructions) {
      return res.status(400).json({
        msg: "Post is missing instructions. instructions are required.",
      });
    }
    const newPost = new Post({
      title,
      description,
      ingredients,
      instructions,
      author,
      userId: req.user,
    });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/all", async (req, res) => {
  const userPosts = await Post.find({ userId: req.headers.userid });
  res.json(userPosts);
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findOne({ userId: req.user, _id: req.params.id });
  if (!post) {
    return res
      .status(400)
      .json({ msg: "No post found with that id connected to current user" });
  }
  const deletedPost = await Post.findByIdAndDelete(req.params.id);
  res.json(deletedPost);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  if (!post) {
    return res
      .status(400)
      .json({ msg: "No post found with this id connected to current user" });
  }
  const fetchPost = await Post.findById(req.params.id);
  res.json(fetchPost);
});

module.exports = router;
