import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../Firebase.js'; 
import { ToastContainer, toast } from 'react-toastify'; 
import axios from 'axios'; 
import 'react-toastify/dist/ReactToastify.css';
import '../styles/UploadDoc.css';
import { useNavigate } from 'react-router-dom';

// Checkbox Component
const Checkbox = ({ checked, onChange }) => {
  return (
    <input type="checkbox" checked={checked} onChange={onChange} />
  );
};

// Main Document Upload Component
const DocumentsComponent = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState({
    gateScorecard: null,
    casteCertificate: null,
    pwdCertificate: null,
    ewsCertificate: null,
    experienceLetter: null,
  });
  const [uploadedDocs, setUploadedDocs] = useState({
    gateScorecard: false,
    casteCertificate: false,
    pwdCertificate: false,
    ewsCertificate: false,
    experienceLetter: false,
  });
  const [progress, setProgress] = useState(0);
  const [validity, setValidity] = useState({
    gateScorecard: true,
    casteCertificate: true,
    pwdCertificate: true,
    ewsCertificate: true,
    experienceLetter: true,
  });
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState({});
  const [extractedData, setExtractedData] = useState({
    pwdCertificate: null,
    ewsCertificate: null,
    experienceLetter: null,
  });

  const loadLocalStorageData = () => {
    const storedInfo = localStorage.getItem('extractInfo');
    return storedInfo ? JSON.parse(storedInfo) : {};
  };

  const handleFileChange = (event, docType) => {
    const file = event.target.files[0];
    if (file) {
      if (!documents[docType]) {
        setDocuments((prev) => ({ ...prev, [docType]: file }));
        handleUpload(file, docType);
      } else {
        toast.info(`You have already uploaded a ${docType.replace(/([A-Z])/g, ' $1')}.`);
      }
    }
  };

  const handleUpload = (fileToUpload, docType) => {
    const storageRef = ref(storage, `uploads/${docType}/${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const simulatedProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(simulatedProgress);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast.error('Upload failed');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        toast.success(`${docType.replace(/([A-Z])/g, ' $1')} uploaded successfully!`);

        setUploadedDocs((prev) => ({ ...prev, [docType]: true }));
        setDocuments((prev) => ({ ...prev, [docType]: { file: fileToUpload, url: downloadURL } }));
        setProgress(0);
        setIsSubmitted(true);

        handleExtractText(docType, fileToUpload);
      }
    );
  };

  const handleExtractText = async (docType, file) => {
    if (!file) {
      toast.error('Please upload a file for extraction.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3000/extract-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const extractedInfo = response.data;
      const localStorageData = loadLocalStorageData();
      const fullName = localStorageData.name ? localStorageData.name.toLowerCase() : '';
      const nameMatch = extractedInfo.text.toLowerCase().match(/(?:Name|Mi)\s*[,|]*\s*([A-Za-z\s]+)/);
      const extractedName = nameMatch ? nameMatch[1].trim().toLowerCase() : '';

      // Compare extracted name with local storage name
      const isValid = fullName === extractedName;
      setValidity((prev) => ({ ...prev, [docType]: isValid }));

      if (['pwdCertificate', 'ewsCertificate', 'experienceLetter'].includes(docType)) {
        setExtractedData((prev) => ({ ...prev, [docType]: extractedInfo.text }));
      }

      // Check filename for underscore
      if (file.name.includes('_')) {
        toast.error(`${docType.replace(/([A-Z])/g, ' $1')} verification failed! Please upload again.`);
        setValidity((prev) => ({ ...prev, [docType]: false }));
      } else {
        if (isValid) {
          toast.success(`${docType.replace(/([A-Z])/g, ' $1')} name verified successfully!`);
        } else {
          toast.error(`Name verification failed for ${docType.replace(/([A-Z])/g, ' $1')}.`);
        }
      }
    } catch (err) {
      console.error('Error extracting text:', err);
      toast.error('Error extracting text. Please try again.');
    }
  };

  const handleRemove = async (docType) => {
    const fileRef = ref(storage, `uploads/${docType}/${documents[docType].file.name}`);
    try {
      await deleteObject(fileRef);
      toast.success(`${docType.replace(/([A-Z])/g, ' $1')} removed successfully!`);
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      setUploadedDocs((prev) => ({ ...prev, [docType]: false }));
      setValidity((prev) => ({ ...prev, [docType]: true }));
      setExtractedData((prev) => ({ ...prev, [docType]: null })); // Reset extracted data
    } catch (error) {
      console.error('Remove failed:', error);
      toast.error('Remove failed');
    }
  };

  const handleSubmit = () => {
    const localStorageData = loadLocalStorageData();
    const fullName = localStorageData.name;

    const documentsData = {
      gateScorecard: documents.gateScorecard?.url || null,
      casteCertificate: documents.casteCertificate?.url || null,
      pwdCertificate: documents.pwdCertificate?.url || null,
      ewsCertificate: documents.ewsCertificate?.url || null,
      experienceLetter: documents.experienceLetter?.url || null,
    };

    console.log("Submitting Documents:", documentsData);
    console.log("Submitted by:", fullName);

    const newSubmissionStatus = {};
    Object.keys(uploadedDocs).forEach(docType => {
      newSubmissionStatus[docType] = uploadedDocs[docType] ? 'Uploaded' : 'Not Uploaded';
    });

    setSubmissionStatus(newSubmissionStatus);
    toast.success('Documents submitted temporarily for review!');
  };

  const [finalNotification, setFinalNotification] = useState('');

  const handleFinalSubmit = () => {
      setFinalNotification('All documents submitted. Please wait for approval.');
      localStorage.setItem('finalNotification', 'All documents submitted. Please wait for approval.');
      navigate('/notifications'); // Navigate to the notifications page
  };
  

  const renderDocumentUpload = (docType, label) => {
    const document = documents[docType];
    const bgColorClass = uploadedDocs[docType] ? 'bg-green-100' : 'bg-slate-100'; // Change background color based on upload status
  
    return (
      <div className={`mb-4 m-10 justify-center align-middle items-center ${bgColorClass} p-4 rounded-3xl`}>
        <div 
          className="flex justify-between items-center cursor-pointer border-b"
          onClick={() => setIsOpen((prev) => ({ ...prev, [docType]: !prev[docType] }))}>
          <h2 className="text-lg font-semibold">{label}</h2>
          <span className='text-2xl'>{isOpen[docType] ? '-' : '+'}</span>
        </div>
  
        {isOpen[docType] && (
          <div className="pl-4 pt-2">
            <label className="flex-grow">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, docType)}
                style={{ display: 'none' }}
                id={docType}
              />
              <div
                onClick={() => document.getElementById(docType).click()}
                className="border border-gray-400 p-2 rounded-3xl w-[60%] mx-auto cursor-pointer text-center bg-[#4A4E69] text-white"
              >
                {document && document.file ? document.file.name : `Upload ${label}`}
              </div>
            </label>
            <div className="flex items-center mt-2">
              <Checkbox
                checked={uploadedDocs[docType]}
                onChange={() => {}}
              />
              <span className="ml-2">Uploaded</span>
              {document && (
                <div className="ml-2">
                  <button
                    onClick={() => handleRemove(docType)}
                    className="text-white bg-red-300 p-2 rounded-3xl hover:bg-red-400">
                    Remove
                  </button>
                </div>
              )}
            </div>
            {!validity[docType] && (
              <div className="text-red-600 mt-2">
                Name validation failed for {label}.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">Document Upload</h1>
      <div className='mb-4 m-10 flex justify-between items-center cursor-pointer border-b bg-green-100 p-4 rounded-3xl'>
        <h2 className="text-lg font-semibold">Aadhar Card</h2>
        <ion-icon name="checkmark-circle" size="large"></ion-icon>
      </div>
      {renderDocumentUpload('gateScorecard', 'GATE Scorecard')}
      {renderDocumentUpload('casteCertificate', 'Caste Certificate')}
      {renderDocumentUpload('pwdCertificate', 'PWD Certificate')}
      {renderDocumentUpload('ewsCertificate', 'EWS Certificate')}
      {renderDocumentUpload('experienceLetter', 'Experience Letter')}
      <button 
        onClick={handleSubmit}
        className="bg-[#4A4E69] text-white p-2 rounded-3xl mt-4 w-full">
        Submit
      </button>
      {isSubmitted && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Submission Status</h2>
          <ul>
            {Object.keys(submissionStatus).map((docType) => (
              <li key={docType}>{docType.replace(/([A-Z])/g, ' $1')}: {submissionStatus[docType]}</li>
            ))}
          </ul>
          <button 
            onClick={handleFinalSubmit} // Correctly call the function here
            className="bg-[#C9ADA7] text-white p-2 rounded-3xl mt-4 w-full">
            Final Submit
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default DocumentsComponent;
