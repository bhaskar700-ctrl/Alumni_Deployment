import React from 'react';
import FileUpload from './FileUpload'; // Import the FileUpload component you created earlier

function UploadStudentsPage() {
  return (
    <div className=' mb-8 border-2'>
      <h2 className='text-center block'>Upload Students CSV</h2>
      <FileUpload />
    </div>
  );
}

export default UploadStudentsPage;