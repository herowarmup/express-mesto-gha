const cardsRouter = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { validateCardData, validateCardId } = require('../middleware/validators/cardValidator');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', validateCardData, createCard);
cardsRouter.delete('/cards/:cardId', validateCardId, deleteCard);
cardsRouter.put('/cards/:id/likes', validateCardId, likeCard);
cardsRouter.delete('/cards/:id/likes', validateCardId, dislikeCard);

module.exports = cardsRouter;
