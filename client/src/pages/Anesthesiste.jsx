import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
function Anesthesiste() {
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
  const patientClick = (patientId) => {
    navigate(`/fiche/id/${patientId}`);
  };
  const handleDelete = async (id, event) => {
    event.stopPropagation(); 
    try {
      const response = await api.delete(`http://localhost:3001/fiche/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      if (response.status === 200) {
        setPatients((prevPatients) => prevPatients.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du patient:", error);
    }
  };
  const handleEdit=async(patientId,event)=>{
    event.stopPropagation(); 
    navigate(`/edit/id/${patientId}`);
   }
  return (
    <>
    <div className="container">
    <h2 className="title1">📂 Dashboard Anesthésiste</h2>
      <h2>Liste des Patients</h2>
      <div className="indicators">
        <div className="ind">
      <img src="/assets/blue.png" alt="Delete Icon" width="20" height="20" />     
      <p>Incompleted</p>
        </div>
        <div className="ind">
        <img src="/assets/gris.png" alt="Delete Icon" width="20" height="20" />    
              <p>Treated</p>

        </div>

      </div>
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
    .sort((a, b) => a.treated - b.treated) // Sort untreated (false) first
    .filter((p) => p.numeroDossier.includes(search))
    .map((patient) => (
<li className="litem" id={`${!patient.treated ? "blue-text" : ""}`} key={patient._id} onClick={() => patientClick(patient._id)}>
  <span>{patient.nom} {patient.prenom} - {patient.numeroDossier}</span>
  
  <div className="icons-container">
    {!patient.treated && (
      <img
        onClick={(e) => handleEdit(patient._id, e)}
        className="delete"
        id="edit"
        src="/assets/edit.png"
        alt="Edit Icon"
        width="20"
        height="20"
      />
    )}
    <img
      onClick={(e) => handleDelete(patient._id, e)}
      className="delete"
      src="/assets/delete.png"
      alt="Delete Icon"
      width="20"
      height="20"
    />
  </div>
</li>

    ))}
</ul>

    </div>   
 </>

  );
}

export default Anesthesiste;
