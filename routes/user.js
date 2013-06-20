require('../db');

var mongoose = require('mongoose'),
	  crypto   = require('crypto'),
    User     = mongoose.model('User');

exports.login = function(req, res){
  res.render('admin/login', { title: 'NodeCMS登录' })
};

exports.register = function(req, res){
  console.log(req.flash);
  if( req.method === 'GET' ){
  	User.find()
  	  .exec(function (err ,Users){ 
		res.render('admin/register', {
                title: 'NodeCMS注册',
                Users: Users,
                error: req.flash('error').toString()
            });
  		  });
    //res.render('admin/register', { title: 'NodeCMS注册' })
  }else if( req.method === 'POST' ){
  	if(req.body.password != req.body.password_repeat ){
  	  req.flash('error','两次输入的密码不一致!');
      res.redirect('/admin/register');
  	}
    if(req.body.name){
      new User({
        name     :   req.body.name,
        password :   req.body.password,
        email    :   req.body.email
      }).save(function ( err ){
      	if(err) throw err;
      	res.redirect('/admin');
      });
    }else{
    	res.redirect('/admin/register');
    }
  }
};