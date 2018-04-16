
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var jwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); //sign create verify tokens

var config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(client) {
    return jwt.sign(client, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(opts,
    (jwt_payload, done) =>{
    //console.log("JWT payload: ", jwt_payload);

    //searching for user with given id
    User.findOne({_id: jwt_payload._id}, (err,user) =>{
        if (err)
        {
            return done(err, false);
        }
        else if (user)
        {
            return done(null, user);
        }
        else
        {
            return done(null, false);
        }
    });
}));

// Uses jwt token and does not allow sessions, uses jwt strategy
exports.verifyUser = passport.authenticate('jwt', {session: false});
