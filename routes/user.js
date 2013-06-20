require('../db');

var mongoose = require('mongoose'),
<<<<<<< HEAD
	  crypto = require('crypto'),
    flash = require('connect-flash'),
    User = mongoose.model('User');
=======
	  crypto   = require('crypto'),
    User     = mongoose.model('User');
>>>>>>> 2aa51ac4f61e321575eee7258e80af300f4a631d

exports.login = function(req, res){
  res.render('admin/login', { title: 'NodeCMS登录' })
};

exports.register = function(req, res){
  console.log(req.flash);
  if( req.method === 'GET' ){
  	User.find()
<<<<<<< HEAD
  	  .exec(function (err ,Users){
		    res.render('admin/register', {
            title: 'NodeCMS注册',
            Users: Users,
            info: req.flash('info')
          });
  		  });
    //res.render('admin/register', { title: 'NodeCMS注册' })
  }else if( req.method === 'POST' ){
  	if(req.body.password != req.body.password_repeat ){
  	  req.flash('info','两次输入的密码不一致!');
      return res.redirect('/admin/register');
  	}else{
      req.flash('info','注册成功');
      return res.redirect('/admin/register');
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