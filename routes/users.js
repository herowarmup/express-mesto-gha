const usersRouter = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const {
  validateUserId, validateUserInfo, validateAvatar,
} = require('../middleware/validators/userValidator');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', validateUserId, getUser);
usersRouter.patch('/users/me', validateUserInfo, updateUser);
usersRouter.patch('/users/me/avatar', validateAvatar, updateAvatar);

usersRouter.get('/me', getCurrentUser);

module.exports = usersRouter;
