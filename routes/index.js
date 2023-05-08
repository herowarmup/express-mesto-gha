const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const users = require('./users');
const cards = require('./cards');
const auth = require('../middleware/auth');

const { CustomError } = require('../middleware/errorHandler');

const { createUser, login } = require('../controllers/users');
const { validateUserData } = require('../middleware/validators/userValidator');

router.post('/signup', validateUserData, createUser);
router.post('/signin', validateUserData, login);

router.use('/users', auth, users);
router.use('/cards', auth, cards);

router.use('*', auth, () => {
  throw new CustomError('Страница не найдена', StatusCodes.NOT_FOUND);
});

module.exports = router;
