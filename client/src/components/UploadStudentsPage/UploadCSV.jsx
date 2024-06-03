import React, { useState } from 'react';

const UploadCSV = () => {
  const [files, setFiles] = useState([]);

  const handleFileInputChange = (event) => {
    const fileList = event.target.files;
    setFiles([...files, ...fileList]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    setFiles([...files, ...fileList]);
  };

  const handleDelete = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSubmit = () => {
    alert(`Submitted Files:\n${files.map((file) => file.name).join('\n')}`);
    console.log(files);
  };

  const handleCancel = () => {
    setFiles([]);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-lg">
        <div
          className="border-dashed border-2 border-gray-300 rounded-md py-12 flex flex-col items-center justify-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="mb-3 font-semibold text-gray-700">Drag and drop your files here or</p>
          <input
            id="hidden-input"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
          <button
            className="mt-2 rounded-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white focus:shadow-outline focus:outline-none"
            onClick={() => document.getElementById('hidden-input').click()}
          >
            Select Files
          </button>
        </div>
        <div className="mt-8">
          {files.length === 0 && (
            <div className="w-full text-center">
              <img
                className="mx-auto w-32"
                src="https://via.placeholder.com/150"
                alt="no data"
              />
              <span className="text-sm text-gray-500 block mt-2">No files selected</span>
            </div>
          )}
          {files.map((file, index) => (
            <div key={index} className="border border-gray-300 rounded-md p-3 flex items-center justify-between mt-3">
              <span className="text-gray-700">{file.name}</span>
              <button onClick={() => handleDelete(index)}>
                <svg
                  className="fill-current text-gray-600 w-5 h-5"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 19a9 9 0 100-18 9 9 0 000 18zM5 9a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className={`rounded-sm px-4 py-2 ${
              files.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600'
            } text-white focus:shadow-outline focus:outline-none mr-3`}
            onClick={handleSubmit}
            disabled={files.length === 0}
          >
            Upload Now
          </button>
          <button
            className="rounded-sm px-4 py-2 bg-gray-300 hover:bg-gray-400 focus:shadow-outline focus:outline-none"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
