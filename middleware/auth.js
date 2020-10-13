const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No Authentication token found.' });
    }
    console.log(process.env.JWT_SECRET);
    console.log(token);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('GOT THIS FAR');
    if (!verified) {
      return res.status(401).json({ msg: 'Verification token failed.' });
    }
    req.user = verified.id;
    console.log(verified.id);
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
