
/*
 * GET home page.
 */
require('../db');
var mongoose = require('mongoose'),
    fs = require('fs'), //引用处理文件功能
    crypto = require('crypto'), //引用md5加密
    Util = require('../libs/util'),
    Product = mongoose.model('Product'),
    ProductCat = mongoose.model('ProductCat'),
    Article = mongoose.model('Article'),
    Message = mongoose.model('Message');

exports.index = function(req, res){
  res.render('admin/index', { title: '首页' })
};

//创建md5方法
function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

// product
exports.productList = function(req, res){
  Product.count()
    .exec(function(err, count){
      Product.find()
        .skip(3*parseInt(req.query.p?req.query.p:0))
        .limit(3)
        .exec(function(err, Products){
          ProductCat.find()
            .exec(function(err, ProductCats){
              for(var i = 0; i < Products.length; i++){
                Products[i].friendly_date = Util.format_date(Products[i].date, true);
                //console.log(Util.format_date(Products[i].date, true));
                for(var y = 0; y < ProductCats.length; y++){
                  if(Products[i].cat_id.toString() === ProductCats[y]._id.toString()){
                    Products[i].cat_id = ProductCats[y].name;
                  }
                }
              }
              res.render('admin/product-list', {
                  title: '产品列表',
                  Products: Products,
                  req: req,
                  count: count
                });
            });
        });
    });

};

exports.productAdd = function (req, res) {
    if (req.method === 'GET') {
        ProductCat.find()
          .exec(function(err, ProductCats){
            res.render('admin/product-add', {
                title: '添加新产品',
                ProductCats: ProductCats
            });
          });
    } else if (req.method === 'POST') {
        var img = req.files.thumbnail.name.split('.'),
              img_name = md5(img[0]),
              img_ext  = img[1];
        var tmp_path = req.files.thumbnail.path,
        target_path = './public/data/img/' + img_name+ '.' +img_ext;//req.files.thumbnail.name;
        if (req.body.title) {
          new Product({
              title   : req.body.title,
              content : req.body.content,
              cat_id  : req.body.cat_id,
              price   : req.body.price,
              img     : req.files.thumbnail.name?img_name+ '.' +img_ext:"default.jpg",//req.files.thumbnail.name?req.files.thumbnail.name:"default.jpg",
              date    : Date.now()
          }).save(function (err) {
                  if (req.files.thumbnail.name) {
                    fs.rename(tmp_path, target_path, function(err) {
                      if(err) throw err;
                      fs.unlink(tmp_path, function(){
                        if(err) throw err;
                        //res.send(img_name+ '.' +img_ext);
                        res.redirect('/admin/product-list');
                      });
                    });
                  }else{
                    res.redirect('/admin/product-list');
                  }
              });
        }else{
          res.redirect('/admin/product-list');
        }
    }
};

exports.productEdit = function( req, res, next ){
  ProductCat.find()
    .exec(function(err, ProductCats){
      Product.findById( req.params.id, function ( err, Product ){
        if( err ) return next( err );
        res.render( 'admin/product-edit', {
          title   : '编辑产品',
          Product : Product,
          ProductCats : ProductCats
        });
      });
    });
  
};

exports.productUpdate = function( req, res, next ){
  Product.findById( req.params.id, function ( err, Product){
    var img = req.files.thumbnail.name.split('.'),
        img_name = md5(img[0]),
        img_ext  = img[1];
    var tmp_path = req.files.thumbnail.path,
        target_path = './public/data/img/' + img_name+ '.' +img_ext;//req.files.thumbnail.name;

    Product.title = req.body.title;
    Product.content = req.body.content;
    if(Product.cat_id != req.body.cat_id){
      Product.cat_id = req.body.cat_id;
    }
    Product.price = req.body.price;
    Product.img = req.files.thumbnail.name?img_name+ '.' +img_ext:Product.img;
    Product.save( function ( err, Product ){
      if( err ) return next( err );
      if (req.files.thumbnail.name) {
        fs.rename(tmp_path, target_path, function(err) {
          if(err) throw err;
          fs.unlink(tmp_path, function(){
            if(err) throw err;
            //res.send(img_name+ '.' +img_ext);
            res.redirect('/admin/product-list');
          });
        });
      }else{
        res.redirect('/admin/product-list');
      }
    });
  });
};

exports.productDestroy = function ( req, res, next ){
  Product.findById( req.params.id, function ( err, Product ){
    Product.remove( function ( err, Product ){
      if( err ) return next( err );
      res.redirect( '/admin/product-list' );
    });
  });
};

//product cat
exports.productCatList = function(req, res){
  ProductCat.find()
    .exec(function(err, ProductCats){
      res.render('admin/product-cat-list', {
          title: '产品分类列表',
          ProductCats: ProductCats
      });
    });
};

exports.productCatAdd = function (req, res) {
    if (req.method === 'GET') {
        ProductCat.find()
          .exec(function(err, ProductCats){
            res.render('admin/product-cat-add', {
                title: '添加产品分类',
                ProductCats: ProductCats
            });
          });
    } else if (req.method === 'POST') {
        if (req.body.name) {
          new ProductCat({
              name   : req.body.name
          }).save(function (err) {
                res.redirect('/admin/product-cat-list');
              });
        }else{
          res.redirect('/admin/product-cat-list');
        }
    }
};

exports.productCatDestroy = function ( req, res, next ){
  ProductCat.findById( req.params.id, function ( err, ProductCat ){
    ProductCat.remove( function ( err, ProductCat ){
      if( err ) return next( err );
      res.redirect( '/admin/product-cat-list' );
    });
  });
};

// message
exports.messageList = function (req, res) {
  Message.find()
    .exec(function (err, Messages) {
        res.render('admin/message-list', {
            title: '留言',
            Messages: Messages
        });
    });
};

exports.messageDestroy = function ( req, res, next ){
  Message.findById( req.params.id, function ( err, Message ){
    Message.remove( function ( err, Message ){
      if( err ) return next( err );
      res.redirect( '/admin/message-list' );
    });
  });
};