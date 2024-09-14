const Classroom = require('../models/Classroom');

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new classroom
exports.createClassroom = async (req, res) => {
  const classroom = new Classroom({
    name: req.body.name,
    capacity: req.body.capacity
  });

  try {
    const newClassroom = await classroom.save();
    res.status(201).json(newClassroom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single classroom
exports.getClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json(classroom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a classroom
exports.updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    classroom.name = req.body.name || classroom.name;
    classroom.capacity = req.body.capacity || classroom.capacity;

    const updatedClassroom = await classroom.save();
    res.status(200).json(updatedClassroom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a classroom
exports.deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    await classroom.remove();
    res.status(200).json({ message: 'Classroom deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
