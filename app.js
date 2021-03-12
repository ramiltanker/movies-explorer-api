require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, isCelebrateError } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-err.js');

const auth = require('./middlewares/auth.js');
const userController = require('./controllers/users.js');
const login = require('./controllers/login.js');

const rateLimiter = require('./middlewares/rateLimiter');

const createUser = userController.postUser;

const errorHandler = require('./middlewares/errorHandler');

const { MONGO_DB_ADDRESS } = process.env;

const app = express();
const PORT = 3000;

mongoose.connect(MONGO_DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(helmet());
app.use(rateLimiter);
// Не нужна авторизация
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
// Не нужна авторизация

// Роуты которым нужна авторизация
app.use('/users', auth, require('./routes/users.js'));
app.use('/movies', auth, require('./routes/movies.js'));
// Роуты которым нужна авторизация

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    return next({
      statusCode: 400,
      message: err.message,
    });
  }
  return next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {

});
