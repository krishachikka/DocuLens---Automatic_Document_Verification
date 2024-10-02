// routes/detailsRoutes.js
const express = require('express');
const { createDetails, getDetails, getAllApplicants, approveApplicant, rejectApplicant } = require('../controllers/detailsController');

const router = express.Router();

router.post('/details', createDetails); // Create new details
router.get('/details', getDetails); // Get all details

// Route to get all applicants
router.get('/applicants', getAllApplicants);
// In your detailsRoutes.js
router.patch('/details/:id/approve', approveApplicant);
router.patch('/details/:id/reject', rejectApplicant);


module.exports = router;
