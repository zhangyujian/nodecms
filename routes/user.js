require('../db');
var mongoose = require('mongoose'),
	  crypto = require('crypto'),
    flash = require('connect-flash'),
    User = mongoose.model('User');

exports.login = function(req, res){
  res.render('admin/login', { title: 'NodeCMS登录' })
};

exports.register = function(req, res){
  if( req.method === 'GET' ){
  	User.find()
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