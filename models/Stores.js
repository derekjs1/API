
var mongoose = require('mongoose')
    , schema = mongoose.Schema
    , path = require('path');

var contact_schema = new schema({
    phone: {
        type: Number,
//        required: true
    },
    email: {
        type: String,
//        required: true
    },
    website: {
        type: String,
//        required: true
    }
});

var address_schema = new schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    }
});

var hrs_schema = new schema({
    open: {
        type: Number,
        required: true
    },
    open_min: {
        type: Number,
        required: true
    },
    closed: {
        type: Number,
        required: true
    },
    closed_min: {
        type: Number,
        required: true
    }
});

var days_schema = new schema({
    day:{
        type: String,
    },
    hours: [hrs_schema]
});

var objects_schema = new schema({
    model: {
        type: String,
        default: ""
    }
});

var store_schema = new schema({
    // admin:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     require: true},
    name:{
        type : String,
        required: true
    },
    logo:{
        url :{
            type: String,
            required: false,
            default: 'http://markitapi.com/public/default.jpg'
        },
        path : {
            type: String,
            required: false,
            default: path.join(__dirname, '..', 'stores', 'default', 'default.jpg')
        }
    },
    // logo:{
    //     type: String,
    //     required: false,
    //     default: path.join(__dirname, '..', 'stores', 'default', 'default.jpg')
    // },
    gps: {
        longitude: {
            type: Number
        },
        latitude: {
            type: Number
        }  
    },
    contact_info: contact_schema,
    address_info: address_schema,
    business_hrs: [days_schema],
    objects : objects_schema
},{
        timestamps: true
});

var stores = mongoose.model('stores', store_schema);
module.exports = stores;