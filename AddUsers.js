const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

const createUser = async (role, email, password, name) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ role, name, email, password: hashedPassword });
  await user.save();
  console.log(`User created: ${role}`);
};

const main = async () => {
  await createUser('admin', 'admin123', 'password', 'Admin 1');
  await createUser('teacher', 'teacher123', 'password', 'First Teacher');
  await createUser('student', '9001246819', 'password', 'First Student');
  await createUser('student', '9001246818', 'password', 'Second Student');
  await createUser('student', '9001246820', 'password', 'Third Student');
  mongoose.disconnect();
};

main();
