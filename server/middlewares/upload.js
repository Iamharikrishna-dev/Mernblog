const multer = require('multer');
const path = require('path');

// Configure Multer to store files in the uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the upload directory
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename by appending the current date and file extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(file.originalname.toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
