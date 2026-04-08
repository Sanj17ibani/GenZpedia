const Slang = require('../models/slangModel');
const User = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');

const createSlang = asyncHandler(async (req, res) => {
  const slang = await Slang.create(req.body);
  res.status(201).json({ message: 'Slang entry created', data: slang });
});

const getSlangs = asyncHandler(async (req, res) => {
  const items = await Slang.find().sort({ word: 1 });
  res.json({ count: items.length, data: items });
});

const getSlangById = asyncHandler(async (req, res) => {
  const slang = await Slang.findById(req.params.id);
  if (!slang) {
    res.status(404);
    throw new Error('Slang not found');
  }
  res.json({ data: slang });
});

const updateSlang = asyncHandler(async (req, res) => {
  const slang = await Slang.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!slang) {
    res.status(404);
    throw new Error('Slang not found');
  }
  res.json({ message: 'Slang updated', data: slang });
});

const deleteSlang = asyncHandler(async (req, res) => {
  const slang = await Slang.findByIdAndDelete(req.params.id);
  if (!slang) {
    res.status(404);
    throw new Error('Slang not found');
  }
  res.json({ message: 'Slang deleted', id: slang._id });
});

const checkAnswer = asyncHandler(async (req, res) => {
  const { slangId, selectedAnswer } = req.body;

  const slang = await Slang.findById(slangId);
  const user = await User.findById(req.user.id);

  if (!slang) {
    res.status(404);
    throw new Error('Slang not found');
  }

  let correct = false;

  if (slang.meaning === selectedAnswer) {
    correct = true;

    user.xp += 10;
    user.streak += 1;

    if (user.xp >= 100) {
      user.level += 1;
      user.xp = 0;
    }
  } else {
    user.streak = 0;
  }

  await user.save();

  res.json({
    correct,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
  });
});

module.exports = {
  createSlang,
  getSlangs,
  getSlangById,
  updateSlang,
  deleteSlang,
  checkAnswer,
};
