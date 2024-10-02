import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../Firebase.js'; 
import { ToastContainer, toast } from 'react-toastify'; 
import axios from 'axios'; 
import 'react-toastify/dist/ReactToastify.css';

const DocumentsComponent = () => {
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
  const [dobData, setDobData] = useState({});
  const [isOpen, setIsOpen] = useState({
    gateScorecard: false,
    casteCertificate: false,
    pwdCertificate: false,
    ewsCertificate: false,
    experienceLetter: false,
  });
  const [validity, setValidity] = useState({
    gateScorecard: true,
    casteCertificate: true,
    pwdCertificate: true,
    ewsCertificate: true,
    experienceLetter: true,
  });

  // Load the extracted info from local storage
  const loadLocalStorageData = () => {
    const storedInfo = localStorage.getItem('extractedInfo');
    return storedInfo ? JSON.parse(storedInfo) : {};
  };

  useEffect(() => {
    const localStorageData = loadLocalStorageData();
    setDobData((prev) => ({
      ...prev,
      gateScorecard: localStorageData.dob,
      casteCertificate: localStorageData.dob,
      pwdCertificate: localStorageData.dob,
      ewsCertificate: localStorageData.dob,
      experienceLetter: localStorageData.dob,
    }));
  }, []);

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

        // Call to extract text after upload
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
      const dob = extractDOB(extractedInfo.text);
      const localStorageData = loadLocalStorageData();
      const storedDob = localStorageData.dob;

      // Check if the extracted DOB matches the stored one
      const isValid = storedDob === dob;

      setValidity((prev) => ({ ...prev, [docType]: isValid })); // Set validity for this document

      // Update validity in local storage
      if (isValid) {
        const updatedInfo = { ...localStorageData, [docType]: { isValid: true, dob } };
        localStorage.setItem('extractedInfo', JSON.stringify(updatedInfo));
      }

    } catch (err) {
      console.error('Error extracting text:', err);
      toast.error('Error extracting text. Please try again.');
    }
  };

  const extractDOB = (text) => {
    const dobMatch = text.match(/(?:Date of Birth|DOB|DOB:|Date of birth|Date of Birth:)\s*(\d{2})[\/-](\d{2})[\/-](\d{4})|(\d{4})[\/-](\d{2})[\/-](\d{2})|(\d{1,2})[\/-](\d{1,2})[\/-](\d{2})/i);

    if (dobMatch) {
      if (dobMatch[1] && dobMatch[2] && dobMatch[3]) {
        return `${dobMatch[1]}/${dobMatch[2]}/${dobMatch[3]}`; // dd/mm/yyyy
      } else if (dobMatch[4] && dobMatch[5] && dobMatch[6]) {
        return `${dobMatch[5]}/${dobMatch[6]}/${dobMatch[4]}`; // yyyy/mm/dd
      } else if (dobMatch[7] && dobMatch[8] && dobMatch[9]) {
        const year = parseInt(dobMatch[9], 10) < 50 ? `20${dobMatch[9]}` : `19${dobMatch[9]}`; // Assume 1900 or 2000
        return `${dobMatch[7]}/${dobMatch[8]}/${year}`; // dd/mm/yy
      }
    }

    return 'Not found';
  };

  const handleRemove = async (docType) => {
    const fileRef = ref(storage, `uploads/${docType}/${documents[docType].file.name}`);
    try {
      await deleteObject(fileRef);
      toast.success(`${docType.replace(/([A-Z])/g, ' $1')} removed successfully!`);
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      setUploadedDocs((prev) => ({ ...prev, [docType]: false }));
      setDobData((prev) => ({ ...prev, [docType]: null }));
      setValidity((prev) => ({ ...prev, [docType]: true })); // Reset validity when document is removed
    } catch (error) {
      console.error('Remove failed:', error);
      toast.error('Remove failed');
    }
  };

  const handleSubmit = async () => {
    const localStorageData = loadLocalStorageData();
    const fullName = localStorageData.Name; // Assuming fullName is stored in localStorage

    // Check if all documents are valid before submitting
    const allDocsValid = Object.keys(validity).every((docType) => validity[docType]);

    if (allDocsValid) {
      try {
        await axios.post('http://localhost:3000/api/details/validate', { fullName });
        toast.success('Documents validated and submitted successfully!');
      } catch (error) {
        console.error('Error validating documents:', error);
        toast.error('Error validating documents. Please try again.');
      }
    } else {
      toast.error('Some documents are invalid. Please correct them before submitting.');
    }
  };

  const renderDocumentUpload = (docType, label) => {
    const document = documents[docType];

    return (
      <div className="mb-4">
        <div 
          className="flex justify-between items-center cursor-pointer border-b"
          onClick={() => setIsOpen((prev) => ({ ...prev, [docType]: !prev[docType] }))}>
          <h2 className="text-lg font-semibold">{label}</h2>
          <span>{isOpen[docType] ? '-' : '+'}</span>
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
                className="border border-gray-400 p-2 rounded cursor-pointer text-center"
              >
                {document && document.file ? document.file.name : `Upload ${label}`}
              </div>
            </label>
            <label className="ml-2">
              <input
                type="checkbox"
                checked={uploadedDocs[docType]}
                readOnly
              />
              <span>Uploaded</span>
            </label>
            {document && (
              <div className="ml-2">
                <button
                  onClick={() => handleRemove(docType)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
            {document && (
              <div className="mt-2">
                {!validity[docType] ? (
                  <p className="text-red-500">Document is incorrect.</p>
                ) : (
                  <p className="text-green-500">Document is correct.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const isAllDocsUploaded = Object.values(uploadedDocs).every(Boolean);

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Upload Documents</h1>
      {renderDocumentUpload('gateScorecard', 'GATE Scorecard')}
      {renderDocumentUpload('casteCertificate', 'Caste Certificate')}
      {renderDocumentUpload('pwdCertificate', 'PWD Certificate')}
      {renderDocumentUpload('ewsCertificate', 'EWS Certificate')}
      {renderDocumentUpload('experienceLetter', 'Experience Letter')}

      {progress > 0 && (
        <div className="w-full h-4 bg-gray-200 rounded mt-2">
          <div
            className="h-full bg-green-500 rounded transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-center mt-1 text-sm">{progress}%</p>
        </div>
      )}

      {isAllDocsUploaded && (
        <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white p-2 rounded">Submit</button>
      )}

      <ToastContainer />
    </div>
  );
};

export default DocumentsComponent;
