import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadCsv, clearMessage } from '../../redux/store/uploadSlice'; // Adjust the path if necessary

function FileUpload({ type }) {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const { status, message, error } = useSelector((state) => state.upload);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        dispatch(uploadCsv({ file, type }));

        // Clear the message after 5 seconds
        setTimeout(() => {
            dispatch(clearMessage());
        }, 5000);
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    return (
        <div className="flex flex-col h-1/2 items-center">
            <div className='w-1/3'>
                <form onSubmit={handleUpload} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                            Select file to upload
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="file"
                                disabled={!!file}
                            />
                            {file && (
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={!file}
                        >
                            Upload File
                        </button>
                    </div>
                </form>
                {status === 'loading' && <p>Uploading...</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
}

export default FileUpload;
