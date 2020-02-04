const User = require('../model/User');
const bcrypt = require('bcryptjs');
const dbErrorMessage = require('../../helpers/dbErrorMessage');
const authHelper = require('../../helpers/authHelper');
const mongoose = require('mongoose');
const Post = require('../../post/model/Post');

module.exports = {

    signup: async (req, res) => {
        let createdUser = await new User({
            email: req.body.email, 
            password: req.body.password, 
            username: req.body.username
        });

            try {
                let salt = await bcrypt.genSalt(12)
                let hash = await bcrypt.hash(createdUser.password, salt);  
                createdUser.password = hash;  
                await createdUser.save(); 
                res.json({
                    message: 'Success'
                })
            } catch (e) {
                res.status(400).json({
                    message: dbErrorMessage(e)
                })
            }
    },
  signin: async (req, res) => {

    try {

        let foundUser = await User.findOne({ username: req.body.username });

        if (foundUser === null) {
            throw 'User not found, please sign up';
        }

        let comparedPassword = await authHelper.comparePassword(req.body.password, foundUser.password);

        if (comparedPassword === 409) {
            throw 'Check your email and password';
        } else {

            let jwtToken = await authHelper.createJwtToken(foundUser);

            res.status(200).json({
                token: jwtToken
            })
        }

    } catch (error) {
        res.status(401).json({
            message: error
        })
    };
  },
  getAllUsers: async (req, res) => {
      try {

        let success = await User.aggregate([
            {
                $match: {
                    _id: {
                        $ne: mongoose.Types.ObjectId(req.user._id),
                        $nin: req.user.following
                    }
                }
            }
        ])
        .exec();

        res.json(success)

      } catch (e) {
        res.status(400).json({
            message: dbErrorMessage(e)
        })
      }
  },
  addFollowingUser: async (req, res, next) => {

    const userID = req.user._id;
    const followID = req.body.user._id;

    try {
        await User.findByIdAndUpdate(userID, {$push: {following: followID}}, {new: true});
        next();
    } catch (e) {
        res.status(400).json({
            message: dbErrorMessage(e)
        })
    }
  },
  addFollowUser: async (req, res) => {

    const userID = req.user._id;
    const followID = req.body.user._id;

    try {
        let success = await User.findByIdAndUpdate(followID, {$push: {followers: userID}}, {new: true})
                  .populate('following', '_id username')
                  .populate('followers', '_id username')
                  .exec();

        res.json(success)
    } catch (e) {
        res.status(400).json({
            message: dbErrorMessage(e)
        })
    }

  },
  getUserFollowerAndFollowing: async (req, res) => {

    try {

        let successUser = await User.findById(req.user._id).populate('following', '_id username')
                                        .populate('followers', '_id username')
                                        .select('-__v -email -password -_id -userCreated -username')
                                        .exec(); 

        let successPost = await Post.find({postedBy: req.user._id})
                                    .populate('postedBy', '_id username')
                                    .populate('comments.postedBy', '_id username')
                                    .sort('-created')
                                    .exec(); 

        let success = [];
        success[0] = successUser;
        success[1] = successPost
        

        res.json(success)

    } catch (e) {
        res.status(400).json({
            message: dbErrorMessage(e)
        })
    }


  }
}