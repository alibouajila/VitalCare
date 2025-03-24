import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";
import "./Edit.css";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fiche, setFiche] = useState({
    respiratoire: "",
    cardioVasculaire: "",
    autres: "",
    intubations: "",
    autresExplorations: "",
    traitement: { aArreter: "", aPoursuivre: "" },
    classe: { urgence: false, jeune: false, paragraphe: "" },
    postOperatoire: { antibiotherapie: false, analgesie: false, anticoagulants: false },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if(token){
        try{
        const decoded = jwtDecode(token);
        if (decoded.type === "medecin") {
            navigate("/medecin");
        }
    }catch(error){
        navigate("/login");  
    }}
    const fetchFiche = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`http://localhost:3001/fiche/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Données récupérées :", response.data.fiche);
        setFiche({
          ...response.data.fiche,
          traitement: response.data.fiche.traitement || { aArreter: "", aPoursuivre: "" },
          autresExplorations: response.data.fiche.autresExplorations || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des informations.");
        setLoading(false);
      }
    };

    fetchFiche();
  }, [id,navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");

    setFiche((prev) => {
      if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: type === "checkbox" ? checked : value,
          },
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await api.put(`http://localhost:3001/fiche/update/${id}`, fiche, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Modifications enregistrées avec succès !");
      navigate(`/fiche/id/${id}`);
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <div className="Edit-loading">Chargement...</div>;
  if (error) return <div className="Edit-error">{error}</div>;

  return (
    <div className="Edit-container">
      <h2 className="Edit-title">Modifier la fiche patient</h2>
      <form onSubmit={handleSubmit} className="Edit-form">
        
        {/* Informations médicales */}
        <div className="Edit-section">
          <h3>Informations médicales</h3>
          <label>Respiratoire :</label>
          <input type="text" name="respiratoire" value={fiche.respiratoire} onChange={handleChange} className="Edit-input" />

          <label>Cardio-vasculaire :</label>
          <input type="text" name="cardioVasculaire" value={fiche.cardioVasculaire} onChange={handleChange} className="Edit-input" />
          <label>Intubations :</label>
          <input type="text" name="intubations" value={fiche.intubations} onChange={handleChange} className="Edit-input" />
          <label>Autres :</label>
          <input type="text" name="autres" value={fiche.autres} onChange={handleChange} className="Edit-input" />
          <label>Autres explorations :</label> 
          <input type="text" name="autresExplorations" value={fiche.autresExplorations} onChange={handleChange} className="Edit-input" />
        </div>

        {/* Traitement */}
        <div className="Edit-section">
          <h3>Traitement</h3>
          <label>À arrêter :</label>
          <input type="text" name="traitement.aArreter" value={fiche.traitement.aArreter} onChange={handleChange} className="Edit-input" />

          <label>À poursuivre :</label>
          <input type="text" name="traitement.aPoursuivre" value={fiche.traitement.aPoursuivre} onChange={handleChange} className="Edit-input" />
        </div>

        {/* Classe */}
        <div className="Edit-section">
          <h3>Classe</h3>
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="classe.urgence" 
                checked={fiche.classe.urgence} 
                onChange={handleChange} 
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Urgence
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="classe.jeune" 
                checked={fiche.classe.jeune} 
                onChange={handleChange} 
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Jeune
            </label>
          </div>
          
          <label>Autres :</label>
          <input type="text" name="classe.paragraphe" value={fiche.classe.paragraphe} onChange={handleChange} className="Edit-input" />
        </div>

        {/* Risque majeurs */}
        <div className="Edit-section">
          <h3>Risque majeurs</h3>
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="postOperatoire.antibiotherapie" 
                checked={fiche.postOperatoire.antibiotherapie} 
                onChange={handleChange} 
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Antibiothérapie
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="postOperatoire.analgesie" 
                checked={fiche.postOperatoire.analgesie} 
                onChange={handleChange} 
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Analgésie
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="postOperatoire.anticoagulants" 
                checked={fiche.postOperatoire.anticoagulants} 
                onChange={handleChange} 
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Anticoagulants
            </label>
          </div>
        </div>

        <button type="submit" className="Edit-button">Enregistrer</button>
      </form>
    </div>
  );
};

export default Edit;