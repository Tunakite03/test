'use strict';
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).single('file');
const cloudinary = require('cloudinary').v2;

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

            const folderName = 'images';
            const newFileName = req.file.filename;

            // Upload file to Cloudinary
            cloudinary.uploader
                  .upload(req.file.path, {
                        public_id: newFileName,
                        folder: folderName,
                  })
                  .then((result) => {
                        res.json({ metaData: result });
                  })
                  .catch((error) => {
                        console.error('Cloudinary upload error:', error);
                        res.status(500).json({ error: 'Error uploading to Cloudinary' });
                  });
      });
});

module.exports = router;
