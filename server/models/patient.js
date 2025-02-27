const mongoose = require('mongoose');

const fichePatientSchema = new mongoose.Schema({
  // 🔹 Informations générales du patient
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  numeroDossier: { type: String, required: true, unique: true, trim: true },
  date: { type: Date, default: Date.now },
  age: { type: Number, required: true },
  poids: { type: Number },
  taille: { type: Number },
  groupeSanguin: { type: String, trim: true },
  rhesus: { type: String, trim: true },

  // 🔹 Informations sur les médecins
  medecinAR: { type: String, trim: true },
  chirurgien: { type: String, trim: true },

  // 🔹 Détails de l'opération et historique médical
  diagnostic: { type: String, trim: true },
  interventionPrevue: { type: String, trim: true },
  chirurgieAnesthesie: { type: String, trim: true },
  medicauxGynecoObstetricaux: { type: String, trim: true },
  allergie: { type: String, trim: true },
  medicationEnCours: { type: String, trim: true },

  // 🔹 Évaluation clinique
  respiratoire: { type: String, trim: true },
  cardioVasculaire: { type: String, trim: true },
  autres: { type: String, trim: true },
  intubations: { type: String, trim: true },

  // 🔹 Analyses biologiques
  biochimie: {
    gly: { type: Number },
    uree: { type: Number },
    creat: { type: Number },
    prot: { type: Number },
    na: { type: Number },
    k: { type: Number },
    cl: { type: Number },
    ca: { type: Number },
    ph: { type: Number },
  },

  bilanHepatique: {
    bilirubine: { type: Number },
    asat: { type: Number },
    alat: { type: Number },
    t: { type: Number },
    c: { type: Number },
    pai: { type: Number }
  },

  hemostase: {
    tpInr: { type: Number },
    tck: { type: Number },
    ts: { type: Number }
  },

  nfS: {
    gr: { type: Number },
    gb: { type: Number },
    hb: { type: Number },
    hte: { type: Number },
    pnn: { type: Number },
    plaq: { type: Number }
  },

  // 🔹 Autres explorations et traitement
  autresExplorations: { type: String, trim: true },
  traitement: {
    aArreter: { type: String, trim: true },
    aPoursuivre: { type: String, trim: true }
  },

  // 🔹 Classification et préparation à l'anesthésie
  classe: {
    urgence: { type: Boolean, required: true },
    jeune: { type: Boolean, required: true }
  },

  premedication: {
    veille: { type: String, trim: true },
    jour: { type: String, trim: true }
  },

  antibioprophylaxie: {
    cg: { type: Boolean, default: false },
    pfc: { type: Boolean, default: false },
    autre: { type: String, trim: true }
  },

  // 🔹 Risques et suivi post-opératoire
  risquesMajeurs: { type: String, trim: true },
  protocoleAnesthesique: {
    type: String,
    enum: ["AG", "AL", "ALR"],
    required: true
  },

  postOperatoire: {
    antibiotherapie: { type: Boolean, default: false },
    analgesie: { type: Boolean, default: false },
    anticoagulants: { type: Boolean, default: false }
  }
}, { timestamps: true });

const FichePatient = mongoose.model("FichePatient", fichePatientSchema);

module.exports = FichePatient;
