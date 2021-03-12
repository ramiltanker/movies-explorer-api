const Movie = require('../models/movie.js');

const NotFoundError = require('../errors/not-found-err.js');
const BadRequest = require('../errors/bad-request-err.js');
const InternalServerError = require('../errors/internal-server-err.js');
const OwnerError = require('../errors/owner-err.js');
// const ConflictError = require('../errors/conflict-err.js');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      next(new InternalServerError(`${err.message}`));
    });
};

const postMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные в метод создания карточки'));
      } else {
        next(new InternalServerError(`${err.message}`));
      }
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }
      if (movie.owner.toString() !== owner) {
        throw new OwnerError('Нельзя удалить фильм другого пользователя');
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.send({ message: `Фильм ${movie.nameRU}/${movie.nameEN} успешно удалён` });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = { getMovies, postMovie, deleteMovie };
