const express = require('express');
const router = express.Router();
const LecturerPreference = require('../models/LecturerPreference');

// Get all lecturer preferences
router.get('/', async (req, res) => {
  try {
    const preferences = await LecturerPreference.find();
    res.json(preferences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add lecturer preference
router.post('/', async (req, res) => {
  const preference = new LecturerPreference(req.body);
  try {
    const newPreference = await preference.save();
    res.status(201).json(newPreference);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
