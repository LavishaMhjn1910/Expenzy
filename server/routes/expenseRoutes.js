const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { CATEGORIES } = require('../models/Expense');
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getStats,
} = require('../controllers/expenseController');

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
}

const expenseRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category').optional().isIn(CATEGORIES).withMessage('Invalid category'),
  body('type').optional().isIn(['expense', 'income']).withMessage('Invalid type'),
  body('date').optional().isISO8601().withMessage('Invalid date'),
];

router.use(auth);

router.get('/stats', getStats);
router.get('/', getExpenses);
router.get('/:id', getExpense);
router.post('/', expenseRules, validate, createExpense);
router.put('/:id', expenseRules, validate, updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
