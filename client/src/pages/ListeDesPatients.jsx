import React, { useState, useEffect } from "react";
import api from "../utils/api"
import { useNavigate } from "react-router-dom";
function ListeDesPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("http://localhost:3001/fiche/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setPatients(response.data.fiches);
      } catch (error) {
        console.error("Erreur de récupération des patients:", error);
      }
    };
    fetchPatients();
  }, []); 
const AddPatienPage=()=>{
navigate("/")
}
  const patientClick = (patientId) => {
    navigate(`/fiche/id/${patientId}`);
  };

  return (
    <>
    <img onClick={AddPatienPage} className="addpatient2" src="/assets/add.png" alt="Add Icon" width="50" height="50" />
    <div className="container">
      <h2>Liste des Patients</h2>
      
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
            <li className="litem" key={patient._id} onClick={() => patientClick(patient._id)}>
  <span>{patient.nom} {patient.prenom} - {patient.numeroDossier}</span>
  <img className="delete" src="/assets/delete.png" alt="Delete Icon" width="20" height="20" />      
        </li>
          ))}
      </ul>
    </div>   
 </>

  );
}

export default ListeDesPatients;
