const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  documents: {
    gateScorecard: {
      type: String, // URL or path to the uploaded file
      required: true,
    },
    casteCertificate: {
      type: String,
      required: true,
    },
    pwdCertificate: {
      type: String,
      required: true,
    },
    ewsCertificate: {
      type: String,
      required: true,
    },
    experienceLetter: {
      type: String,
      required: true,
    },
  },
  validity: {
    gateScorecard: {
      type: Boolean,
      default: true,
    },
    casteCertificate: {
      type: Boolean,
      default: true,
    },
    pwdCertificate: {
      type: Boolean,
      default: true,
    },
    ewsCertificate: {
      type: Boolean,
      default: true,
    },
    experienceLetter: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
