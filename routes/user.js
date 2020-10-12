const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// eslint-disable-next-line consistent-return
router.post('/register', async (req, res) => {
  try {
    let {
      // eslint-disable-next-line prefer-const
      email, password, passwordCheck, userName,
    } = req.body;
    if (!password || !passwordCheck || !email) {
      return res.status(400).json({ msg: 'Not all field have been entered.' });
    }
    if (password.length < 5) {
      return res.status(400).json({ msg: 'The password needs to be atleast 5 ch  aracters long' });
    }
    if (password !== passwordCheck) {
      return res.status(400).json({ msg: 'The passwords did not match, try again.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'There already exists an account with this email' });
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
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
