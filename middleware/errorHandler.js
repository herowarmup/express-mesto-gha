const { isCelebrateError } = require('celebrate');
const mongooseError = require('mongoose').Error;
const { BAD_REQUEST } = require('http-status-codes');

function errorHandler(err, res) {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (isCelebrateError(err)) {
    const [errData] = err.details.values().next().value.details;
    res.status(BAD_REQUEST).send({ message: errData.message });
    return;
  }

  if (err instanceof mongooseError.CastError || err.status === 404) {
    statusCode = 400;
    message = 'Bad Request';
  }

  res.status(statusCode).json({ message });
}

module.exports = { errorHandler };
