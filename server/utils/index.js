const { validationResult } = require('express-validator');

const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array({ onlyFirstError: true });
    return res.status(422).json({ errors: extractedErrors });
  }
  next();
};

const parsePagination = (req, defaultLimit = 10, defaultSort = '-created') => {
  const { sortType = defaultSort } = req.body;
  return {
    sortType,
    limit: defaultLimit
  };
};

module.exports = {
  asyncWrapper,
  validate,
  parsePagination
};
