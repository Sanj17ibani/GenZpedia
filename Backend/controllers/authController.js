const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('../config/mongoose');
const User = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const signup = asyncHandler(async (req, res) => {
  console.log('SIGNUP API HIT');
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  console.log('[signup] About to persist user with User.save()', {
    model: User.modelName,
    email: user.email,
    name: user.name,
  });
  console.log(
    '[signup] mongoose.connection.readyState:',
    mongoose.connection.readyState,
    '(1 = connected)'
  );
  console.log(
    '[signup] mongoose.connection.db.databaseName:',
    mongoose.connection.db && mongoose.connection.db.databaseName
  );

  await user.save();

  console.log('[signup] User.save() completed');

  const savedForLog = user.toObject();
  delete savedForLog.password;
  console.log('[signup] Saved user document:', savedForLog);

  const token = signToken(user._id);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      level: user.level,
      createdAt: user.createdAt,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = signToken(user._id);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      level: user.level,
      createdAt: user.createdAt,
    },
  });
});

module.exports = { signup, login };
