const Lecturer = require('../models/Lecturer');
const Preferences = require('../models/Preferences');
const ConflictReport = require('../models/ConflictReport');

exports.createLecturer = async (req, res) => {
  try {
    const { name, id } = req.body;
    const newLecturer = new Lecturer({ name, id });
    await newLecturer.save();
    res.status(201).send(newLecturer);
  } catch (error) {
    console.error('Error creating lecturer:', error);
    res.status(400).send({ error: error.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const preferences = await Preferences.find();
    res.status(200).send(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(400).send({ error: error.message });
  }
};

exports.createPreference = async (req, res) => {
  try {
    const { preferences } = req.body;
    const newPreferences = new Preferences({ preferences });
    await newPreferences.save();
    res.status(201).send(newPreferences);
  } catch (error) {
    console.error('Error creating preferences:', error);
    res.status(400).send({ error: error.message });
  }
};

exports.createConflictReport = async (req, res) => {
  try {
    const { conflict } = req.body;
    const newConflictReport = new ConflictReport({ conflict });
    await newConflictReport.save();
    res.status(201).send(newConflictReport);
  } catch (error) {
    console.error('Error creating conflict report:', error);
    res.status(400).send({ error: error.message });
  }
};

exports.getLecturers = async (req, res) => {
  try {
    const lecturers = await Lecturer.find();
    res.status(200).send(lecturers);
  } catch (error) {
    console.error('Error fetching lecturers:', error);
    res.status(400).send({ error: error.message });
  }
};

exports.updateLecturer = async (req, res) => {
  try {
    const updatedLecturer = await Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updatedLecturer);
  } catch (error) {
    console.error('Error updating lecturer:', error);
    res.status(400).send({ error: error.message });
  }
};

exports.deleteLecturer = async (req, res) => {
  try {
    await Lecturer.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Lecturer deleted' });
  } catch (error) {
    console.error('Error deleting lecturer:', error);
    res.status(400).send({ error: error.message });
  }
};
