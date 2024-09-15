const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

// Define routes
const timetableRoutes = require('./routes/timetableRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require('./routes/authRoutes');
const conflictReportsRoutes = require('./routes/ConflictReportsRoutes');
const lecturerPreferencesRoutes = require('./routes/lecturerPreferencesRoutes'); 

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api/timetable', timetableRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/classrooms', roomRoutes);
app.use('/api/conflict-reports', conflictReportsRoutes);
app.use('/api/lecturer-preferences', lecturerPreferencesRoutes); // Add this line
app.use('/api', authRoutes); // Assuming you have authRoutes for authentication

// Define User model (make sure to include the path to your User model)
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.post('/api/authenticate', async (req, res) => {
  console.log(req.body);
  const { role, id, password } = req.body;


  const user = await User.findOne({ role, id });
  if (user && bcrypt.compareSync(password, user.password)) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
