module.exports = function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err.stack || err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `That ${field} is already in use` });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong on the server',
  });
};
