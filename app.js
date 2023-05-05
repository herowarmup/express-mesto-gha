const express = require('express');
const { errors } = require('celebrate');

const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middleware/auth');
const { createUser, login } = require('./controllers/users');
const { validateUserData } = require('./middleware/validators/userValidator');
const { errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', validateUserData, login);
app.post('/signup', validateUserData, createUser);

app.use(cookieParser());
app.use(auth);

app.use(userRouter);
app.use(cardsRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'page not found' });
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, console.log(`Сервер запущен на ${PORT} порту`));
