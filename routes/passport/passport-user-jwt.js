const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../users/model/User');
const keys = process.env.USER_SECRET_KEY;

const jwtOpts = {};
jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOpts.secretOrKey = keys;

const  userJWTLogin = new JwtStrategy(jwtOpts, async (payload, done) => {
    const username = payload.username; 
    try {
        if (username) {
            const user = await User.findOne({username: username});
            if (!user || user === null) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        }
    } catch (e) {
        return done(error, false);
    }
});

module.exports = userJWTLogin;