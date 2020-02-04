const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const passport = require('passport');

/* GET users listing. */
router.get('/get-user-follower-and-following', passport.authenticate('jwt-user', {session: false}), userController.getUserFollowerAndFollowing);

router.post('/sign-up', userController.signup);

router.post('/sign-in', userController.signin);

router.get('/get-all-users', passport.authenticate('jwt-user',{ session: false }), userController.getAllUsers)

router.put('/follow-user', passport.authenticate('jwt-user',{ session: false }), userController.addFollowingUser, userController.addFollowUser)

router.put('/unfollow-user', passport.authenticate('jwt-user',{ session: false }), userController.removeFollowingUser, userController.removeFollowersUser);

router.get('/get-user-by-id/:id', passport.authenticate('jwt-user',{ session: false }), userController.getUserByID)


module.exports = router;
