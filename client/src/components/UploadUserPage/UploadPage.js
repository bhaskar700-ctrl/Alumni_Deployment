import React, { useState } from 'react';
import FileUpload from './FileUpload';

const UploadPage = () => {
    const [type, setType] = useState('students');
    const [showUpload, setShowUpload] = useState(false);

    const handleTypeChange = (event) => {
        setType(event.target.value);
        setShowUpload(false); // Hide upload form when type is changed
    };

    const handleShowUpload = () => {
        setShowUpload(true);
    };

    const handleCancelUpload = () => {
        setShowUpload(false);
    };

    return (
        <div className="h-screen rounded-lg mx-auto" style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url("https://www.collegebatch.com/static/clg-gallery/tezpur-university-tezpur-256627.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
            <div className="flex justify-center h-1/2 items-center mb-4">
                <div className='w-1/3 bg-white shadow-md rounded-lg'>
                    <h2 className="text-center text-2xl font-bold">Upload CSV</h2>
                    <div className="my-4 mx-2">
                        <label className="block text-gray-700 text-center text-sm font-bold mb-2">Select Type:</label>
                        <select
                            value={type}
                            onChange={handleTypeChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="students">Students</option>
                            <option value="faculty">Faculty</option>
                            <option value="admins">Admins</option>
                            <option value="alumni">Alumni</option>
                        </select>
                    </div>
                    <div className="flex justify-center mb-2 space-x-2">
                        <button
                            onClick={handleShowUpload}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Proceed to Upload
                        </button>
                        <button
                            onClick={handleCancelUpload}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            {showUpload && <FileUpload type={type} />}
        </div>
    );
};

export default UploadPage;
