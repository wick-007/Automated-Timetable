const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

// Get all timetable entries
router.get('/', async (req, res) => {
  try {
    const timetables = await Timetable.find().populate('entries.course entries.lecturer entries.classroom');
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a timetable entry
/*router.post('/', async (req, res) => {
  const { day, time, duration, entries } = req.body;
  try {
    const conflict = await Timetable.findOne({ day, time });
    if (conflict) {
      return res.status(409).json({ message: 'Schedule conflict detected' });
    }

    const timetable = new Timetable({ day, time, duration, entries });
    const newTimetable = await timetable.save();
    res.status(201).json(newTimetable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});*/
// Add a timetable entry with conflict checking based on time and duration
router.post('/', async (req, res) => {
  const { day, time, duration, entries } = req.body;
  
  // Calculate the end time of the new class (start time + duration in hours)
  const [startHour, startMinute] = time.split(':').map(Number);
  const newEndHour = startHour + duration; // New class ends after 'duration' hours

  try {
    // Find any overlapping timetable entry on the same day
    const conflict = await Timetable.findOne({
      day,
      time: {
        $lte: `${newEndHour}:${startMinute.toString().padStart(2, '0')}`, // Ensure time overlap
      },
      // Ensure that no class ends within the same time block
      $where: function () {
        const [conflictHour] = this.time.split(':').map(Number);
        return conflictHour + this.duration > startHour;
      }
    });

    if (conflict) {
      return res.status(409).json({ message: 'Schedule conflict detected' });
    }

    // If no conflicts, save the new timetable entry
    const timetable = new Timetable({ day, time, duration, entries });
    const newTimetable = await timetable.save();
    res.status(201).json(newTimetable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update timetable entry
router.put('/:id', async (req, res) => {
  try {
    const updatedTimetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTimetable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete timetable entry
router.delete('/:id', async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: 'Timetable entry deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
