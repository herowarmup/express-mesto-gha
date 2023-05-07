/* eslint-disable consistent-return */
const { StatusCodes } = require('http-status-codes');

const Card = require('../models/card');
const { errorHandler } = require('../middleware/errorHandler');
const { CustomError } = require('../middleware/errorHandler');

async function getCards(req, res) {
  try {
    // if (!req.user) {
    //   return res.status(401).json({ message: 'Необходима авторизация' });
    // }
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    errorHandler(err, res);
  }
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    // if (!req.user) {
    //   return res.status(401).json({ message: 'Необходима авторизация' });
    // }
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    errorHandler(err, res);
  }
}

async function deleteCard(req, res) {
  try {
    const card = await Card.findOne({ _id: req.params.cardId });
    if (!card) {
      throw new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND);
    } else if (card.owner.toString() !== req.user._id) {
      throw new CustomError('Нельзя удалять чужие карточки', StatusCodes.FORBIDDEN);
    } else {
      const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
      res.send({ data: deletedCard });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      throw new CustomError('Переданы некорректные данные', StatusCodes.BAD_REQUEST);
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
      throw new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND);
    } else {
      res.send({ data: card });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      throw new CustomError('Переданы некорректные данные', StatusCodes.BAD_REQUEST);
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
      throw new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND);
    }
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      throw new CustomError('Переданы некорректные данные', StatusCodes.BAD_REQUEST);
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
