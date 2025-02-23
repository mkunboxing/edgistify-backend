const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ fullName, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, `${process.env.SECRET_KEY}`, { expiresIn: '1d' });
    res.status(201).json({ token, fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, `${process.env.SECRET_KEY}`, { expiresIn: '1d' });
    res.json({ token, fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};