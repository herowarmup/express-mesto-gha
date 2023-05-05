const Card = require('../models/card');
const { errorHandler } = require('../middleware/errorHandler');

async function getCards(req, res) {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    errorHandler(err, res);
  }
}

async function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).send({ data: card });
  } catch (err) {
    errorHandler(err, res);
  }
}

async function deleteCard(req, res) {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.send({ data: card });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      errorHandler(err, res);
    }
  }
}

async function likeCard(req, res) {
  const { id } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.send({ data: card });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      errorHandler(err, res);
    }
  }
}

async function dislikeCard(req, res) {
  const { id } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    );
    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.send({ data: card });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      errorHandler(err, res);
    }
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
