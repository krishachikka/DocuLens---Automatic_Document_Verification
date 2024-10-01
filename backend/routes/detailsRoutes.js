// routes/detailsRoutes.js
const express = require('express');
const { createDetails, getDetails } = require('../controllers/detailsController');

const router = express.Router();

router.post('/details', createDetails); // Create new details
router.get('/details', getDetails); // Get all details

module.exports = router;
