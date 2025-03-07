import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import "./fiche.css"
const Fiche = () => {
  const navigate=useNavigate()
  const { id } = useParams(); 
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const AddPatienPage=()=>{
    const token=localStorage.getItem("accessToken")
    const decodedToken = jwtDecode(token);
    const type = decodedToken.type;
    if(type==="medecin"){
      navigate("/liste-des-patients")
    }else{
      navigate("/anesthesiste")
    }
  }
  useEffect(() => {
    const fetchFiche = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:3001/fiche/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const ficheData = response.data.fiche;
        // Transform biochimie and bilanHepatique objects into arrays of key-value pairs
        if (ficheData.biochimie && typeof ficheData.biochimie === 'object') {
          ficheData.biochimie = Object.entries(ficheData.biochimie);
        }
  
        if (ficheData.bilanHepatique && typeof ficheData.bilanHepatique === 'object') {
          ficheData.bilanHepatique = Object.entries(ficheData.bilanHepatique);
        }
  
        setFiche(ficheData);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des informations du dossier patient.");
        setLoading(false);
      }
    };
  
    fetchFiche();
  }, [id]);
  

  if (loading) return <div>Chargement des informations...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="patient-info-page">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
        <br></br><br></br><br></br>
<h1>Patient informations</h1>
<img onClick={AddPatienPage} className="addpatient" src="/assets/add.png" alt="Add Icon" width="50" height="50" />
          <section>
            <div className="card-container">
              <div className="card">
              <p><strong>nom:</strong> {fiche.nom}</p>
              <p><strong>penom:</strong> {fiche.prenom}</p>
              <p><strong>Age:</strong> {fiche.age}</p>
                <p><strong>Poids:</strong> {fiche.poids} kg</p>
                <p><strong>Taille:</strong> {fiche.taille} cm</p>
                <p><strong>Groupe Sanguin:</strong> {fiche.groupeSanguin}</p>
                <p><strong>Rhesus:</strong> {fiche.rhesus}</p>
              </div>
              <div className="card">
              <p><strong>Medecin Responsable:</strong> {fiche.medecinAR}</p>
                <p><strong>Chirurgien:</strong> {fiche.chirurgien || 'Non précisé'}</p>
                <p><strong>Diagnostic:</strong> {fiche.diagnostic || 'Non précisé'}</p>
                <p><strong>Intervention Prévue:</strong> {fiche.interventionPrevue || 'Non précisé'}</p>
                <p><strong>Protocole Anesthésique:</strong> {fiche.protocoleAnesthesique || 'Non précisé'}</p>
              </div>
            </div>
          </section>
  
          {/* Render Biochimie */}
          <section>
<h3>Biochimie</h3>
<div className="card">
  {fiche.biochimie.map(([key, value], index) => (
    <p key={index}>
      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>  
      &nbsp;&nbsp;&nbsp;{value ?? 'Non disponible'}
    </p>
  ))}
</div>
          </section>
  
          {/* Render Bilan Hepatique */}
          <section>
          <h3>Bilan Hepatique</h3>
<div className="card">
  {fiche.bilanHepatique.map(([key, value], index) => (
    <p key={index}>
      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>  
      &nbsp;&nbsp;&nbsp;{value ?? 'Non disponible'}
    </p>
  ))}
</div>


          </section>
  
          {/* Render Hemostase */}
          <section>
            <h3>Hemostase</h3>
            <div className="card">
              {Object.entries(fiche.hemostase).map(([key, value]) => (
                <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> &nbsp;&nbsp;&nbsp;{value ?? 'Non disponible'}</p>
              ))}
            </div>
          </section>
  
          {/* Render NF S */}
          <section>
            <h3>NFS</h3>
            <div className="card">
              {Object.entries(fiche.nfS).map(([key, value]) => (
                <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>&nbsp;&nbsp;&nbsp; {value ?? 'Non disponible'}</p>
              ))}
            </div>
          </section>
  
          {/* Render Traitement */}
          <section>
            <h3>Traitement</h3>
            <div className="card">
              <p><strong>A arrêter:</strong>&nbsp;&nbsp;&nbsp;{fiche.traitement.aArreter || 'Non précisé'}</p>
              <p><strong>A poursuivre:</strong>&nbsp;&nbsp;&nbsp;{fiche.traitement.aPoursuivre || 'Non précisé'}</p>
            </div>
          </section>
  
          {/* Render Classe */}
          <section>
            <h3>Classe</h3>
            <div className="card">
              <p><strong>Urgence:</strong> &nbsp;&nbsp;&nbsp;{fiche.classe.urgence ? 'Oui' : 'Non'}</p>
              <p><strong>Jeune:</strong>&nbsp;&nbsp;&nbsp; {fiche.classe.jeune ? 'Oui' : 'Non'}</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
  
  
};

export default Fiche;
