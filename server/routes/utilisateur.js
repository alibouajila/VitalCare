const express = require("express");
const Utilisateur = require("../models/utilisateur");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const router = express.Router();

const ACCESS_TOKEN_SECRET = "user203u";
const REFRESH_TOKEN_SECRET = "refresh203u";

router.use(cookieParser()); // Middleware to parse cookies

// Register Route
router.post("/register", async (req, res) => {
  const { nom, prenom, type, num, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const utilisateur = new Utilisateur({
      nom,
      prenom,
      type,
      num,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await utilisateur.save();
    res.status(201).json({ message: "Utilisateur created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur not found" });
    }

    const isMatch = await bcrypt.compare(password, utilisateur.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!utilisateur.isVerified) {
      return res.status(403).json({ message: "Utilisateur not verified" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email, type: utilisateur.type,nom:utilisateur.nom,prenom:utilisateur.prenom },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email, type:utilisateur.type,nom:utilisateur.nom,prenom:utilisateur.prenom },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      type: utilisateur.type
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh Token Route
router.post("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Get refresh token from cookies

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, type: decoded.type },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Access token refreshed", accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout Route (Clears refresh token cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true, 
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
