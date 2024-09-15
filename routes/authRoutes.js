const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/authenticate', async (req, res) => {
  const { role, id, password } = req.body;
  const user = await User.findOne({ role, email:id });
  if (user && bcrypt.compareSync(password, user.password)) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
