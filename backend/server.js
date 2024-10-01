// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow cross-origin requests

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be saved to the 'uploads/' directory

// Route to handle file upload and text extraction using Python (pytesseract)
app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = req.file.path; // Get the file path from the uploaded image

    // Spawn Python process for OCR
    const pythonProcess = spawn('python', ['extraction.py', imagePath]);

    let extractedText = '';

    // Capture data from Python script
    pythonProcess.stdout.on('data', (data) => {
        extractedText += data.toString();
    });

    // Handle end of Python script execution
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Error processing image' });
        }

        // Send extracted text to client
        res.json({ extractedText });

        // Delete the image file after extraction
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
