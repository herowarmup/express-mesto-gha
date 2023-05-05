const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { errorHandler } = require('../middleware/errorHandler');

function getUsers(req, res) {
  if (!req.user) {
    res.status(401).send({ message: 'Авторизуйтесь' });
  }
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => errorHandler(err, res));
}

async function getUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      errorHandler(err, res);
    }
  }
}

async function createUser(req, res) {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const { _id, email } = user;
      res.status(201).json({ _id, email });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const user = await User.create({
      name, about, avatar, email, password,
    });

    res.status(201).send({ user });
  } catch (err) {
    errorHandler(err, res);
  }
}

async function updateUser(req, res) {
  const { name, about } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  const userId = req.user._id;

  if (!name) {
    return res.status(400).json({ message: 'Имя обязательно для заполнения' });
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'Имя должно быть не менее 2 символов' });
  }

  if (!about) {
    return res.status(400).json({ message: 'Описание обязательно для заполнения' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    return res.send(updatedUser);
  } catch (err) {
    errorHandler(err, res);
  }

  return undefined;
}

async function updateAvatar(req, res) {
  const { avatar } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(updatedUser);
  } catch (err) {
    errorHandler(err, res);
  }
  return undefined;
}

async function login(req, res) {
  const { email, password } = req.body;

  User.findOne({ email }).select(password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
        ),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}

async function getCurrentUser(req, res) {
  console.log(req.user);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      })
        .catch((err) => {
          res.status(401).send({ message: err.message });
        });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
