const { body } = require('express-validator');
const { asyncWrapper } = require('../utils');

exports.loadComments = async (req, res, next, id) => {
  try {
    let comment;

    if (req.answer) {
      comment = await req.answer.comments.id(id);
    } else {
      comment = await req.question.comments.id(id);
    }

    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    req.comment = comment;
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid comment id.' });
    return next(error);
  }
  next();
};

exports.createComment = asyncWrapper(async (req, res) => {
  const { id } = req.user;
  const { comment } = req.body;

  if (req.params.answer) {
    req.answer.addComment(id, comment);
    const question = await req.question.save();
    return res.status(201).json(question);
  }

  const question = await req.question.addComment(id, comment);
  return res.status(201).json(question);
});

exports.removeComment = asyncWrapper(async (req, res) => {
  const { comment } = req.params;

  if (req.params.answer) {
    req.answer.removeComment(comment);
    const question = await req.question.save();
    return res.json(question);
  }

  const question = await req.question.removeComment(comment);
  return res.json(question);
});

exports.validate = [
  body('comment')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 1000 })
    .withMessage('must be at most 1000 characters long')
];
