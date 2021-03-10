const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      req.headers.authorization = `Bearer ${token}`;
      res.send({ token });
    })
    .catch(next);
};
