
var passport = require('passport')
    , authenticate = require('../authenticate');

var user_ctrl = ((User)=>{

  var get = ((req,res,next) =>{
    User.findOne({username: req.params.username}).then((user) =>{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user); 
    }
    , (err) => next(err)).catch((err) => next(err));
  });

  var signup = ((req,res,next)=> {
    User.register(new User({username: req.body.username}),
     req.body.password, (err,user) =>{
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else{
        passport.authenticate('local')(req,res,()=> {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration successful.'});
      
        });
      }
    });
  });

  var login = ((req,res)=> {
    var token = authenticate.getToken({_id: req.user._id});
   
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'Authentication successful.'});
  });

  var del = ((req,res,next) =>{
    User.findOneAndRemove({username: req.body.username}).then((users)=>
    {	
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: "true"});  
    }
    , (err) => next(err)).catch((err) => next(err));
  });

  return {
    get: get,
    signup: signup,
    login: login,
    delete: del
  }
});

module.exports = user_ctrl;