const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

const createUser = async (role, id, password, name) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ role, name, id, password: hashedPassword });
  await user.save();
  console.log(`User created: ${role} (${id})`);
};

const main = async () => {
  // 1. Clear existing users
  await User.deleteMany({});
  console.log("Old users cleared ✅");

  // 2. Create fresh users
  await createUser('admin', 'admin123', 'password', 'Admin 1');
  await createUser('teacher', 'teacher123', 'password', 'First Teacher');
  await createUser('student', '9001246819', 'password', 'First Student');
  await createUser('student', '9001246818', 'password', 'Second Student');
  await createUser('student', '9001246820', 'password', 'Third Student');

  // 3. Disconnect
  mongoose.disconnect();
};

main();
