const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('./errorHandler');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-phrase-1234');
  } catch (err) {
    next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  if (!payload) {
    next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
