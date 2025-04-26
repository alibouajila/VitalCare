const express = require("express");
const Utilisateur = require("../models/utilisateur");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("../middlewares/auth");
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
    if (num.length != 8) {
      return res.status(400).json({ error: "Numéro  doit contenir 8 chiffres" });
    }
    if (error.code === 11000) { 
      return res.status(400).json({ error: "Email already exists" });}


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
    if( utilisateur.type !== "medecin" && utilisateur.type !== "anesthesiste") {   
      return res.status(403).json({ message: "Access denied" });
    }
    const isMatch = await bcrypt.compare(password, utilisateur.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!utilisateur.isVerified) {
      return res.status(403).json({ message: "User not verified!\nContact your administration for verification." });
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
      secure: true, 
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      type: utilisateur.type,
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
      { id: decoded.id, email: decoded.email, type: decoded.type,nom:decoded.nom,prenom:decoded.prenom  },
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
//update infos
router.put("/update-profile", verifyToken, async (req, res) => {
  try {
    const { nom, prenom, currentPassword } = req.body;
    const userId = req.user.id;

    if (!nom && !prenom) {
      return res.status(400).json({ message: "Provide nom or prenom to update" });
    }
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    // Fetch the user from the database
    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Update user data
    const updatedUser = await Utilisateur.findByIdAndUpdate(
      userId,
      { $set: { nom, prenom } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update password
router.put("/update-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.get("/userinfos", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Utilisateur.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Informations utilisateur récupérées avec succès",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


module.exports = router;
