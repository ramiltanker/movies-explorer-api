const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const isURL = require('validator/lib/isURL');
const controller = require('../controllers/movies.js');

const urlValidator = (value) => {
  if (!isURL(value)) {
    throw new CelebrateError('Ссылка неверного формата');
  }
  return value;
};

router.get('/', controller.getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    Image: Joi.string().required().custom(urlValidator),
    trailer: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(1).max(30),
    nameEN: Joi.string().required().min(1).max(30),
  }),
}), controller.postMovie);

router.delete('/movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
}), controller.deleteMovie);

module.exports = router;
