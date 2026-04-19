const { body, validationResult } = require('express-validator');
const Question = require('../models/question');
const User = require('../models/user');

exports.listAnswersByUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { sortType = '-created' } = req.body;
    const author = await User.findOne({ username });

    if (!author) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const questions = await Question.find({ 'answers.author': author.id }).sort(sortType);

    const userAnswers = [];
    questions.forEach((question) => {
      question.answers.forEach((answer) => {
        if (answer.author && answer.author.id === author.id) {
          userAnswers.push({
            id: answer.id,
            text: answer.text,
            score: answer.score,
            created: answer.created,
            questionId: question.id,
            questionTitle: question.title
          });
        }
      });
    });

    userAnswers.sort((a, b) => {
      if (sortType === '-created') {
        return new Date(b.created) - new Date(a.created);
      } else if (sortType === 'created') {
        return new Date(a.created) - new Date(b.created);
      } else if (sortType === '-score') {
        return b.score - a.score;
      } else if (sortType === 'score') {
        return a.score - b.score;
      }
      return 0;
    });

    res.json(userAnswers.slice(0, 10));
  } catch (error) {
    next(error);
  }
};

exports.loadAnswers = async (req, res, next, id) => {
  try {
    const answer = await req.question.answers.id(id);
    if (!answer) return res.status(404).json({ message: 'Answer not found.' });
    req.answer = answer;
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid answer id.' });
    return next(error);
  }
  next();
};

exports.createAnswer = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { id } = req.user;
    const { text } = req.body;

    const question = await req.question.addAnswer(id, text);

    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

exports.removeAnswer = async (req, res, next) => {
  try {
    const { answer } = req.params;
    const question = await req.question.removeAnswer(answer);
    res.json(question);
  } catch (error) {
    next(error);
  }
};

exports.answerValidate = [
  body('text')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 30 })
    .withMessage('must be at least 30 characters long')

    .isLength({ max: 30000 })
    .withMessage('must be at most 30000 characters long')
];
