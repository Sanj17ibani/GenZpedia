const express = require('express');
const { body, param } = require('express-validator');
const {
  createSlang,
  getSlangs,
  getSlangById,
  updateSlang,
  deleteSlang,
} = require('../controllers/slangController');
const validate = require('../middleware/validate');

const router = express.Router();

const exampleArrayRule = body('example')
  .isArray({ min: 1 })
  .withMessage('Example must be a non-empty array of strings')
  .custom((arr) => arr.every((item) => typeof item === 'string'))
  .withMessage('Each example must be a string');

const optionalStrings = ['origin', 'tone', 'emotionalContext'];

const createRules = [
  body('word').trim().notEmpty().withMessage('Word is required'),
  body('meaning').trim().notEmpty().withMessage('Meaning is required'),
  exampleArrayRule,
  ...optionalStrings.map((field) =>
    body(field).optional({ values: 'falsy' }).isString().withMessage(`${field} must be a string`)
  ),
];

const updateRules = [
  param('id').isMongoId().withMessage('Invalid id'),
  body('word').optional().trim().notEmpty().withMessage('Word cannot be empty'),
  body('meaning').optional().trim().notEmpty().withMessage('Meaning cannot be empty'),
  body('example')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Example must be a non-empty array of strings')
    .custom((arr) => Array.isArray(arr) && arr.every((item) => typeof item === 'string'))
    .withMessage('Each example must be a string'),
  ...optionalStrings.map((field) =>
    body(field).optional({ values: 'falsy' }).isString().withMessage(`${field} must be a string`)
  ),
];

router.post('/', createRules, validate, createSlang);
router.get('/', getSlangs);
router.get('/:id', param('id').isMongoId().withMessage('Invalid id'), validate, getSlangById);
router.patch('/:id', updateRules, validate, updateSlang);
router.delete('/:id', param('id').isMongoId().withMessage('Invalid id'), validate, deleteSlang);

module.exports = router;
