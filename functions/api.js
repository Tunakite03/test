const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const path = require('path');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ dest: 'dist/uploads/' }).single('file');
require('dotenv').config();

app.use(express.json());

// Check file type
function checkFileType(file, cb) {
   const filetypes = /jpeg|jpg|png|gif/;
   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
   const mimetype = filetypes.test(file.mimetype);

   if (mimetype && extname) {
      return cb(null, true);
   } else {
      cb('Error: Images Only!');
   }
}

//Get all students
router.get('/', (req, res) => {
   res.send('App is running..');
});

//Create new record
router.post('/add', (req, res) => {
   res.send('New record added.');
});

//delete existing record
router.delete('/', (req, res) => {
   res.send('Deleted existing record');
});

//updating existing record
router.put('/', (req, res) => {
   res.send('Updating existing record');
});

router.post('/upload', (req, res) => {
   upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
         // A Multer error occurred when uploading.
         console.error('Multer error:', err);
         return res.status(500).json({ error: err.message });
      } else if (err) {
         // An unknown error occurred when uploading.
         console.error('Unknown error:', err);
         return res.status(500).json({ error: 'An unknown error occurred' });
      }

      // Everything went fine.
      // Check if a file was uploaded
      if (!req.file) {
         return res.status(400).json({ error: 'No file uploaded.' });
      }
      cloudinary.config({
         cloud_name: 'tunakite03',
         api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });

      const folderName = 'shoes';
      const newFileName = req.file.filename;

      // Upload file to Cloudinary
      cloudinary.uploader
         .upload(req.file.path, {
            public_id: newFileName,
            folder: folderName,
         })
         .then((result) => {
            res.json(result);
         })
         .catch((error) => {
            console.error('Cloudinary upload error:', error);
            res.status(500).json({ error: 'Error uploading to Cloudinary' });
         });
   });
});

// Fallback route for debugging
router.post('/upload-debug', (req, res) => {
   upload(req, res, function (err) {
      console.log('Headers:', req.headers);
      console.log('Body:', req.body);
      console.log('File:', req.file);
      console.log('Files:', req.files);
      if (err instanceof multer.MulterError) {
         console.error('Multer error:', err);
      } else if (err) {
         console.error('Unknown error:', err);
      }
      res.json({
         message: 'Debug information logged',
         error: err ? err.message : null,
         file: req.file,
         body: req.body,
      });
   });
});

app.use('/v1/api', router);
module.exports.handler = serverless(app);
module.exports = app;
