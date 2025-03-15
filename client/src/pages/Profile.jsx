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
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState(''); // New state for old password

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

  const handlePasswordChange = (e) => {
    if (e.target.name === 'newPassword') {
      setNewPassword(e.target.value);
    } else if (e.target.name === 'confirmPassword') {
      setConfirmPassword(e.target.value);
    } else if (e.target.name === 'oldPassword') {
      setOldPassword(e.target.value); // Handle old password change
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    axios
      .put(
        'http://localhost:3001/user/update-profile',
        { 
          nom: profile.nom, 
          prenom: profile.prenom, 
          currentPassword: profile.motDePasse 
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        setMessage(response.data.message || "Profil mis à jour avec succès !");
        setProfile({
          nom: '',
          prenom: '',
          email: '',  // Optional: Keep or remove based on your needs
          motDePasse: ''
        });
      })
      .catch((error) => {
        if (error.response) {
          setMessage(error.response.data.message || "Erreur inconnue.");
        } else {
          setMessage("Erreur de connexion au serveur.");
        }
        console.error(error);
      });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const token = localStorage.getItem('accessToken');
    axios
      .put(
        'http://localhost:3001/user/update-password',
        { 
          oldPassword,  
          newPassword 
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        setMessage("Mot de passe réinitialisé avec succès !");
        setShowModal(false); // Close the modal after successful reset
        setNewPassword('');
        setConfirmPassword('');
        setOldPassword(''); // Clear old password field
      })
      .catch((error) => {
        setMessage("Erreur lors de la réinitialisation du mot de passe.");
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

        {/* Reset Password Button */}
        <button
          type="button"
          className="reset-password-btn"
          onClick={() => setShowModal(true)}
        >
          Réinitialiser le mot de passe
        </button>
      </form>

      {/* Modal for Reset Password */}
      {showModal && (
        <div className="modall">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h3>Réinitialiser le mot de passe</h3>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="oldPassword">Ancien mot de passe :</label>
                <input
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  className="input-field"
                  value={oldPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe :</label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="input-field"
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="input-field"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <button type="submit" className="submit-btn">Réinitialiser</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
