const mongoose = require("mongoose");

const fichePatientSchema = new mongoose.Schema({
  // 🔹 Informations générales du patient
  treated:{type:Boolean,default:false},
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  numeroDossier: { type: String, required: true, unique: true, trim: true },
  date: { type: Date, default: Date.now },
  age: { type: Number, required: true },
  poids: { type: Number, default: null },
  taille: { type: Number, default: null },
  groupeSanguin: { type: String, trim: true, default: "" },
  rhesus: { type: String, trim: true, default: "" },

  // 🔹 Informations sur les médecins
  medecinAR: { type: String, trim: true, default: "" },
  chirurgien: { type: String, trim: true, default: "" },

  // 🔹 Détails de l'opération et historique médical
  diagnostic: { type: String, trim: true, default: "" },
  chirurgieAnesthesie: { type: String, trim: true, default: "" },
  medicauxGynecoObstetricaux: { type: String, trim: true, default: "" },
  allergie: { type: String, trim: true, default: "" },
  medicationEnCours: { type: String, trim: true, default: "" },

  // 🔹 Évaluation clinique
  respiratoire: { type: String, trim: true, default: "" },
  cardioVasculaire: { type: String, trim: true, default: "" },
  autres: { type: String, trim: true, default: "" },
  intubations: { type: String, trim: true, default: "" },

  // 🔹 Analyses biologiques
  biochimie: {
    gly: { type: Number, default: null },
    uree: { type: Number, default: null },
    creat: { type: Number, default: null },
    prot: { type: Number, default: null },
    na: { type: Number, default: null },
    k: { type: Number, default: null },
    cl: { type: Number, default: null },
    ca: { type: Number, default: null },
    ph: { type: Number, default: null },
  },

  bilanHepatique: {
    bilirubine: { type: Number, default: null },
    asat: { type: Number, default: null },
    alat: { type: Number, default: null },
    t: { type: Number, default: null },
    c: { type: Number, default: null },
    pai: { type: Number, default: null }
  },

  hemostase: {
    tpInr: { type: Number, default: null },
    tck: { type: Number, default: null },
    ts: { type: Number, default: null }
  },

  nfS: {
    gr: { type: Number, default: null },
    gb: { type: Number, default: null },
    hb: { type: Number, default: null },
    hte: { type: Number, default: null },
    pnn: { type: Number, default: null },
    plaq: { type: Number, default: null }
  },

  // 🔹 Autres explorations et traitement
  autresExplorations: { type: String, trim: true, default: "" },
  traitement: {
    aArreter: { type: String, trim: true, default: "" },
    aPoursuivre: { type: String, trim: true, default: "" }
  },

  // 🔹 Classification et préparation à l'anesthésie
  classe: {
    urgence: { type: Boolean, required: true, default: false },
    jeune: { type: Boolean, required: true, default: false },
    paragraphe:{type:String}
  },

  // 🔹 Risques et suivi post-opératoire
  risquesMajeurs: { type: String, trim: true, default: "" },
  protocoleAnesthesique: {
    type: String,
    enum: ["AG", "AL", "ALR"],
    default: "AG"
  },

  postOperatoire: {
    antibiotherapie: { type: Boolean, default: false },
    analgesie: { type: Boolean, default: false },
    anticoagulants: { type: Boolean, default: false }
  }
}, { timestamps: true });

const FichePatient = mongoose.model("FichePatient", fichePatientSchema);

module.exports = FichePatient;
