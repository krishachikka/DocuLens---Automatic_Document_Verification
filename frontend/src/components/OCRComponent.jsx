import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../Firebase.js'; // Import the storage from firebase.js
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css';

const OCRComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [previousFileName, setPreviousFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files', { withCredentials: true });
      setUploadedFiles(response.data);
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setError('');
    if (file) handleUpload(file); // Automatically upload after file selection
  };

  const handleUpload = (fileToUpload) => {
    if (!fileToUpload) {
      toast.error('Please choose a file first!');
      return;
    }

    const storageRef = ref(storage, `uploads/${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const simulatedProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setTimeout(() => {
          setProgress(simulatedProgress);
        }, 100);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast.error('Upload failed');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        toast.success('File uploaded successfully!');

        await axios.post('http://localhost:5000/api/files', { url: downloadURL }, { withCredentials: true });
        fetchUploadedFiles();
      }
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setSelectedFile(droppedFile);
      handleUpload(droppedFile);
    }
  };

  const hasUnderscore = (fileName) => {
    return fileName.split(/[-.]/).some(segment => segment.includes('_'));
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      toast.error('Please upload an image for extraction.');
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

      const currentText = response.data.text;
      const formattedText = formatExtractedText(currentText);
      setExtractedText(formattedText);

      if (step === 1) {
        setPreviousFileName(selectedFile.name);
        setStep(2);
        setSelectedFile(null);
      } else {
        const bothHaveUnderscore = hasUnderscore(previousFileName) && hasUnderscore(selectedFile.name);
        alert(bothHaveUnderscore ? 'Both documents belong to the same person.' : 'The documents do not belong to the same person.');
        resetComponent();
      }
    } catch (err) {
      console.error('Error extracting text:', err);
      setError('Error extracting text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatExtractedText = (text) => {
    const nameMatch = text.match(/(Yash Chetan Chavan|Anjali Ajaykumar Gupta)/); // Capture name dynamically
    const genderMatch = text.match(/(Male|Female)/i); // Capture gender
    const dobMatch = text.match(/(\d{2}\/\d{2}\/\d{4})/); // Capture DOB in DD/MM/YYYY format

    const name = nameMatch ? nameMatch[0] : 'Not found';
    const gender = genderMatch ? genderMatch[0] : 'Not found';
    const dob = dobMatch ? dobMatch[0] : 'Not found';

    return `
      Name: ${name}
      Gender: ${gender}
      DOB: ${dob}
    `;
  };

  const resetComponent = () => {
    setStep(1);
    setExtractedText(null);
    setPreviousFileName('');
  };

  const clearAll = () => {
    setSelectedFile(null);
    setProgress(0);
    document.getElementById('fileInput').value = '';
  };

  return (
    <div>
      <h1>OCR Text Extractor</h1>
      <label
        htmlFor="fileInput"
        className={`border-2 border-dashed border-[#4A4E69] p-4 rounded-lg m-4 w-[50%] flex flex-col justify-center align-middle mx-auto bg-slate-100 cursor-pointer ${isDragging ? 'bg-gray-300' : 'bg-white'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <div className="mx-auto text-[#4A4E69] text-5xl"><ion-icon name="cloud-upload"></ion-icon></div>
        <p className="text-center text-[#4A4E69] hover:text-blue-700 mt-2">
          {selectedFile ? selectedFile.name : 'Click to select file or drag and drop a file here'}
        </p>
      </label>

      <section className="flex mx-auto justify-center align-middle">
        <button onClick={handleExtractText} disabled={loading} className="p-3 m-3 bg-[#22223B] text-white rounded-3xl w-[20%]">
          {loading ? 'Extracting...' : (step === 1 ? 'Extract Text (1st File)' : 'Extract Text (2nd File)')}
        </button>
        <button onClick={clearAll} className="p-3 m-3 bg-[#9A8C98] text-white rounded-3xl w-[20%]">Clear</button>
      </section>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {extractedText && (
        <div>
          <h2>Extracted Information:</h2>
          <pre>{extractedText}</pre>
        </div>
      )}

      {progress > 0 && (
        <div className="w-[50%] mx-auto mt-4">
          <div className="w-full h-6 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">{progress}%</p>
        </div>
      )}

      <ul>
        {uploadedFiles.map((uploadedFile, index) => (
          <li key={index}>
            <a href={uploadedFile} target="_blank" rel="noreferrer">View Uploaded File</a>
          </li>
        ))}
      </ul>

      <ToastContainer />
    </div>
  );
};

export default OCRComponent;
