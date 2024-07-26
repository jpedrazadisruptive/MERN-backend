const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (userData) => {
  const { username, email, password, role } = userData;
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new Error('Username or email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashedPassword, role });
  await user.save();

  return { message: 'User registered successfully' };
};

exports.login = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { token, role: user.role };
};
