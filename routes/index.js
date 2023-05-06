const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');
const auth = require('../middleware/auth');

const { createUser, login } = require('../controllers/users');
const { validateUserData } = require('../middleware/validators/userValidator');

router.post('/signup', validateUserData, createUser);
router.post('/signin', validateUserData, login);

router.use('/users', auth, users);
router.use('/users', auth, cards);

router.use('*', auth, (req, res) => {
  res.status(404).send({ message: 'page not found' });
});

module.exports = router;
