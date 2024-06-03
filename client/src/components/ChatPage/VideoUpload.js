import React, { useState } from 'react';

const VideoUpload = ({ onVideoChange }) => {
    const [video, setVideo] = useState(null);

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setVideo(e.target.result);
                onVideoChange(file); // Pass the file to the parent component
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="video-upload mb-4">
            {video && (
                <div className="video-preview mb-4 w-full h-40 overflow-hidden">
                    <video src={video} alt="Selected" className="w-full h-full object-cover rounded" controls />
                </div>
            )}
            <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" id="video-upload-input" />
            <label
                htmlFor="video-upload-input"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer"
            >
                Post Video
            </label>
        </div>
    );
};

export default VideoUpload;
