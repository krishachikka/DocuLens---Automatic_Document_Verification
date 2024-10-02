const Document = require('../models/Document');

exports.saveDocuments = async (req, res) => {
  const { fullName, documents, validity } = req.body;

  try {
    const newDocument = new Document({
      fullName,
      documents,
      validity,
    });

    await newDocument.save();
    return res.status(201).json({ message: 'Documents saved successfully!', document: newDocument });
  } catch (error) {
    console.error('Error saving documents:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
