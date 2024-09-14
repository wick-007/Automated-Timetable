const Timetable = require('../models/Timetable');
const Course = require('../models/Course');
const Lecturer = require('../models/Lecturer');
const Classroom = require('../models/Classroom');

exports.getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find()
      .populate('course')
      .populate('lecturer')
      .populate('room');
    res.status(200).json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
