const router = require('express').Router();
const controller = require('../controllers/users.js');

router.get('/me', controller.getCurrentUser);
router.patch('/me', controller.updateUser);

module.exports = router;
