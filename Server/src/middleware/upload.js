// middleware/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure directories exist
const createDirectories = () => {
  const directories = ['./uploads/images', './uploads/videos', './uploads/documents'];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createDirectories();

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, './uploads/images');
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, './uploads/videos');
    } else {
      cb(null, './uploads/documents');
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4|mpeg|pdf|doc|docx|ppt|pptx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type. Only JPG, PNG, GIF, MP4, MPEG, PDF, DOC, DOCX, PPT, and PPTX are allowed.');
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 50000000 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('file');

export default upload;
