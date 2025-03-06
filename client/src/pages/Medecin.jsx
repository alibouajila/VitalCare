import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Medecin.css"; // Import du fichier CSS
function Medecin() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(token);
        if (decoded.type !== "medecin") {
          navigate("/dashboard");
        } else {
          fetchPatients();
        }
      } catch (error) {
        navigate("/login");
      }
    }
  }, [navigate]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [newPatient, setNewPatient] = useState({
    nom: "",
    prenom: "",
    numeroDossier: "",
    age: "",
    poids: "",
    taille: "",
    groupeSanguin: "",
    rhesus: "",
    chirurgien:"",
    diagnostic:"",
    interventionPrevue:"",
    chirurgieAnesthesie:"",
    medicauxGynecoObstetricaux:"",
    allergie:"",
    medicationEnCours:"",
    respiratoire:"",
    cardioVasculaire:"",
    biochimie:{},
    bilanHepatique:{},
    hemostase:{},
    nfS:{},
  });

  const [diagnosticData, setDiagnosticData] = useState({
    biochimie: {
      gly: "", uree: "", creat: "", prot: "", na: "", k: "", cl: "", ca: "", ph: "",
    },
    bilanHepatique: {
      bilirubine: "", asat: "", alat: "", t: "", c: "", pai: "",
    },
    hemostase: {
      tpInr: "", tck: "", ts: "",
    },
    nfS: {
      gr: "", gb: "", hb: "", hte: "", pnn: "", plaq: "",
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState("");
  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:3001/fiche/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setPatients(response.data.fiches);
    } catch (error) {
      console.error("Erreur de récupération des patients:", error);
    }
  };

const handleAddPatient = async (e) => {
  e.preventDefault();
  try {
    const patientWithDiagnosticData = {
      ...newPatient,
      ...diagnosticData, 
    };

    await axios.post("http://localhost:3001/fiche/add", patientWithDiagnosticData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });

    alert("Patient ajouté !");
    fetchPatients(); // Recharge la liste des patients après l'ajout
  } catch (error) {
    console.error("Erreur d'ajout du patient:", error);
  }
};


const handleDiagnosisClick = (diagnosticName) => {
  const keyMapping = {
    "Biochimie": "biochimie",
    "Bilan Hepatique": "bilanHepatique",
    "Hemostase": "hemostase",
    "NFS": "nfS",
  };

  setCurrentDiagnosis(keyMapping[diagnosticName]);
  setIsModalOpen(true);
};


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [category, field] = name.split("."); 

    setDiagnosticData((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    console.log(  );
    setIsModalOpen(false); 
  };

  return (
    <div className="container">
      <h2>Dashboard Médecin</h2>

      {/* 🔍 Barre de recherche */}
      <input
        className="input-field"
        type="text"
        placeholder="Rechercher par numéro de dossier"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📋 Liste des patients */}
      <ul className="patient-list">
        {patients
          .filter((p) => p.numeroDossier.includes(search))
          .map((patient) => (
            <li key={patient._id}>
              {patient.nom} {patient.prenom} - {patient.numeroDossier}
            </li>
          ))}
      </ul>

      {/* ➕ Formulaire d'ajout de patient */}
      <h3>Ajouter un patient</h3>
      <form onSubmit={handleAddPatient} className="form-container">
        <input
          type="text"
          placeholder="Nom"
          className="input-field"
          onChange={(e) => setNewPatient({ ...newPatient, nom: e.target.value })}
        />
        <input
          type="text"
          placeholder="Prénom"
          className="input-field"
          onChange={(e) => setNewPatient({ ...newPatient, prenom: e.target.value })}
        />
        <input
          type="text"
          placeholder="Numéro Dossier"
          className="input-field"
          onChange={(e) => setNewPatient({ ...newPatient, numeroDossier: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          className="input-field"
          onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Poids"
          className="input-field"
          onChange={(e) => setNewPatient({ ...newPatient, poids: e.target.value })}
        />
        <input
          type="text"
          placeholder="Taille"
          className="input-field"
          onChange={(e) => setNewPatient({ ...newPatient, taille: e.target.value })}
        />
        <input
          type="text"
          placeholder="Groupe Sanguin"
          className="input-field"
          onChange={(e) => setNewPatient({ ...newPatient, groupeSanguin: e.target.value })}
        />
        <input
          type="text"
          placeholder="Rhésus"
          className="input-field"
          onChange={(e) => setNewPatient({ ...newPatient, rhesus: e.target.value })}
        />
        <button type="submit" className="submit-btn">
          Ajouter
        </button>
      </form>

      {/* 🔬 Liste des diagnostics */}
      <h3>Liste des diagnostics</h3>
      <ul className="diagnostic-list">
        {["Biochimie", "Bilan Hepatique", "Hemostase", "NFS"].map((diag) => (
          <li key={diag} onClick={() => handleDiagnosisClick(diag)}>
            {diag}
          </li>
        ))}
      </ul>

      {/* Modal pour entrer les valeurs */}
      {isModalOpen && (
        <div className="modal">
          <h3>Entrer les valeurs pour {currentDiagnosis}</h3>

          {/* Dynamic inputs for selected diagnosis */}
          {Object.keys(diagnosticData[currentDiagnosis] || {}).map((key) => (
  <input
    key={key}
    type="number"
    name={`${currentDiagnosis}.${key}`} // Nested field name
    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
    value={diagnosticData[currentDiagnosis][key] || ""}
    onChange={handleInputChange}
  />
))}
    

          <button onClick={handleSubmit} className="submit-btn">
            Enregistrer
          </button>
          <button onClick={handleCloseModal} className="close-btn">
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}

export default Medecin;
