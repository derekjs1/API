const mongoose = require('mongoose');
//require('mongoose-currency');
var Schema = mongoose.Schema;
//var Currency = mongoose.Types.Currency;

var comment_schema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    author: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
    }
}, {
    timestamps: true
});

var d3m_schema = new Schema({
    storename : {
        type: String,
        required: true
    },
    name : {
        type: String,
        require: true
    },
    description : {
        type: String
    },
    category:{
        type: String
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    price: {
        type: String,//Currency,
   //     required: true,
        min: 0
    },
    comments: [comment_schema]
},{
    timestamps: true
});

var d3m = mongoose.model('D3M', d3m_schema);
module.exports = d3m;