
var express = require('express')
    , mongoose = require('mongoose')
//    , fs = require('fs')
    , dirs = require('./../dirs.js')
    , path = require('path')
    , async = require('async')
    , Store = require('../models/Stores')
    , Promise = require('bluebird');

var fs = Promise.promisifyAll(require('fs'));
let base_url = "http://markitapi.com/stores/";

var store_logo_ctrl = ((Store)=> {
    
    var get =((req,res,next) =>{
        Store.findOne({name:req.params.name})
        .then((store)=>{
            var logo = String(store.logo.path);
            res.status(200);
            res.sendFile(logo);
        }
        , (err) => next(err)).catch((err) => next(err));    
    });
    // post a store logo
    var post = ((req,res,next) =>{

        var tempFile = req.files.file;

        if (!tempFile)
           return res.status(400).send('Error, failed to upload logo');

        Store.findOne({name: req.params.name}).then((stores)=>
        {
            var logo_base = String(base_url + stores.name + '/logo');
            var new_src = path.join(__dirname,'../stores/' , stores.name, tempFile.name);
            stores.logo.path = new_src
            stores.logo.url = logo_base;
            stores.save().then((store)=>{
                tempFile.mv(new_src)
                .then((err)=>{
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200);
                    res.json(store);                   
                },
                err => next(err));
            },
            err => next(err));
        }
        , (err) => next(err)).catch((err) => next(err));
    });

    var put = ((req,res,next) =>{
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 403; // op not supported
        res.json({err: 'Put operation not supported'});
    });

    var del = ((req,res,next) =>{

        Store.findOne({name: req.params.name}).then((store)=>{
            var del_logo = store.logo.path;
            var def = path.join(__dirname, '../stores', 'default', 'default.jpg');
            store.logo.path = def;
            store.save()
            .then((ret)=>{
                fs.unlink(del_logo, (err)=>{
                    if (err) return res.status(500).json({err: 'Unable to reset default logo'});

                    res.status(200);
                    res.json(ret);
                });
            }, 
            err => next(err));
        },
        err => next(err)).catch(err => next(err));

    });

    return {
        get: get,
        post: post,
        put: put,
        del: del
    }
});

function authorized(res, resp){
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	if (resp)
	{
		res.json(resp);
	}
}

module.exports = store_logo_ctrl;