
var express = require('express')
    , file = require('express-fileupload')
    , authenticate = require('../authenticate')
    , path = require('path')
	, busboy = require('connect-busboy');

var route = ((D3M) =>{
    
    var D3M_rt = express.Router()
        , ouc = require('../controllers/D3M_user_ctrl')(D3M)
        , onc = require('../controllers/D3M_name_ctrl')(D3M);
        D3M_rt.use(file());
		//D3M_rt.use(busboy());

    D3M_rt
        .get('/:name', onc.get_all)
        .get('/:name/:object', onc.get)
        .post('/:name/:object',authenticate.verifyUser, onc.post)
        .post('/:name/:object/logo', authenticate.verifyUser, onc.post_logo)
        .put('/:name/:object',authenticate.verifyUser, onc.put)
        .delete('/:name/:object',authenticate.verifyUser, onc.del);

    D3M_rt
        .get('/c/:name/:object', ouc.get)
        .post('/c/:user/:id',authenticate.verifyUser, ouc.post)
        .put('/c/:id/:cid',authenticate.verifyUser, ouc.put)
        .delete('/c/:id/:cid',authenticate.verifyUser, ouc.del);

    /*
    D3M_rt
    .get('/:name/:location', soc.get_store)
    .post('/:name/:location',authenticate.verifyUser, soc.post_store)
    .put('/:name/:location',authenticate.verifyUser, soc.put_store)
    .delete('/:name/:location',authenticate.verifyUser, soc.delete_store);
    */

    return D3M_rt;
});

module.exports = route;