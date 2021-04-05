const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const controller = require('../controllers/users.js');

router.get('/me', controller.getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().min(2).max(30),
  }),
}), controller.updateUser);

module.exports = router;
