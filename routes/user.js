const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

// eslint-disable-next-line consistent-return
router.post("/register", async (req, res) => {
  try {
    const { email, password, passwordCheck, userName, role } = req.body;
    if (!password || !passwordCheck || !email || !userName || !role) {
      return res.status(400).json({ msg: "Not all field have been entered." });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be atleast 5 ch  aracters long" });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "The passwords did not match, try again." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "There already exists an account with this email" });
    }
    if (!userName) {
      userName = "friend";
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: passwordHash,
      userName,
      role,
      about: "Write something about yourself :)",
      profession: "-",
      totalRecipes: "gg",
      totaltFollowers: "0",
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all field have been entered." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "No Account found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password, Please try again" });
    }
    if (user.role === "admin") {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_ADMIN);
      res.json({
        token,
        user,
      });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      console.log(user);
      res.json({
        token,
        user,
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
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

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    userName: user.userName,
    id: user._id,
    role: user.role,
    about: user.about,
    profession: user.profession,
    totalRecipes: user.totalRecipes,
    totaltFollowers: user.totaltFollowers,
    createdAt: user.createdAt,
  });
});

router.get("/:id", async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  res.json({
    userName: user.userName,
    id: user._id,
    about: user.about,
    profession: user.profession,
    totalRecipes: user.totalRecipes,
    totaltFollowers: user.totaltFollowers,
    createdAt: user.createdAt,
  });
});

router.patch("/update", auth, async (req, res) => {
  const user = req.user;
  const updates = req.body;
  const options = {
    new: true,
    useFindAndModify: false,
  };
  try {
    if (!user) {
      return res.status(400).json({ msg: "No user found with this id" });
    }
    const updateUser = await User.findByIdAndUpdate(user, updates, options);
    res.json(updateUser);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
