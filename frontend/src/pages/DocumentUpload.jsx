import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../Firebase.js'; // Import the storage from firebase.js
import axios from 'axios'; // Import axios for API calls
import { ToastContainer, toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css';

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileURL, setFileURL] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false); // State for drag-and-drop

  // Fetch uploaded files from your backend
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
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) handleUpload(selectedFile); // Automatically upload after file selection
  };

  // Handle file upload
  const handleUpload = (fileToUpload) => {
    if (!fileToUpload) {
      toast.error("Please choose a file first!");
      return;
    }

    const storageRef = ref(storage, `uploads/${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function
        const simulatedProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        
        // Simulate delay in progress for smoother animation
        setTimeout(() => {
          setProgress(simulatedProgress);
        }, 100);  // 100ms delay for smoother progress visualization
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
        toast.error("Upload failed");
      },
      () => {
        // Handle successful uploads
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setFileURL(downloadURL);
          toast.success("File uploaded successfully!");

          // Optionally, save the file URL to your backend (MongoDB)
          await axios.post('http://localhost:5000/api/files', { url: downloadURL }, { withCredentials: true });
          fetchUploadedFiles(); // Refresh the list of uploaded files
        });
      }
    );
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the default behavior
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the default behavior
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the default behavior
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      handleUpload(droppedFile); // Automatically upload after dropping
    }
  };

  const clearAll = () => {
    setFile(null);
    setFileURL('');
    setProgress(0);
    document.getElementById('fileInput').value = ''; // Clear the file input
  };

  return (
    <div>
      <h2 className='text-5xl text-center m-4 mb-8 p-2 font-bold'>Upload Document</h2>
      
      {/* Label wraps the entire section to make the whole div clickable */}
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
          className='hidden'
          id="fileInput"
        />
        <div className='mx-auto text-[#4A4E69] text-5xl'><ion-icon name="cloud-upload"></ion-icon></div>
        <p className="text-center text-[#4A4E69] hover:text-blue-700 mt-2">
          {file ? file.name : 'Click to select file or drag and drop a file here'}
        </p>
      </label>
      
      <section className='flex mx-auto justify-center align-middle'>
        <button onClick={() => handleUpload(file)} className='p-3 m-3 bg-[#22223B] text-white rounded-3xl w-[20%]'>Upload</button>
        <button onClick={clearAll} className='p-3 m-3 bg-[#9A8C98] text-white rounded-3xl w-[20%]'>Clear</button>
      </section>

      {/* Display progress bar */}
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

      {fileURL && (
        <div className='flex flex-col gap-3 text-center'>
          <p>File Uploaded Successfully!</p>
          <button className='bg-slate-700 p-3 rounded-3xl text-white w-[30%] mx-auto hover:border-2 hover:border-[#22223B] hover:bg-[#F2E9E4] hover:text-black hover:font-bold transition-all'>
          <a href={fileURL} target="_blank" rel="noreferrer">
            <ion-icon name="eye" size="small"></ion-icon> View Uploaded File 
          </a>
          </button>
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

      <ToastContainer /> {/* Toast notifications */}
    </div>
  );
};

export default DocumentUpload;