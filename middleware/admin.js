const jwt = require("jsonwebtoken");

const admin = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No Authentication token found." });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    if (!verified) {
      return res.status(401).json({ msg: "Verification token failed." });
    }
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = admin;
