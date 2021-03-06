const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    require: true,
    type: String,
  },
  director: {
    require: true,
    type: String,
  },
  duration: {
    require: true,
    type: Number,
  },
  year: {
    require: true,
    type: String,
  },
  description: {
    require: true,
    type: String,
  },
  image: {
    require: true,
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
    },
  },
  trailer: {
    require: true,
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
    },
  },
  thumbnail: {
    require: true,
    type: String,
    validate: {
      validator: (link) => validator.isURL(link),
    },
  },
  owner: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  movieId: {
    require: true,
    type: Number,
  },
  nameRU: {
    require: true,
    type: String,
    minlength: 1,
    maxlength: 100,
  },
  nameEN: {
    require: true,
    type: String,
    minlength: 1,
    maxlength: 100,
  },
});

module.exports = mongoose.model('movie', movieSchema);
