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

module.exports = {
  createDetails,
  getDetails,
};
