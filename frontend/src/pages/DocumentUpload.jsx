import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../Firebase.js'; // Import the storage from firebase.js
import axios from 'axios'; // Import axios for API calls

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileURL, setFileURL] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

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
        // Progress function
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
      },
      () => {
        // Handle successful uploads
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setFileURL(downloadURL);
          alert("File uploaded successfully!");

          // Optionally, you can save the file URL to your backend (MongoDB)
          await axios.post('http://localhost:5000/api/files', { url: downloadURL }, { withCredentials: true });
          fetchUploadedFiles(); // Refresh the list of uploaded files
        });
      }
    );
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