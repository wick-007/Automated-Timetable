const mongoose = require('mongoose');

const PreferencesSchema = new mongoose.Schema({
  preferences: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Preferences', PreferencesSchema);
