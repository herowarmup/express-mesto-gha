/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/user');
const { errorHandler } = require('../middleware/errorHandler');
const { CustomError } = require('../middleware/errorHandler');

function getUsers(req, res) {
  // if (!req.user) {
  //   res.status(401).send({ message: 'Авторизуйтесь' });
  // }
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => errorHandler(err, res));
}

async function getUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND);
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      throw new CustomError('Переданы некорректные данные', StatusCodes.BAD_REQUEST);
    } else {
      errorHandler(err, res);
    }
  }
}

async function createUser(req, res) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError('Такой e-mail уже зарегистрирован!', StatusCodes.CONFLICT);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });

    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    };

    res.status(StatusCodes.CREATED).send({ user: userWithoutPassword });
  } catch (err) {
    errorHandler(err, res);
    res.status(500).send({});
  }
}

async function updateUser(req, res) {
  const { name, about } = req.body;

  // if (!req.user) {
  //   return res.status(401).json({ message: 'Необходима авторизация' });
  // }

  const userId = req.user._id;

  if (!name || name.length < 2) {
    throw new CustomError('Имя должно быть не менее 2 символов', StatusCodes.BAD_REQUEST);
  }

  if (!about) {
    throw new CustomError('Описание обязательно для заполнения', StatusCodes.BAD_REQUEST);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    return res.send(updatedUser);
  } catch (err) {
    errorHandler(err, res);
  }
}

async function updateAvatar(req, res) {
  const { avatar } = req.body;

  // if (!req.user) {
  //   return res.status(401).json({ message: 'Необходима авторизация' });
  // }

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
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select(password);

    if (!user) {
      throw new CustomError('Пользователь не найден', StatusCodes.BAD_REQUEST);
    }

    const token = jwt.sign({ _id: user._id }, 'secret-phrase-1234', {
      expiresIn: '7d',
    });

    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });

    return res.send({ token });
  } catch (err) {
    errorHandler(err, res);
  }
}

async function getCurrentUser(req, res) {
  try {
    // if (!req.user) {
    //   return res.status(401).send({ message: 'Пользователь не авторизован' });
    // }
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    return res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    });
  } catch (err) {
    errorHandler(err, res);
  }
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
