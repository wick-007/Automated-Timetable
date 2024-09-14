const mongoose = require('mongoose');

const ConflictReportSchema = new mongoose.Schema({
  conflict: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ConflictReport', ConflictReportSchema);
