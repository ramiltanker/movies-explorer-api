const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

const NotFoundError = require('../errors/not-found-err.js');
const BadRequest = require('../errors/bad-request-err.js');
const InternalServerError = require('../errors/internal-server-err.js');
const ConflictError = require('../errors/conflict-err.js');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ email: user.email, name: user.name, _id: user._id });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    runValidators: true, // данные будут валидированы перед изменением
    new: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные в метод обновления данных пользователя'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные в метод обновления данных пользователя'));
      } else {
        next(new InternalServerError(`${err.message}`));
      }
    });
};

const postUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.send({ data: { email: user.email, _id: user._id } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Переданы некорректные данные в метод создания пользователя');
      } else if (err.name === 'MongoError') {
        throw new ConflictError('Пользователь с таким email уже зарегестрирован');
      } else {
        throw new InternalServerError(`${err.message}`);
      }
    })
    .catch(next);
};

module.exports = {
  getCurrentUser, updateUser, postUser,
};
