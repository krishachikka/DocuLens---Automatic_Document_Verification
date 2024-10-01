import React, { useState } from 'react';
import axios from 'axios';

const OCRComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null); // Store single uploaded file
  const [extractedText, setExtractedText] = useState(null); // Store extracted text
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Track the current step
  const [previousFileName, setPreviousFileName] = useState(''); // Store file name from the first document

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    setSelectedFile(file);
    setError(''); // Reset error when a new file is selected
  };

  const hasUnderscore = (fileName) => {
    // Split the file name into segments
    const segments = fileName.split(/[-.]/); // Split by hyphens or dots
    // Check if any segment contains an underscore
    return segments.some(segment => segment.indexOf('_') !== -1);
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      alert('Please upload an image for extraction.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      const response = await axios.post('http://localhost:3000/extract-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const currentText = response.data.text; // Assuming the API returns an object with a 'text' field
      setExtractedText(currentText); // Update state with extracted text

      if (step === 1) {
        setPreviousFileName(selectedFile.name); // Save the name of the first uploaded file
        setStep(2); // Move to the second step for the next file
        setSelectedFile(null); // Clear the selected file for the next upload
      } else {
        // Use the helper function to check for underscores
        const bothHaveUnderscore = hasUnderscore(previousFileName) && hasUnderscore(selectedFile.name);
        if (bothHaveUnderscore) {
          alert('Both documents belong to the same person.');
        } else {
          alert('The documents do not belong to the same person.');
        }
        setStep(1); // Reset to first step after comparison
        setExtractedText(null); // Clear extracted text for next comparison
        setPreviousFileName(''); // Clear previous file name
      }

    } catch (err) {
      console.error('Error extracting text:', err);
      setError('Error extracting text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>OCR Text Extractor</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleExtractText} disabled={loading}>
        {loading ? 'Extracting...' : (step === 1 ? 'Extract Text (1st File)' : 'Extract Text (2nd File)')}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {extractedText && (
        <div>
          <h2>Extracted Information:</h2>
          <p>{extractedText}</p>
        </div>
      )}
    </div>
  );
};

export default OCRComponent;
