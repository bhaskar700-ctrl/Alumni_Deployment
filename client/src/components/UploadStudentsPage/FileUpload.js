import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState(null);

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Set the selected file
    };

    // Handle file upload on form submission
    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file); // 'file' should match the field name expected by the backend

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/students/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('File uploaded successfully');
            console.log(response.data);
        } catch (error) {
            alert('Error uploading file');
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center h-screen">
            <div className=''>
                <form onSubmit={handleUpload} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                            Select file to upload
                        </label>
                        <input type="file" onChange={handleFileChange} 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            id="file" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Upload File
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FileUpload;
