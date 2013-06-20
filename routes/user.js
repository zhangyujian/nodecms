require('../db');

var mongoose = require('mongoose'),
	  crypto = require('crypto'),
    User = mongoose.model('User');

//创建md5方法
function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

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
    //var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if(!req.body.name){
      req.flash('info','用户名不能为空');
      return res.redirect('/admin/register');
    }
    else if(req.body.password.length < 6){
      req.flash('info','密码不得小于6位');
      return res.redirect('/admin/register');
    }
  	else if(req.body.password != req.body.password_repeat ){
  	  req.flash('info','两次输入的密码不一致!');
      return res.redirect('/admin/register');
  	}
    else if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(req.body.email)){
      req.flash('info','email格式不正确');
      return res.redirect('/admin/register');
    }
    else{
      new User({
        name     :   req.body.name,
        password :   md5(req.body.password),
        email    :   req.body.email
      }).save(function ( err ){
      	if(err) throw err;
        req.flash('info','注册成功');
      	res.redirect('/admin');
      });
    }
  }
};