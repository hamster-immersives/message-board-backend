const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('./controller/postController');

router.post('/create-post', passport.authenticate('jwt-user',{ session: false }), postController.createPost);

router.get('/get-all-posts', passport.authenticate('jwt-user',{ session: false }), postController.getAllPosts)

router.delete('/delete-post-by-id/:id', passport.authenticate('jwt-user',{ session: false }), postController.deletePostByID)

router.post('/add-comment-by-post-id', passport.authenticate('jwt-user',{ session: false }), 
postController.addCommentToPostByID
)

router.delete('/delete-comment-by-id/:postID/:commentID', passport.authenticate('jwt-user',{ session: false }), postController.deleteCommentByID)

module.exports = router;
