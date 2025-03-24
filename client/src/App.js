import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Anesthesiste from "./pages/Anesthesiste"
import Medecin  from "./pages/Medecin";
import Fiche from "./pages/Fiche";
import Footer from"./components/Footer"
import ListeDesPatients from "./pages/ListeDesPatients";
import Profile from "./pages/Profile";
import Edit from "./pages/Edit";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/anesthesiste" element={<Anesthesiste />} />
        <Route path="/medecin" element={<Medecin />} />
        <Route path="/fiche/id/:id" element={<Fiche />} />
        <Route path="/liste-des-patients" element={<ListeDesPatients />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit/id/:id" element={<Edit />} />

      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
