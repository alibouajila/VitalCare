const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { verifyToken } = require("./middlewares/auth");
const utilisateur = require("./routes/utilisateur");
const FichePatient = require("./routes/fiche");
const { router: notificationRoutes } = require("./routes/notifications"); // ✅ Correct import
const http = require("http"); // Import HTTP module
const app = express();
const server = http.createServer(app); // Create an HTTP server

// Import User model
const User = require("./models/utilisateur"); // Add this import

// Initialize Socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.io = io;
// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Register user by saving their socketId to the User model
  socket.on("register", (userId) => {
    User.findOneAndUpdate({ _id: userId }, { socketId: socket.id })
      .then(user => console.log('User socketId saved:', socket.id))
      .catch(err => console.error('Error saving socketId:', err));
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", utilisateur);
app.use("/fiche", FichePatient);
app.use('/notifications', notificationRoutes);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Hospital", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Verify Token Route
app.get("/verify-token", verifyToken, (req, res) => { 
  res.status(200).json({ message: "Token is valid", admin: req.admin });
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
server.listen(3001, () => { 
  console.log("Server is running on http://localhost:3001");
});
