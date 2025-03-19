const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { verifyToken } = require("./middlewares/auth");
const utilisateur = require("./routes/utilisateur");
const FichePatient = require("./routes/fiche");
const http = require("http"); // Import HTTP module

const app = express();
const server = http.createServer(app); // Create an HTTP server

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

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", utilisateur);
app.use("/fiche", FichePatient);

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

// Add Patient Route with Notification
app.post("/notif/add-patient", async (req, res) => {
  try {
    const newPatient = new FichePatient(req.body);
    await newPatient.save();

    // Emit notification only if the patient is NOT treated
    if (!newPatient.treated) {
      io.emit("new-patient", { 
        id: newPatient._id,
        nom: newPatient.nom,
        prenom: newPatient.prenom,
        numeroDossier: newPatient.numeroDossier
      });
    }

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ message: "Error adding patient", error });
  }
});

// Start the server
server.listen(3001, () => { 
  console.log("Server is running on http://localhost:3001");
});
