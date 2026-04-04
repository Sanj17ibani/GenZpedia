const notFound = (req, res, next) => {
  res.status(404);
  const err = new Error(`Not found: ${req.originalUrl}`);
  next(err);
};

module.exports = notFound;
