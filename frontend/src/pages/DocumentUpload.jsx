import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../Firebase.js'; // Import the storage from firebase.js
import axios from 'axios'; // Import axios for API calls

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileURL, setFileURL] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState({ name: '', dob: '', gender: '' });

  // Fetch uploaded files from your backend (if you store them in MongoDB)
  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files', { withCredentials: true });
      setUploadedFiles(response.data); // Assuming response.data is an array of file URLs
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles(); // Fetch files when component mounts
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) {
      alert("Please choose a file first!");
      return;
    }

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setFileURL(downloadURL);
          alert("File uploaded successfully!");

          // Optionally, save the file URL to your backend (MongoDB)
          await axios.post('http://localhost:5000/api/files', { url: downloadURL }, { withCredentials: true });
          fetchUploadedFiles(); // Refresh the list of uploaded files

          // Call the function to extract data after upload
          extractData(downloadURL); // Pass the downloadURL to your extraction function
        });
      }
    );
  };

  // Function to extract data from the uploaded file (mocking extraction for demonstration)
  const extractData = async (fileURL) => {
    // Mocking the OCR process by simulating a fetch request
    try {
      const response = await axios.get(fileURL); // Replace with actual OCR logic or API call
      const textContent = response.data.text; // Assuming the API returns a similar JSON structure

      // Use regex to extract data
      const nameMatch = textContent.match(/(Yash Chetan Chavan)/);
      const dobMatch = textContent.match(/DOB\s*:\s*(\d{2}\/\d{2}\/\d{4})/);
      const genderMatch = textContent.match(/Male/);

      const name = nameMatch ? nameMatch[0] : 'Not Found';
      const dob = dobMatch ? dobMatch[1] : 'Not Found';
      const gender = genderMatch ? genderMatch[0] : 'Not Found';

      setExtractedData({ name, dob, gender });
    } catch (error) {
      console.error("Error extracting data:", error);
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {progress > 0 && <p>Upload Progress: {progress}%</p>}
      {fileURL && (
        <div>
          <p>File Uploaded Successfully!</p>
          <a href={fileURL} target="_blank" rel="noreferrer">
            View Uploaded File
          </a>
        </div>
      )}

      {extractedData.name && (
        <div>
          <h2>Extracted Data</h2>
          <p><strong>Name:</strong> {extractedData.name}</p>
          <p><strong>DOB:</strong> {extractedData.dob}</p>
          <p><strong>Gender:</strong> {extractedData.gender}</p>
        </div>
      )}

      <ul>
        {uploadedFiles.map((uploadedFile, index) => (
          <li key={index}>
            <a href={uploadedFile} target="_blank" rel="noreferrer">
              View Uploaded File
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentUpload;
