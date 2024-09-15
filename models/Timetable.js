const mongoose = require('mongoose');
const { timeToMinutes } = require('../utils/index')

// Define the schema for individual timetable entries
const timetableEntrySchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecturer',
    required: true,
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  }
});

// Define the main timetable schema
const timetableSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  // This is the field to store the time entries
  entries: [timetableEntrySchema],
  // New fields to store start and end times in minutes
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  }
});

// Pre-save middleware to calculate and store startTime and endTime
timetableSchema.pre('save', function (next) {
  this.startTime = timeToMinutes(this.time); // Convert the provided time to minutes
  this.endTime = this.startTime + this.duration * 60; // Calculate end time based on duration
  next();
});

module.exports = mongoose.model('Timetable', timetableSchema);
