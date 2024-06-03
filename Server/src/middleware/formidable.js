// middleware/formidable.js
import formidable from 'formidable';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
const createDirectories = () => {
  const directories = ['./uploads/images'];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createDirectories();

const uploadDir = path.join(__dirname, '../../uploads/images');

const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB limit
  filter: ({ name, originalFilename, mimetype }) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return allowedTypes.includes(mimetype);
  }
});

const formidableMiddleware = (req, res, next) => {
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }
    req.body = fields;
    req.file = files.file;
    next();
  });
};

export default formidableMiddleware;
