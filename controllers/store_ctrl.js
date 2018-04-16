
var dirs = require('./../dirs')
    , path = require('path')
    , util = require('util')
    , fs = require('fs')
    , async = require('async');


const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

/***********************************
 *
var Store = require('../models/Stores')
    , express = require('express')
    , bodyparser = require('body-parser')
    , mongoose = require('mongoose')
    , fs = require('fs')
    , dirs = require('./../dirs.js')
    , path = require('path');

 * 
 * 
 *  markitapi.com/stores/
 *
 **********************************
var store_route = ((args) =>{

    this.get_store = ((req,res,next) =>{
        if (!(req.body))
        //Bad things will happen to you
        Store.find({}).then((stores)=>
	    {	
            authorized(res,stores);    
        }
        , (err) => next(err)).catch((err) => next(err));
        
    });

});
*/

var store_ctrl = ((Store)=>{

    var get = ((req,res,next) =>{
        Store.find({}).then((stores)=>
        {	
            authorized(res,stores);    
        }
        , (err) => next(err)).catch((err) => next(err));
    });

    var post = (async(req,res,next) =>{
        
        if (req.body == "")
            return res.status(500).json({err:'Unable to create store, from nothing'});
        
        var new_store = new Store(req.body);
      
        try {
            let model_dir, ret;

            new_store.save((ret_store)=>{

                let dir = create_dirs(path.resolve(__dirname, '..', 'stores'), [new_store.name, 'models']);
                dir.then((ret)=>{
                    if (!ret) return false;

                    let ret_dir = String(ret);
                    new_store.set({objects:{model:ret_dir}});
    
                    return new_store.save();
                })
                .then((stores)=>{
                    console.log("Directories updated.");
                    res.statusCode = 200;
                    res.json({success: true, store: stores});

                }, err => next(err));

            },(err) => next(err));
        }
        catch (err){
            console.log(err);
            res.status(500).json({error:err});
        }
    });

    put = ((req,res,next) =>{
        res.statusCode = 403; // op not supported
        res.json({err: 'Put operation not supported'});
    });

    del = ((req,res,next) =>{
        Store.remove({name: req.body.name}).then(()=>
        {
            fs.rmdirSync(path.resolve(__dirname+'/../stores/'+req.body.name+ '/models'));
            fs.rmdirSync(path.resolve(__dirname+'/../stores/'+req.body.name));
            res.statusCode = 200;
            res.json({success: "true"});
        }
        , (err) => next(err)).catch((err) => next(err));

    // res.statusCode = 403; // Not supported by users
        //res.end('Delete operation not supported');
    });

    return {
        get: get,
        post: post,
        put: put,
        del: del
    }
});

const create_dirs = async (base, dirs)=> {
    let ret_dir = base;
    let new_dir = base;

    if ( await exists(base)){
        await Promise.all(dirs.map(async (dir)=>{
            new_dir = path.join(new_dir, dir);
            fs.mkdir(new_dir,(err)=>{
                if (err) return false;
            });
        }))
        .then(()=>{
            return new_dir;
        });
        return new_dir;
    }
}


module.exports = store_ctrl;

function authorized(res, resp){
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	if (resp)
	{
		res.json(resp);
	}
}
