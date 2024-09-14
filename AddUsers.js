const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/timetable', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createUser = async (role, id, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ role, id, password: hashedPassword });
  await user.save();
  console.log(`User created: ${role}, ${id}`);
};

const main = async () => {
  await createUser('admin', 'admin123', 'password');
  await createUser('teacher', 'teacher123', 'password');
  await createUser('student', '9001246819', 'password');
  await createUser('student', '9001246818', 'password');
  await createUser('student', '9001246820', 'password');
  mongoose.disconnect();
};

main();
