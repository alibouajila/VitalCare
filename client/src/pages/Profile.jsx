import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';

function Profile() {
  const [profile, setProfile] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the current user profile from the API
    const token = localStorage.getItem('accessToken');
    axios
      .get('http://localhost:3001/user/userinfos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setProfile({
          ...response.data.user,
          motDePasse: ''
        });
      })
      .catch((error) => console.error('Erreur lors de la récupération du profil', error));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    axios
      .put('http://localhost:3001/user/update-profile',{ nom: profile.nom, prenom: profile.prenom, currentPassword: profile.motDePasse }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setMessage(response.data.message);
      setProfile({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: ''
      });      })
      .catch((error) => {
        if (error.response) {
          setMessage(error.response.data.message || "Erreur inconnue.");
        } else {
          setMessage("Erreur de connexion au serveur.");
        }
        console.error(error);
      });
  };
  return (
    <div className="profile-container">
      <h2 className="title1">Mon Profil</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            name="nom"
            id="nom"
            className="input-field"
            value={profile.nom}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="prenom">Prénom :</label>
          <input
            type="text"
            name="prenom"
            id="prenom"
            className="input-field"
            value={profile.prenom}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            name="email"
            id="email"
            className="input-field"
            value={profile.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="motDePasse">Mot de passe :</label>
          <input
            type="password"
            name="motDePasse"
            id="motDePasse"
            className="input-field"
            value={profile.motDePasse}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn">Mettre à jour</button>
        <p className='reset-password'>Reset password ? </p>
      </form>
    </div>
  );
}

export default Profile;
