const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// eslint-disable-next-line consistent-return
router.post('/register', async (req, res) => {
  try {
    let {
      // eslint-disable-next-line prefer-const
      email,
      password,
      passwordCheck,
      userName,
      role,
      totaltPosts,
      followerCount,
    } = req.body;
    if (!password || !passwordCheck || !email || !userName || !role) {
      return res.status(400).json({ msg: 'Not all field have been entered.' });
    }
    if (!followerCount) {
      followerCount = 0;
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: 'The password needs to be atleast 5 ch  aracters long' });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: 'The passwords did not match, try again.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'There already exists an account with this email' });
    }
    if (!userName) {
      userName = 'friend';
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: passwordHash,
      userName,
      role,
      totaltPosts,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Not all field have been entered.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'No Account found.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Wrong password, Please try again' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    userName: user.userName,
    id: user._id,
  });
});

router.get('/:id', async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  res.json({
    userName: user.userName,
    id: user._id,
  });
});

module.exports = router;
