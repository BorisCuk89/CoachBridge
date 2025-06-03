// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');

// Jedan fajl
router.post('/single', upload.single('file'), (req, res) => {
  res.json({url: req.file.path});
});

// Više fajlova (sertifikati npr.)
router.post('/multiple', upload.array('files', 5), (req, res) => {
  const urls = req.files.map(file => file.path);
  res.json({urls});
});

module.exports = router;
