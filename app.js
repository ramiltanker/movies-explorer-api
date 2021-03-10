require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-err.js');

const auth = require('./middlewares/auth.js');
const userController = require('./controllers/users.js');
const login = require('./controllers/login.js');

const createUser = userController.postUser;

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/moviedb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

// Не нужна авторизация
app.post('/signup', createUser);
app.post('/signin', login);
// Не нужна авторизация

// Роуты которым нужна авторизация
app.use('/users', auth, require('./routes/users.js'));
app.use('/movies', auth, require('./routes/movies.js'));
// Роуты которым нужна авторизация

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

// app.use((err, req, res, next) => {
//   if (isCelebrateError(err)) {
//     return next({
//       statusCode: 400,
//       message: err.message,
//     });
//   }
//   return next(err);
// });

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {

});
