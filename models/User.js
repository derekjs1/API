
var mongoose = require('mongoose')
    , schema = mongoose.Schema
    , passportLocalMongoose = require('passport-local-mongoose');


var favorite_schema = new schema({
    store: {
        type: String
    }
});

// supports user credentials.
var user_schema = new schema({
    admin: {
        type: Boolean,
        default: false
    },
    store: {
        type: Boolean,
        default: false,
    },
    firstname:{
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    favorites: [favorite_schema],
},{
    timestamps: true
});

user_schema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', user_schema, 'users');