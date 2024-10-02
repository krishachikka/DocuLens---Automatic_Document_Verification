// documentRoutes.js

const express = require('express');
const { saveDocuments } = require('../controllers/documentController'); // Adjust the path as necessary

const router = express.Router();

// Route to save documents
router.post('/details/save', saveDocuments);

module.exports = router;
