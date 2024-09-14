const express = require('express');
const router = express.Router();
const ConflictReport = require('../models/ConflictReport');

// Get all conflict reports
router.get('/', async (req, res) => {
  try {
    const reports = await ConflictReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
