const Expense = require('../models/Expense');

exports.getExpenses = async (req, res, next) => {
  try {
    const { category, type, from, to, search, page = 1, limit = 20, sort = '-date' } = req.query;

    const query = { user: req.user._id };
    if (category) query.category = category;
    if (type) query.type = type;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Expense.countDocuments(query),
    ]);

    res.json({
      expenses,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ expense });
  } catch (err) {
    next(err);
  }
};

exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, type, date, notes } = req.body;
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      type,
      date,
      notes,
    });
    res.status(201).json({ expense });
  } catch (err) {
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ expense });
  } catch (err) {
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
};

// Aggregated stats: totals, by-category breakdown, and a monthly trend line
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [totals, byCategory, monthlyTrend, recent] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
          },
        },
      ]),
      Expense.aggregate([
        { $match: { user: userId, type: 'expense', date: { $gte: startOfMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Expense.find({ user: userId }).sort('-date').limit(5),
    ]);

    const totalExpense = totals.find((t) => t._id === 'expense')?.total || 0;
    const totalIncome = totals.find((t) => t._id === 'income')?.total || 0;

    const thisMonthExpense = byCategory.reduce((sum, c) => sum + c.total, 0);

    res.json({
      totalExpense,
      totalIncome,
      balance: totalIncome - totalExpense,
      thisMonthExpense,
      byCategory,
      monthlyTrend,
      recent,
    });
  } catch (err) {
    next(err);
  }
};
