const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function comparePassword(incomingPassword, userPassword) {
    try {
        let comparedPassword = await bcrypt.compare(incomingPassword, userPassword);
        if (comparedPassword) {
            return comparedPassword
        } else {
            throw 409; 
        }
    } catch (error) {
        return error;
    }
}

async function createJwtToken(user) {

    let payload;

    payload = {
        id: user._id, 
        email: user.email, 
        username: user.username
    };

    let jwtToken = await jwt.sign(payload, process.env.USER_SECRET_KEY, {
        expiresIn: 3600
    });
    return jwtToken;
}

module.exports = {
    comparePassword,
    createJwtToken
}