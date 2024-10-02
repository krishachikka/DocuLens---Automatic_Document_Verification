const mongoose = require('mongoose');

const detailsSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  extractedInfo: {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true }
  },
  verifiedDocuments: { type: [String], default: [] }, // Store the names of verified documents
  approved: { type: Boolean, default: false }, // Field to indicate approval
  notApproved: { type: Boolean, default: false } // Field to indicate not approved
});

const Details = mongoose.model('Details', detailsSchema);
module.exports = Details;
