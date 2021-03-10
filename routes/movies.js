const router = require('express').Router();
const controller = require('../controllers/movies.js');

router.get('/', controller.getMovies);

router.post('/', controller.postMovie);

router.delete('/movieId', controller.deleteMovie);

module.exports = router;
