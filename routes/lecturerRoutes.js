const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');

// Get all lecturers
router.get('/', lecturerController.getLecturers);

// Add a new lecturer
router.post('/', lecturerController.createLecturer);

// Update a lecturer
router.put('/:id', lecturerController.updateLecturer);

// Delete a lecturer
router.delete('/:id', lecturerController.deleteLecturer);

// Get all preferences
router.get('/preferences', lecturerController.getPreferences);

// Create a preference
router.post('/preferences', lecturerController.createPreference);

// Create a conflict report
router.post('/conflict-reports', lecturerController.createConflictReport);

module.exports = router;
