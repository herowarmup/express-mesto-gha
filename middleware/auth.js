const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-phrase-1234');
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Необходима авторизация' });
  }

  if (!payload) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};

module.exports = auth;
