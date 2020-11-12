const router = require('express').Router();
const { json } = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, ingredients, instructions } = req.body;
    console.log(req.body);
    // validation
    if (!title) {
      return res
        .status(400)
        .json({ msg: 'Post is missing title. title is required' });
    }
    if (!ingredients) {
      return res
        .status(400)
        .json({ msg: 'Post is missing ingredients. ingredients is required.' });
    }
    if (!instructions) {
      return res.status(400).json({
        msg: 'Post is missing instructions. instructions is required.',
      });
    }
    const newPost = new Post({
      title,
      description,
      ingredients,
      instructions,
      userId: req.user,
    });
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/all', auth, async (req, res) => {
  const userPosts = await Post.find({ userId: req.user });
  res.json(userPosts);
});

router.delete('/:id', auth, async (req, res) => {
  const post = await Post.findOne({ userId: req.user, _id: req.params.id });
  if (!post) {
    return res
      .status(400)
      .json({ msg: 'No post found with that id connected to current user' });
  }
  const deletedPost = await Post.findByIdAndDelete(req.params.id);
  res.json(deletedPost);
});

module.exports = router;