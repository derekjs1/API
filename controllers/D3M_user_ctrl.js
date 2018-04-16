
var fs = require('fs')
    , dirs = require('./../dirs.js')
    , path = require('path')
    , mongoose = require('mongoose');

var object_user_ctrl = ((D3M)=>{

    var get = ((req,res,next) =>{
        D3M.findOne({storename: req.params.name, name: req.params.object})
        .then((object)=>
        {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.json(object);
        }
        , (err) => next(err)).catch((err) => next(err));
    });

    // Returning user nonsense that is desired.
    // var get = ((req,res,next) =>{
    //     D3M.findById(req.params.id)
    //     .populate('comments.author')
    //     .then((object)=>
    //     {
    //         if (object!= null)
    //         {    
    //             res.statusCode = 200;
    //             res.json(object.comments);
    //         }
    //         else
    //         {
    //             err = new Error('Model not found.');
    //             err.status(404);
    //             return next(err);
    //         }
    //     }
    //     , (err) => next(err)).catch((err) => next(err));
    // });

    var post = ((req,res,next) =>{
        D3M.findById(req.params.id).then((object) =>{
            if (object != null){
                req.body.author_id = req.user.id;
                req.body.author = req.user.username;
                console.log(req.user.id);
                console.log(req.user.username);
                object.comments.push(req.body);
                object.save((obj) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(obj);
                }, (err) => next(err));
            }
            else {
                err = new Error('Model not found.');
                err.status = 404;
                return next(err);
            }
        },(err) => next(err)).catch((err) => next(err));
    });

    /*
    Folder.findOneAndUpdate(
    { "_id": folderId, "permissions._id": permission._id },
    { 
        "$set": {
            "permissions.$": permission
        }
    },
    function(err,doc) {

    }
);
    */
    var put = ((req,res,next) =>{
    
        D3M.findById(req.params.id)
        .populate('comments.author_id')
        .then((object) =>{
            if (object)
            {
                object.comments.id(req.params.cid).remove();
                req.body.author_id = req.user.id;
                req.body.author = req.user.username;
                object.comments.push(req.body);
                object.save((obj) =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(obj);
                }, (err) => next(err));
            }
            else {
                err = new Error('Model not found.');
                err.status(404);
                return next(err);
            }
        }
        ,(err) =>next(err)).catch((err) => next(err));
    });

    var del = ((req,res,next) =>{
        D3M.findById(req.params.id)
        .populate('comments.author_id')
        .then((object) =>{
            if (object)
            {
                object.comments.id(req.params.cid).remove();
                object.save()
                .then((obj) =>{    
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, obj});    
                },(err) => next(err));
            }
            else
            {
                err = new Error('Comment not found.');
                err.status(404);
                console.log(err);
                return next(err);
            }
        }, (err) => next(err)).catch((err) => next(err));
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

module.exports = object_user_ctrl;