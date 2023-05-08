const { isCelebrateError } = require('celebrate');
const mongooseError = require('mongoose').Error;
const { StatusCodes } = require('http-status-codes');

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
  }
}

function errorHandler(err, res) {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';

  if (isCelebrateError(err)) {
    const [errData] = err.details.values().next().value.details;
    statusCode = StatusCodes.BAD_REQUEST;
    message = errData.message;
  } else if (err instanceof mongooseError.ValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    const [errorKey, errorValue] = Object.entries(err.errors)[0];
    message = `Validation error for '${errorKey}': ${errorValue.message}`;
  } else if (err instanceof mongooseError.CastError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Invalid ID format';
  } else if (err instanceof mongooseError.DocumentNotFoundError) {
    statusCode = StatusCodes.NOT_FOUND;
    message = 'Document not found';
  } else if (err instanceof CustomError) {
    statusCode = err.statusCode;
    res.status(statusCode).json({ message: err.message });
  }

  return res.status(statusCode).json({ message });
}

module.exports = { errorHandler, CustomError };
