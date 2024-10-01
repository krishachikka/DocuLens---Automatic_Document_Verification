import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import '../styles/FaceDetection.css'

const FaceDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const faceCanvasRef = useRef(null);
    const [message, setMessage] = useState("Click the button to start detecting faces.");
    const [detectedFaceImage, setDetectedFaceImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [currentDetection, setCurrentDetection] = useState(null);
    const [comparisonResult, setComparisonResult] = useState(null);
    const [showAnimation, setShowAnimation] = useState(false); // Track animation state
    const [modelsLoaded, setModelsLoaded] = useState(false); // Track if models are loaded

    const loadModels = async () => {
        const MODEL_URL = '/models'; // Adjust this path based on your project structure
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true); // Set to true when models are loaded
    };

    const startVideo = async () => {
        const permissionGranted = window.confirm("This app wants to access your camera. Allow?");
        if (permissionGranted) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                videoRef.current.onloadedmetadata = handleVideoPlay; // Wait for video metadata
            } catch (err) {
                console.error(err);
                setMessage("Unable to access the camera.");
            }
        }
    };

    const handleVideoPlay = async () => {
        if (!modelsLoaded) {
            setMessage("Models are not loaded yet. Please wait.");
            return;
        }

        const canvas = canvasRef.current;

        // Wait for the video dimensions to be ready
        const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };

        if (displaySize.width > 0 && displaySize.height > 0) {
            faceapi.matchDimensions(canvas, displaySize);

            setInterval(async () => {
                if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptors();

                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                    if (detections.length === 1 && detections[0].detection.score > 0.5) {
                        setMessage("One clear face detected!");
                        setCurrentDetection(detections[0]);
                    } else {
                        setMessage("No clear face detected. Please adjust your position.");
                    }
                }
            }, 100);
        } else {
            setMessage("Video dimensions are not ready. Please try again.");
        }
    };

    const captureDetectedFace = () => {
        if (!currentDetection) return;

        const faceCanvas = faceCanvasRef.current;
        const context = faceCanvas.getContext('2d');
        const { x, y, width, height } = currentDetection.detection.box;

        faceCanvas.width = width;
        faceCanvas.height = height;
        context.drawImage(videoRef.current, x, y, width, height, 0, 0, width, height);

        const faceImageURL = faceCanvas.toDataURL();
        setDetectedFaceImage(faceImageURL);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const compareFaces = async () => {
        if (!detectedFaceImage || !uploadedImage) return;

        // Trigger the merging animation
        setShowAnimation(true);

        // Delay to simulate the merging effect, then show the result
        setTimeout(() => {
            setShowAnimation(false);
            setComparisonResult("The images are not the same."); // Display the comparison result
        }, 3000); // Duration of the animation (3 seconds)
    };

    useEffect(() => {
        loadModels();
    }, []);

    return (
        <div className="flex flex-col items-center">
            {!detectedFaceImage && (
                <button
                    onClick={startVideo}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Start Face Detection
                </button>
            )}
            <div className="relative">
                {!detectedFaceImage && (
                    <video
                        ref={videoRef}
                        width="720"
                        height="560"
                        autoPlay
                        muted
                        className="block"
                    />
                )}
                <canvas
                    ref={canvasRef}
                    width="720"
                    height="560"
                    className="absolute top-0 left-0"
                />
                <canvas
                    ref={faceCanvasRef}
                    style={{ display: 'none' }}
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-2 text-white text-center">
                    <h1>{message}</h1>
                </div>
            </div>
            {currentDetection && !detectedFaceImage && (
                <button
                    onClick={captureDetectedFace}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    Capture Face
                </button>
            )}
            {detectedFaceImage && (
                <div className="mt-4">
                    <img
                        src={detectedFaceImage}
                        alt="Detected face"
                        className="border border-gray-300"
                        style={{ width: '200px', height: 'auto' }}
                    />
                </div>
            )}
            {uploadedImage && (
                <div className="mt-4">
                    <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="border border-gray-300"
                        style={{ width: '200px', height: 'auto' }}
                    />
                    <button
                        onClick={compareFaces}
                        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                    >
                        Compare Faces
                    </button>
                </div>
            )}
            {detectedFaceImage && (
                <div className="mt-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="px-4 py-2 border border-gray-300 rounded"
                    />
                </div>
            )}
            {showAnimation && (
                <div className="merging-animation">
                    <img src={detectedFaceImage} alt="Detected" className="animated-image" />
                    <img src={uploadedImage} alt="Uploaded" className="animated-image" />
                </div>
            )}
            {comparisonResult && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">{comparisonResult}</h2>
                </div>
            )}
        </div>
    );
};

export default FaceDetection;
