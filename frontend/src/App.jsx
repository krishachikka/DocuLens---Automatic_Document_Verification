import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import Home from './pages/Home';
import Signup from './pages/Signup';
import DocumentUpload from './pages/DocumentUpload';  // Import DocumentUpload component
import CameraCapture from './components/FaceDetection';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/camera-capture" element={<CameraCapture />} />
          <Route path="/upload" element={<DocumentUpload />} />  {/* Add the DocumentUpload route */}
          {/* <Route path='/face-detection' element={<FaceDetection />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
