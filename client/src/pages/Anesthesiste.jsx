import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Anesthesiste() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchPatients();
  }, []); 
  const patientClick = (patientId) => {
    navigate(`/fiche/id/${patientId}`);
  };

  return (
    <>
    <div className="container">
    <h2 className="title1">📂 Dashboard Anesthésiste</h2>
      <h2>Liste des Patients</h2>
      
      {/* 🔍 Barre de recherche */}
      <input
        className="input-field"
        type="text"
        placeholder="🔍 Rechercher par numéro de dossier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📋 Liste des patients */}
      <ul className="patient-list">
        {patients
          .filter((p) => p.numeroDossier.includes(search))
          .map((patient) => (
            <li className="litem" key={patient._id} onClick={() => patientClick(patient._id)}>
              {patient.nom} {patient.prenom} - {patient.numeroDossier}
            </li>
          ))}
      </ul>
    </div>   
 </>

  );
}

export default Anesthesiste;
