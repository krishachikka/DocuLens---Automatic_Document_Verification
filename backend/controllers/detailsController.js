// controllers/detailsController.js
const Details = require('../models/Details');

const createDetails = async (req, res) => {
  const { fullName, dob, gender, imageUrl, extractedInfo } = req.body;

  try {
    const newDetails = new Details({
      fullName,
      dob,
      gender,
      imageUrl,
      extractedInfo
    });

    await newDetails.save();
    res.status(201).json({ message: 'Details saved successfully', data: newDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error saving details', error });
  }
};

const getDetails = async (req, res) => {
  try {
    const details = await Details.find();
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching details', error });
  }
};

const getAllApplicants = async (req, res) => {
  try {
    const applicants = await Details.find(); // Fetch all applicants
    res.status(200).json(applicants);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching applicants' });
  }
};


// In your detailsController.js
const approveApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    await Details.findByIdAndUpdate(id, { approved: true, notApproved: false });
    res.status(200).json({ message: 'Applicant approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving applicant', error });
  }
};

const rejectApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    await Details.findByIdAndUpdate(id, { approved: false, notApproved: true });
    res.status(200).json({ message: 'Applicant rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting applicant', error });
  }
};


module.exports = {
  createDetails,
  getDetails,
  getAllApplicants,
  rejectApplicant,
  approveApplicant
};
