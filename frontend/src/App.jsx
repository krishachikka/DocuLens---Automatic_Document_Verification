import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin'; // Import Signin page
import LandingPage from './pages/LandingPage'; // Import LandingPage
import Signup from './pages/Signup'; // Import Signup page
import DocumentUpload from './pages/DocumentUpload'; // Import DocumentUpload component
import CameraCapture from './components/FaceDetection'; // Import CameraCapture component
import Navbar from './components/Navbar'; // Import Navbar component
import UserForm from './pages/UserForm'; // Import UserForm component
// import ImageVerification from './pages/ImageVerification'; // Import ImageVerification component
import OCRComponent from './components/OCRComponent';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />  {/* Navbar at the top */}
        <Routes>
          <Route path="/" element={<LandingPage />} />  {/* Landing page route */}
          <Route path="/signin" element={<Signin />} />  {/* Signin route */}
          <Route path="/signup" element={<Signup />} />  {/* Signup route */}
          <Route path="/camera-capture" element={<CameraCapture />} />  {/* Camera capture route */}
          <Route path="/upload" element={<DocumentUpload />} />  {/* Document upload route */}
          <Route path="/text-extract" element={<OCRComponent   />} />  {/* Add the DocumentUpload route */}
          <Route path="/user-form" element={<UserForm />} />  {/* UserForm route */}
          {/* <Route path="/image-verification" element={<ImageVerification />} />  ImageVerification route */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
