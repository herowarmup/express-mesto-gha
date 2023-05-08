const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const users = require('./users');
const cards = require('./cards');
const auth = require('../middleware/auth');

const { createUser, login } = require('../controllers/users');
const { validateUserData } = require('../middleware/validators/userValidator');

router.post('/signup', validateUserData, createUser);
router.post('/signin', validateUserData, login);

router.use('/users', auth, users);
router.use('/cards', auth, cards);

router.use('*', auth, (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Страница не найдена' });
});

module.exports = router;
