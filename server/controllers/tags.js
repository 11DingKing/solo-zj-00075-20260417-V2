const Question = require('../models/question');
const { asyncWrapper } = require('../utils');

exports.listPopulerTags = asyncWrapper(async (req, res) => {
  const tags = await Question.aggregate([
    { $project: { tags: 1 } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 25 }
  ]);
  res.json(tags);
});

exports.listTags = asyncWrapper(async (req, res) => {
  const tags = await Question.aggregate([
    { $project: { tags: 1 } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(tags);
});

exports.searchTags = asyncWrapper(async (req, res) => {
  const { tag = '' } = req.params;
  const tags = await Question.aggregate([
    { $project: { tags: 1 } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $match: { _id: { $regex: tag, $options: 'i' } } },
    { $sort: { count: -1 } }
  ]);
  res.json(tags);
});
