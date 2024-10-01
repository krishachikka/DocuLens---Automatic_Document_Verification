import React, { useState } from 'react';

const FaceDetection = () => {
    const [image, setImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [faces, setFaces] = useState([]);

    const handleChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        const response = await fetch('http://localhost:5000/detect', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        setFaces(data.faces);
        setResultImage(`data:image/jpeg;base64,${btoa(data.image)}`);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleChange} required />
                <button type="submit">Detect Faces</button>
            </form>
            {resultImage && (
                <div>
                    <h3>Detected Faces: {faces.length}</h3>
                    <img src={resultImage} alt="Detected Faces" />
                </div>
            )}
        </div>
    );
};

export default FaceDetection;
