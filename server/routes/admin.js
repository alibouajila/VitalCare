const express = require("express");
const User = require("../models/utilisateur");
const { doctorOnly } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {verifyToken} = require("../middlewares/auth"); 
const router = express.Router();

const ACCESS_TOKEN_SECRET = "user203u";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, type: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "Access denied: not an admin" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, type: admin.type },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Protect all routes with auth and doctorOnly middleware
router.use(verifyToken, doctorOnly);
// GET verified users
router.get("/verified", async (req, res) => {
  try {
    const users = await User.find({ isVerified: true });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching verified users", error: err });
  }
});

// GET not-verified users
router.get("/not-verified", async (req, res) => {
  try {
    const users = await User.find({ isVerified: false });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching non-verified users", error: err });
  }
});

// POST to verify a user
router.post("/verify/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User verified", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error verifying user", error: err });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
});

module.exports = router;
