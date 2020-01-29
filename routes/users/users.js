const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const passport = require('passport');

/* GET users listing. */
router.get('/', passport.authenticate('jwt-ryan', {session: false}) ,function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', userController.signup);

router.post('/sign-in', userController.signin);

module.exports = router;
