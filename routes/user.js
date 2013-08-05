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
  if( req.method === 'GET' ){
    if (req.session.User) {
      res.redirect('/admin');
    }else{
      res.render('admin/login', { 
        title: 'NodeCMS登录',
        User: req.session.User,
        info: req.flash('info')
      });
    }
  }else if( req.method === 'POST' ){
    User.findOne({name:req.body.name})
      .exec(function ( err, User ){
        if( !User ){
          req.flash('info','用户名不存在!');
          res.redirect('/admin/login');
        }
        else if( md5(req.body.password) != User.password ){
          req.flash('info','密码错误!');
          res.redirect('/admin/login');
        }else{
          req.session.User = User;
          //req.flash('info','登录成功');
          res.redirect('/admin');
        }
      });
  }
};

exports.register = function(req, res){
  if( req.method === 'GET' ){
  	User.find()
  	  .exec(function (err ,Users){
		    res.render('admin/register', {
            title: 'NodeCMS注册',
            Users: Users,
            user: req.session.user,
            info: req.flash('info')
          });
  		  });
    //res.render('admin/register', { title: 'NodeCMS注册' })
  }else if( req.method === 'POST' ){
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
      var password = md5(req.body.password);
      var newUser = new User({
        name     :   req.body.name,
        password :   password,
        email    :   req.body.email
      });
      newUser.save(function ( err ){
      	if(err) throw err;
        //req.flash('info','注册成功');
        req.session.User = newUser;//用户信息存入 session
      	res.redirect('/admin');
      });
    }
  }
};

exports.userList = function (req, res) {
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  User.find()
    .exec(function(err, Users){
      res.render('admin/user-list', {
        title: '用户列表',
        Users: Users,
        User: req.session.User,
        info: req.flash('info')
      });
    });
};

exports.userAdd = function (req, res) {
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  if( req.method === 'GET' ){
    res.render('admin/user-add', { 
      title: '添加用户',
      info: req.flash('info'),
      User: req.session.User
    });
  }else if( req.method === 'POST' ){
    if(!req.body.name){
      req.flash('info','用户名不能为空');
      return res.redirect('/admin/user-add');
    }
    else if(req.body.password.length < 6){
      req.flash('info','密码不得小于6位');
      return res.redirect('/admin/user-add');
    }
    else if(req.body.password != req.body.password_repeat ){
      req.flash('info','两次输入的密码不一致!');
      return res.redirect('/admin/user-add');
    }
    else if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(req.body.email)){
      req.flash('info','email格式不正确');
      return res.redirect('/admin/user-add');
    }
    else{
      var password = md5(req.body.password);
      var newUser = new User({
        name     :   req.body.name,
        password :   password,
        email    :   req.body.email
      });
      newUser.save(function ( err ){
        if(err) throw err;
        req.flash('info','添加成功');
        res.redirect('/admin/user-list');
      });
    }
  }
};

exports.userEdit = function ( req, res, next ){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  User.findById( req.params.id, function ( err, Userthis ){
    if( err ) return next( err );
    res.render( 'admin/user-edit', {
      title   : '修改账号',
      Userthis : Userthis,
      info: req.flash('info'),
      User: req.session.User
    });
  });
};

exports.userUpdate = function ( req, res, next ){
  if(req.body.password != req.body.password_repeat ){
    req.flash('info','两次输入的密码不一致!');
    return res.redirect('/admin/user-edit/'+req.params.id);
  }
  User.findById( req.params.id, function ( err, User ){
    User.password = md5(req.body.password);
    User.save( function ( err, User ){
      if( err ) return next( err );
      req.flash('info','密码修改成功!');
      res.redirect( '/admin/user-list' );
    });
  });
};

exports.userDestroy = function ( req, res, next ){
  User.findById( req.params.id, function ( err, User ){
    User.remove( function ( err, User ){
      if( err ) return next( err );
      res.redirect( '/admin/user-list' );
    });
  });
};

exports.logout = function(req, res){
  req.session.User = null;
  req.flash('info','登出成功!');
  res.redirect('/admin/login');
};

function checkLogin(req, res, next){
  if(!req.session.User){
    req.flash('info','未登录!'); 
    return res.redirect('/admin/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.User){
    req.flash('info','已登录!'); 
    return res.redirect('/admin');
  }
  next();
}

exports.exportDate = function(req, res, next){
  var exec = require('child_process').exec;
  exec("mongoexport -d nodecms -c users -o users.dat", function (error, stdout, stderr) {
      content = stdout;
      console.log(content);
  });
}
