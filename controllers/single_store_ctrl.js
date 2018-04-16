
var fs = require('fs')
    , dirs = require('./../dirs.js')
    , path = require('path');

var update_fields = [
    ["street","address_info"], ["city","address_info"], ["state","address_info"], ["zip","address_info"],
    ["phone","contact_info"],["email","contact_info"],["website","contact_info"],
    ["saturday","business_hrs"],["sunday","business_hrs"],["monday","business_hrs"],["tuesday","business_hrs"],["wednesday","business_hrs"],["thursday","business_hrs"],["friday","business_hrs"]
];

var illegal_update = {'_id':{}, 'models':{}, 'timestamps':{}, 'logo':{}};

var single_store_ctrl = ((Store)=>{

    var get = ((req,res,next) =>{

        Store.findOne({name: req.params.name}).then((store)=>
        {
            res.statusCode = 200;
            res.json(store);
        }
        , (err) => next(err)).catch((err) => next(err));
    });

    var post = ((req,res,next) =>{
        res.statusCode = 403; // op not supported
        res.json({err: 'POST operation not supported'});
    });

/**
 * 
 * {'update': {'field': 'entry'}}
 * 
 * illegal_update = {'id','asdfag'}
 * 
 */
    var put = ((req,res,next) =>{
        var update = Object.keys(req.body);

        if (illegal_update[update[0]])
            return res.status(500).json({err: 'illegal update field'});    

        Store.findOneAndUpdate({name: req.params.name}, {
            $set: req.body,
        }).then((store)=>
        {
            res.status(200);
            res.json(store);
        }
        ,(err) => next(err)).catch((err) => next(err));    
    });

    var del = ((req,res,next) =>{

        // TODO: make this delete fields within the store meta data.
        // temporarily disallowed.
        res.statusCode = 403; // op not supported
        res.json({err: 'POST operation not supported'});
        return;

        Store.findAndRemove({name:req.params.name})
        .then((resp) =>
        {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true});
        }, (err) => next(err))
        .catch((err) => next(err));
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

module.exports = single_store_ctrl;