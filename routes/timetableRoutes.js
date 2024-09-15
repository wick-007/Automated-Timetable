const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { timeToMinutes } = require('../utils/index')

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

router.post('/new', async (req, res) => {
  const { day, time, duration, entries } = req.body;

  // Convert the start and end time of the new entry to minutes
  const startMinutes = timeToMinutes(time);
  const endMinutes = startMinutes + duration * 60;

  try {
    // Extract lecturer and classroom from the entries for conflict checking
    const { lecturer, classroom } = entries[0]; // Assuming the first entry contains key details

    // Convert lecturer and classroom to ObjectId using mongoose
    const lecturerId = new mongoose.Types.ObjectId(lecturer);
    const classroomId = new mongoose.Types.ObjectId(classroom);

    // Log the converted ObjectIds for debugging purposes

    // Find timetable entries that overlap on the same day AND have the same classroom or lecturer
    const conflicts = await Timetable.find({
      day,
      $or: [
        // Check for time overlap with the same lecturer inside entries array
        {
          entries: {
            $elemMatch: {
              lecturer: lecturerId // Same lecturer (ObjectId comparison inside entries array)
            }
          },
          startTime: { $lte: endMinutes }, // Existing entry starts before or at the new entry's end
          endTime: { $gte: startMinutes }  // Existing entry ends after or at the new entry's start
        },
        // Check for time overlap with the same classroom inside entries array
        {
          entries: {
            $elemMatch: {
              classroom: classroomId // Same classroom (ObjectId comparison inside entries array)
            }
          },
          startTime: { $lte: endMinutes }, // Existing entry starts before or at the new entry's end
          endTime: { $gte: startMinutes }  // Existing entry ends after or at the new entry's start
        }
      ]
    });

    // If conflicts exist, return a conflict error
    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Schedule conflict detected: Either classroom or lecturer is double-booked.' });
    }

    // If no conflicts, save the new timetable entry
    const timetable = new Timetable({
      day,
      time,
      duration,
      entries,
      startTime: startMinutes,
      endTime: endMinutes
    });
    
    const newTimetable = await timetable.save();
    res.status(201).json(newTimetable);

  } catch (err) {
    // Log the error message for debugging
    console.error(err);
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
