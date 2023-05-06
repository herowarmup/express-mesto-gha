const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { validateCardData, validateCardId } = require('../middleware/validators/cardValidator');

router.get('/', getCards);
router.post('/', validateCardData, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:id/likes', validateCardId, likeCard);
router.delete('/:id/likes', validateCardId, dislikeCard);

module.exports = router;
