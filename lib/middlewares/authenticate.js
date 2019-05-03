const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = function (config) {
    const user = {
        username: config.username,
        password: config.password,
    }
    const secretOrKey = config.secret

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secretOrKey,
    }, function (jwt_payload, done) {
        const _user = jwt_payload.user.username == user.username ? user : false;
        done(null, _user)
    }))

    passport.use(new LocalStrategy(function (username, password, done) {
        if (username != user.username) return done(null, false);
        bcrypt.compare(password, user.password, function (error, reslut) {
            if (error) return done(error);
            return done(null, reslut)
        })
    }))

    function authenticate(strategy) {
        return passport.authenticate(strategy, {
            session: false
        })
    }

    function getToken() {
        return jwt.sign({
            user: {
                username: user.username
            }
        }, secretOrKey)
    }

    return {
        local: authenticate('local'),
        jwt: authenticate('jwt'),
        getToken: getToken,

    }
}