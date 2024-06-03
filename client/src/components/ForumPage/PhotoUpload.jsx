import React, { useState } from 'react';

const PhotoUpload = ({ onPhotoChange }) => {
    const [photo, setPhoto] = useState(null);

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(e.target.result);
                onPhotoChange(file); // Pass the file to the parent component
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="photo-upload  mb-4">
            {photo && (
                <div className="photo-preview mb-4 w-full h-40 overflow-hidden">
                    <img src={photo} alt="Selected" className="w-full border-2 h-full object-cover rounded" />
                </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photo-upload-input" />
            <label
                htmlFor="photo-upload-input"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer"
            >
                Post Photo
            </label>
        </div>
    );
};

export default PhotoUpload;
