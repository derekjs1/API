
var express = require('express')
    , passport = require('passport')
    , authenticate = require('../authenticate')

var route = ((User) =>{
    var user_rt = express.Router()
    , uc = require('../controllers/user_ctrl')(User);
    
    user_rt
        .get('/info/:username', authenticate.verifyUser, uc.get)
        .post('/signup', uc.signup)
        .post('/login', passport.authenticate('local'), uc.login)
        //.post('/info/:username', authenticate.verifyUser, uc.info)
        //.put('/info/:username', authenticate.verifyUser, uc.update)
        .delete('/', uc.delete);

    return user_rt;
});

module.exports = route;