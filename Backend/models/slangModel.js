const mongoose = require('../config/mongoose');

const slangSchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, 'Word is required'],
    unique: true,
    trim: true,
  },
  meaning: {
    type: String,
    required: [true, 'Meaning is required'],
    trim: true,
  },
  origin: {
    type: String,
    trim: true,
  },
  tone: {
    type: String,
    trim: true,
  },
  emotionalContext: {
    type: String,
    trim: true,
  },
  example: {
    type: [String],
    required: [true, 'At least one example is required'],
    validate: {
      validator(v) {
        return Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === 'string');
      },
      message: 'Example must be a non-empty array of strings',
    },
  },
});

const Slang = mongoose.model('Slang', slangSchema);

module.exports = Slang;
