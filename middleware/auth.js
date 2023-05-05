const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    req.isAuthenticated = false;
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    req.isAuthenticated = false;
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  req.isAuthenticated = true;

  return next();
};

module.exports = auth;
