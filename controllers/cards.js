const Card = require('../models/card');
const { errorHandler } = require('../middleware/errorHandler');

async function getCards(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    errorHandler(err, res);
  }
  return undefined;
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    errorHandler(err, res);
  }
  return undefined;
}

async function deleteCard(req, res) {
  try {
    const card = await Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id });
    if (!card) {
      res.status(403).send({ message: 'Нельзя удалять чужие карточки' });
    } else if (card === null) {
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
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
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
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findOneAndUpdate(
      { _id: cardId, likes: userId },
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      errorHandler(err, res);
    }
  }

  return undefined;
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
