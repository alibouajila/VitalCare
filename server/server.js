const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const { verifyToken } =require('./middlewares/auth') ;
const utilisateur=require("./routes/utilisateur")
const Utilisateur = require('./models/utilisateur')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user",utilisateur)
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Hospital", {
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));
// Use routes
app.get("/verify-token",verifyToken,(req,res)=>{ 
  res.status(200).json({ message: 'Token is valid', admin: req.admin });

})
// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
