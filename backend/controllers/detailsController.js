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

const getDetailsByFullName = async (req, res) => {
  const { fullName } = req.params; // Get fullName from request parameters

  try {
    const details = await Details.findOne({ fullName });
    
    if (!details) {
      return res.status(404).json({ message: 'Details not found' });
    }
    
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching details', error });
  }
};

// New function to validate details by fullName
const validateDetailsByFullName = async (req, res) => {
  const { fullName } = req.body; // Get fullName from request body

  try {
    const updatedDetails = await Details.findOneAndUpdate(
      { fullName },
      { isValid: true }, // Update isValid field
      { new: true } // Return the updated document
    );

    if (!updatedDetails) {
      return res.status(404).json({ message: 'Details not found' });
    }
    
    res.status(200).json({ message: 'Details validated successfully', data: updatedDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error updating details', error });
  }
};

module.exports = {
  createDetails,
  getDetails,
  getAllApplicants,
  getDetailsByFullName,
  validateDetailsByFullName // Exporting the new function
};
