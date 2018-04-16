
var express = require('express')
    , authenticate = require('../authenticate')
    , fs = require('fs')
    , dirs = require('../dirs.js')
    , path = require('path')
    , file = require('express-fileupload');

var route = ((Store)=>{
    var store_rt = express.Router();
    var sc = require('../controllers/store_ctrl')(Store)
    , ssc = require('../controllers/single_store_ctrl')(Store)
    , slc = require('../controllers/store_logo_ctrl')(Store);
    store_rt.use(file());

    store_rt
        .get('/', sc.get)
        .post('/',authenticate.verifyUser, sc.post)
        .put('/',authenticate.verifyUser, sc.put)
        .delete('/',authenticate.verifyUser, sc.del);
    
    store_rt
        .get('/:name/', ssc.get)
        .post('/:name/',authenticate.verifyUser, ssc.post)
        .put('/:name/',authenticate.verifyUser, ssc.put)
        .delete('/:name/',authenticate.verifyUser, ssc.del);
    
    store_rt
        .get('/:name/logo', slc.get)
        .post('/:name/logo',authenticate.verifyUser, slc.post)
        .put('/:name/logo',authenticate.verifyUser, slc.put)
        .delete('/:name/logo',authenticate.verifyUser, slc.del);
    
    return store_rt;
});

module.exports = route;