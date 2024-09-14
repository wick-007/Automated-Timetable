//const Schedule = require('../models/Schedule');

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('course lecturer classroom');
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new schedule
exports.createSchedule = async (req, res) => {
  const { day, time, duration, course, lecturer, classroom } = req.body;

  const schedule = new Schedule({
    day,
    time,
    duration,
    course,
    lecturer,
    classroom
  });

  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single schedule
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('course lecturer classroom');
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    schedule.day = req.body.day || schedule.day;
    schedule.time = req.body.time || schedule.time;
    schedule.duration = req.body.duration || schedule.duration;
    schedule.course = req.body.course || schedule.course;
    schedule.lecturer = req.body.lecturer || schedule.lecturer;
    schedule.classroom = req.body.classroom || schedule.classroom;

    const updatedSchedule = await schedule.save();
    res.status(200).json(updatedSchedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    await schedule.remove();
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
