const User = require('../model/User');
const bcrypt = require('bcryptjs');
const dbErrorMessage = require('../../helpers/dbErrorMessage');
const authHelper = require('../../helpers/authHelper');

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
  }
}