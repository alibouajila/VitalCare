const express = require("express");
const FichePatient = require("../models/patient"); 
const { verifyToken } = require("../middlewares/auth");
const router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
  try {
    if (req.user.type !== "medecin") {
      return res.status(403).json({ message: "Accès refusé. Seuls les médecins peuvent ajouter un dossier patient." });
    }
    const {
     nom,prenom,numeroDossier, age, poids, taille, groupeSanguin, rhesus,
      chirurgien, diagnostic, interventionPrevue, chirurgieAnesthesie,
      medicauxGynecoObstetricaux, allergie, medicationEnCours, respiratoire,
      cardioVasculaire, autres, intubations, biochimie, bilanHepatique, hemostase,
      nfS, autresExplorations, traitement, classe, premedication, antibioprophylaxie,
      risquesMajeurs, protocoleAnesthesique, postOperatoire
    } = req.body;

    const newFiche = new FichePatient({
      nom, prenom, numeroDossier, age, poids, taille, groupeSanguin, rhesus,
      medecinAR: `${req.user.nom} ${req.user.prenom}`, 
      chirurgien, diagnostic, interventionPrevue, chirurgieAnesthesie,
      medicauxGynecoObstetricaux, allergie, medicationEnCours, respiratoire,
      cardioVasculaire, autres, intubations, biochimie, bilanHepatique, hemostase,
      nfS, autresExplorations, traitement, classe, premedication, antibioprophylaxie,
      risquesMajeurs, protocoleAnesthesique, postOperatoire
    });

    await newFiche.save();
    res.status(201).json({ message: "Dossier patient ajouté avec succès !", fiche: newFiche });

  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du dossier patient:", error);
    res.status(500).json({ message: "Erreur serveur. Veuillez réessayer plus tard.", error: error.message });
  }
});



module.exports = router;
