var express = require('express')
    , mongoose = require('mongoose')
    , fs = require('fs')
    , dirs = require('./../dirs.js')
    , path = require('path')
    , async = require('async')
    , Store = require('../models/Stores')
    , Promise = require('bluebird')
    , tar = require('tar-fs')
    , util = require('util')
    , zlib = require('zlib');

    
const exists = util.promisify(fs.exists);
const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);

var fs = Promise.promisifyAll(require('fs'));
/*********************************************
 * var thingSchema = new Schema();
 * var Thing = mongoose.D3M(Thing, thingschema);
 * var thing = new Thing;
 * thing.set('bad value', true);
 * thing.save().... bad value willnot be saved.
 * 
 * //Validates manually beforrrrre
 * thing.validate((err)=>{
 * 
 * })
 * thing.save();// having this here will succeed regardless of the previous line
 */
var illegal_update = {'_id':{}, 'models':{}, 'timestamps':{}, 'logo':{}, 'path':{}, 'url':{}};
let base_url = "http://markitapi.com/objects/";

var object_name_ctrl = ((D3M)=>{

    // Short method for getting all objects store has.
    var get_all = ((req,res,next)=>{

        D3M.find({storename: req.params.name})
        .then((objects) =>{
            res.setHeader('Content-Type' , 'application/json');
            res.statusCode = 200;
            res.json(objects);
        },
        (err) => next(err)).catch((err) => next(err));

        // Store.findOne({name:req.params.name})
        // .then((store)=>{
        //     var resource = String(store.objects.model);

        //     fs.readdir(resource, (err, files)=>{
        //         res.setHeader('Content-Type' , 'application/json');
        //         res.statusCode = 200;
        //         res.json(files);
        //     },
        //     err => next(err));
        // },
        // (err) => next(err)).catch((err) => next(err));
    });

    // Returning actual object itself
    var get = ((req,res,next) =>{
        var obj_file = String(req.params.object);
        
        if (obj_file.substr(obj_file.length - 7, obj_file.length) != '.tar.gz')
            res.status(400).json({err: 'Incorrect file extension specification, missing gzip'});
        
        var obj_name = obj_file.substring(0, obj_file.length - 7);

        D3M.findOne({storename: req.params.name,
            name: obj_name}).then((object)=>
        {
            res.setHeader('Content-Type' , 'application/gzip');
            res.statusCode = 200;
            res.sendFile(object.path);
        }
        , (err) => next(err)).catch((err) => next(err));
    });

    var post = ((req,res,next) =>{

        var tempFile = req.files.file;
        var data = Object.keys(req.body);
        var store = req.params.name;
        var mdl = req.params.object;
        var valid_update = validate_update(data);

        if (!tempFile || !store || !valid_update)
           return res.status(500).send('No files were uploaded');
        
        Store.findOne({name: store})
        .then((stores)=>{

            var first_dir = path.join(stores.objects.model, req.params.object);
            fs.mkdirAsync(first_dir)
            .then(()=>{
                var gz_file = bundle(tempFile, first_dir);

                if (!gz_file)
                {
                    console.log(gz_file);
                    res.setHeader('Content-Type', 'applicaiton/json');
                    res.statusCode = 500;
                    res.json({success: 'false'});
                }

                var src = String(first_dir + '.tar.gz');
                var url_src = String(base_url + stores.name + '/' + req.params.object + '.tar.gz');

                var obj = new D3M({storename: store,
                    name: mdl,
                    path: src,
                    url: url_src});
                            
                obj.save().then((d3m_obj) =>{
                    res.setHeader('Content-Type' , 'application/json');
                    res.statusCode = 200;
                    res.json(d3m_obj);
                },(err) => next(err)).catch((err) => next(err));

            },(err) => next(err)).catch((err) => next(err));
        }       
        ,(err) => next(err)).catch((err) => next(err));
    });

    // TODO: Need method for filtering data and validating a store is the user only authorized updates for this object
    var put = ((req,res,next) =>{
        var update = Object.keys(req.body);

        if (illegal_update[update[0]])
            return res.status(500).json({err:'illegal update'});

        D3M.findByIdAndUpdate(req.params.object, {
            $set: req.body,
        }).then((objects)=>
        {
            res.setHeader('Content-Type' , 'application/json');
            res.statusCode = 200;
            res.json({success: true, objects});
        }
        ,(err) => next(err)).catch((err) => next(err));    
    });

    //allows the deletion of objects and all meta data
    var del = ((req,res,next) =>{

        D3M.findOne({_id: req.params.object})
        .then((object)=>{
            var rmv_object = object.path;

            D3M.findByIdAndRemove(req.params.object)
            .then((resp) =>{
                fs.unlink((rmv_object), err=>{
                    if (err) return err;
                    
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.json({success: true});
                });
            }, 
            err=>next(err)).catch((err) => next(err));
        },
        (err) => next(err)).catch((err) => next(err));
    });

    return {
        get_all: get_all,
        get: get,
        post: post,
        put: put,
        del: del
    }
});

const validate_update = async (updates)=>{

    if (!Array.isArray(updates) && !illegal_update[updates])
        return true;

    await Promise.all(async.each(updates, (update,cb)=>{
        if (illegal_update[update])
            return false;

    }, err =>{

        if (err)
            return false;

        return true;
    })).catch(()=>{});

};

const removeDir = async (dir) => {
    if (await exists(dir)) {
        const files = await readdir(dir);
        await Promise.all(files.map(async (file) => {
            const p = path.join(dir, file);
            const stat = await lstat(p);
            if (stat.isDirectory()) {
                await removeDir(p);
            } else {
                await unlink(p);
                console.log(`Removed file ${p}`);
            }
        }));
        await rmdir(dir);
        console.log(`Removed dir ${dir}`);
    }
}

const pack = (dir) =>{
    tar.pack(dir)
    .pipe(fs.createWriteStream(dir + '.tar'))
    .on('finish', ()=>{
        fs.createReadStream(dir + '.tar')
        .pipe(zlib.createGzip())
        .pipe(fs.createWriteStream(dir + '.tar.gz'))
        .on('finish', ()=>{
            removeDir(dir);
            fs.unlink((dir + '.tar'),()=>{
                return (dir+'.tar.gz');
            }, err=> { return err;});
        });
    });
}

const bundle = async(files, dir) =>{
    console.log(files);
    if (files){
        await Promise.all(files.map(async (file)=>{
            
            file.mv(path.join(dir, file.name), (mv_file,err)=>{
                if (err)
                    return err;
            });
        }))
        .then(()=>{
            pack(dir);
        });
    }else
        return false;
    return dir;
}

function authorized(res, resp){
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	if (resp)
	{
		res.json(resp);
	}
}

module.exports = object_name_ctrl;