const mongoose = require('mongoose');

const lecturerPreferenceSchema = new mongoose.Schema({
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecturer',
    required: true
  },
  preferences: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('LecturerPreference', lecturerPreferenceSchema);
