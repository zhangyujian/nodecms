require('../db');
var mongoose = require('mongoose'),
    config = require('../config').config,
    fs = require('fs'), //引用处理文件功能
    crypto = require('crypto'), //引用md5加密
    Util = require('../libs/util'),
    Product = mongoose.model('Product'),
    ProductCat = mongoose.model('ProductCat'),
    Article = mongoose.model('Article'),
    ArticleCat = mongoose.model('ArticleCat'),
    Message = mongoose.model('Message'),
    Friendlink = mongoose.model('Friendlink'),
    Page = mongoose.model('Page'),
    markdown = require('markdown').markdown;

//创建md5方法
function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}
// uploadify 
exports.upload = function (req, res) {
  var fileDesc = req.files,
    imgname = fileDesc.Filedata.name,
    path = fileDesc.Filedata.path,
    name = path.replace(config.datapath, ''),
    imgurl = 'http://localhost:3002/data/img/' + name;
  res.send(imgurl);
};

exports.index = function(req, res){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  res.render('admin/index', { 
    title: '首页',
    User: req.session.User
  });
};

// product
exports.productList = function(req, res){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  Product.count()
    .exec(function(err, count){
      Product.find()
        .skip(8*parseInt(req.query.p?req.query.p:0))
        .limit(8)
        .sort({ date: 'desc' })
        .exec(function(err, Products){
          ProductCat.find()
            .exec(function(err, ProductCats){
              for(var i = 0; i < Products.length; i++){
                Products[i].friendly_date = Util.format_date(Products[i].date, true);
                //解析 markdown 为 html
                Products[i].content = markdown.toHTML(Products[i].content);
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
                  count: count,
                  User: req.session.User
                });
            });
        });
    });
};

exports.productAdd = function (req, res) {
    if (!req.session.User) {
      return res.redirect('/admin/login');
    }
    if (req.method === 'GET') {
        ProductCat.find()
          .exec(function(err, ProductCats){
            res.render('admin/product-add', {
                title: '添加新产品',
                ProductCats: ProductCats,
                User: req.session.User
            });
          });
    } else if (req.method === 'POST') {
        if (req.body.title) {
          var imgs = req.body.file_img.split(',');
          console.log(imgs);
          new Product({
              title   : req.body.title,
              content : req.body.content,
              cat_id  : req.body.cat_id,
              price   : req.body.price,
              img     : imgs,
              date    : Date.now()
          }).save(function (err) {
              if(err) throw err;
                res.redirect('/admin/product-list');
              });
        }else{
          res.redirect('/admin/product-list');
        }
    }
};

exports.productEdit = function( req, res, next ){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  ProductCat.find()
    .exec(function(err, ProductCats){
      Product.findById( req.params.id, function ( err, Product ){
        if( err ) return next( err );
        res.render( 'admin/product-edit', {
          title   : '编辑产品',
          Product : Product,
          ProductCats : ProductCats,
          User: req.session.User
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
        target_path = './public/data/img/' + img_name+ '.' +img_ext;
    var tmp_img = './public/data/img/' + Product.img;
    Product.title = req.body.title;
    Product.content = req.body.content;
    if(Product.cat_id != req.body.cat_id){
      Product.cat_id = req.body.cat_id;
    }
    Product.price = req.body.price;
    Product.img = req.files.thumbnail.name?img_name+ '.' +img_ext:Product.img;
    /*
    if(req.files.thumbnail.name){
      fs.unlink(tmp_img);
    }
    */
    Product.save( function ( err, Product ){
      if( err ) return next( err );
      if (req.files.thumbnail.name) {
        fs.rename(tmp_path, target_path, function(err) {
          if(err) throw err;
          fs.unlink(tmp_path, function(){
            if(err) throw err;
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
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  ProductCat.find()
    .exec(function(err, ProductCats){
      res.render('admin/product-cat-list', {
          title: '产品分类列表',
          ProductCats: ProductCats,
          User: req.session.User
      });
    });
};

exports.productCatAdd = function (req, res) {
    if (!req.session.User) {
      return res.redirect('/admin/login');
    }
    if (req.method === 'GET') {
        ProductCat.find()
          .exec(function(err, ProductCats){
            res.render('admin/product-cat-add', {
                title: '添加产品分类',
                ProductCats: ProductCats,
                User: req.session.User
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

exports.productCatEdit = function( req, res, next ){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  ProductCat.findById( req.params.id, function ( err, ProductCat ){
    if( err ) return next( err );
    res.render( 'admin/product-cat-edit', {
      title   : '编辑产品分类',
      ProductCat : ProductCat,
      User: req.session.User
    });
  });
};

exports.productCatUpdate = function ( req, res ){
  ProductCat.findById( req.params.id, function ( err, ProductCat ){
    ProductCat.name = req.body.name;
    ProductCat.save( function ( err, ProductCat ){
      if( err ) return next( err );
      res.redirect( 'admin/product-cat-list' );
    });
  });
};

//Article
exports.articleList = function(req, res){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  Article.count()
    .exec(function(err, count){
      Article.find()
        .skip(8*parseInt(req.query.p?req.query.p:0))
        .limit(8)
        .exec(function(err, Articles){
          ArticleCat.find()
            .exec(function(err, ArticleCats){
              for(var i = 0; i < Articles.length; i++){
                Articles[i].friendly_date = Util.format_date(Articles[i].date, true);
                //解析 markdown 为 html
                Articles[i].content = markdown.toHTML(Articles[i].content);
                for(var y = 0; y < ArticleCats.length; y++){
                  if(Articles[i].cat_id.toString() === ArticleCats[y]._id.toString()){
                    Articles[i].cat_id = ArticleCats[y].name;
                  }
                }
              }
              res.render('admin/article-list', {
                  title: '文章列表',
                  Articles: Articles,
                  req: req,
                  count: count,
                  User: req.session.User
                });
            });
        });
    });
};

exports.articleAdd = function (req, res) {
    if (!req.session.User) {
      return res.redirect('/admin/login');
    }
    if (req.method === 'GET') {
        ArticleCat.find()
          .exec(function(err, ArticleCats){
            res.render('admin/article-add', {
                title: '添加新文章',
                ArticleCats: ArticleCats,
                User: req.session.User
            });
          });
    } else if (req.method === 'POST') {
        var img = req.files.thumbnail.name.split('.'),
              img_name = md5(img[0]),
              img_ext  = img[1];
        var tmp_path = req.files.thumbnail.path,
        target_path = './public/data/img/' + img_name+ '.' +img_ext;
        if (req.body.title) {
          new Article({
              title   : req.body.title,
              content : req.body.content,
              cat_id  : req.body.cat_id,
              img     : req.files.thumbnail.name?img_name+ '.' +img_ext:"default.jpg",
              date    : Date.now()
          }).save(function (err) {
                  if (req.files.thumbnail.name) {
                    fs.rename(tmp_path, target_path, function(err) {
                      if(err) throw err;
                      fs.unlink(tmp_path, function(){
                        if(err) throw err;
                        res.redirect('/admin/article-list');
                      });
                    });
                  }else{
                    res.redirect('/admin/article-list');
                  }
              });
        }else{
          res.redirect('/admin/article-list');
        }
    }
};

exports.articleEdit = function( req, res, next ){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  ArticleCat.find()
    .exec(function(err, ArticleCats){
      Article.findById( req.params.id, function ( err, Article ){
        if( err ) return next( err );
        res.render( 'admin/article-edit', {
          title   : '编辑文章',
          Article : Article,
          ArticleCats : ArticleCats,
          User: req.session.User
        });
      });
    });
};

exports.articleUpdate = function( req, res, next ){
  Article.findById( req.params.id, function ( err, Article){
    var img = req.files.thumbnail.name.split('.'),
        img_name = md5(img[0]),
        img_ext  = img[1];
    var tmp_path = req.files.thumbnail.path,
        target_path = './public/data/img/' + img_name+ '.' +img_ext;//req.files.thumbnail.name;

    Article.title = req.body.title;
    Article.content = req.body.content;
    if(Article.cat_id != req.body.cat_id){
      Article.cat_id = req.body.cat_id;
    }
    Article.img = req.files.thumbnail.name?img_name+ '.' +img_ext:Article.img;
    Article.save( function ( err, Article ){
      if( err ) return next( err );
      if (req.files.thumbnail.name) {
        fs.rename(tmp_path, target_path, function(err) {
          if(err) throw err;
          fs.unlink(tmp_path, function(){
            if(err) throw err;
            res.redirect('/admin/article-list');
          });
        });
      }else{
        res.redirect('/admin/article-list');
      }
    });
  });
};

exports.articleDestroy = function ( req, res, next ){
  Article.findById( req.params.id, function ( err, Article ){
    Article.remove( function ( err, Article ){
      if( err ) return next( err );
      res.redirect( '/admin/article-list' );
    });
  });
};

//Article cat
exports.articleCatList = function(req, res){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  ArticleCat.find()
    .exec(function(err, ArticleCats){
      res.render('admin/article-cat-list', {
          title: '文章分类',
          ArticleCats: ArticleCats,
          User: req.session.User
      });
    });
};

exports.articleCatAdd = function (req, res) {
    if (!req.session.User) {
      return res.redirect('/admin/login');
    }
    if (req.method === 'GET') {
        ArticleCat.find()
          .exec(function(err, ArticleCats){
            res.render('admin/article-cat-add', {
                title: '添加文章分类',
                ArticleCats: ArticleCats,
                User: req.session.User
            });
          });
    } else if (req.method === 'POST') {
        if (req.body.name) {
          new ArticleCat({
              name   : req.body.name
          }).save(function (err) {
                res.redirect('/admin/article-cat-list');
              });
        }else{
          res.redirect('/admin/article-cat-list');
        }
    }
};

exports.articleCatDestroy = function ( req, res, next ){
  ArticleCat.findById( req.params.id, function ( err, ArticleCat ){
    ArticleCat.remove( function ( err, ArticleCat ){
      if( err ) return next( err );
      res.redirect( '/admin/article-cat-list' );
    });
  });
};

exports.articleCatEdit = function( req, res, next ){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  ArticleCat.findById( req.params.id, function ( err, ArticleCat ){
    if( err ) return next( err );
    res.render( 'admin/article-cat-edit', {
      title   : '编辑产品分类',
      ArticleCat : ArticleCat,
      User: req.session.User
    });
  });
};

exports.articleCatUpdate = function ( req, res ){
  ArticleCat.findById( req.params.id, function ( err, ArticleCat ){
    ArticleCat.name = req.body.name;
    ArticleCat.save( function ( err, ArticleCat ){
      if( err ) return next( err );
      res.redirect( 'admin/article-cat-list' );
    });
  });
};

// message
exports.messageList = function (req, res) {
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  Message.find()
    .exec(function (err, Messages) {
        res.render('admin/message-list', {
            title: '留言列表',
            Messages: Messages,
            User: req.session.User
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

// link
exports.friendlinkList = function (req, res) {
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  Friendlink.find()
    .exec(function (err, Friendlinks) {
        res.render('admin/friendlink', {
            title: '友情链接列表',
            Friendlinks: Friendlinks,
            User: req.session.User
        });
    });
};

exports.friendlinkAdd = function (req, res) {
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  if (req.method === 'GET') {
    res.render('admin/friendlink-add', {
        title: '添加产品分类',
        User: req.session.User
    });
  } else if (req.method === 'POST') {
    if (req.body.name) {
      new Friendlink({
          name   : req.body.name,
          link   : req.body.link
      }).save(function (err) {
            res.redirect('/admin/friendlink');
          });
    }else{
      res.redirect('/admin/friendlink');
    }
  }
};

exports.friendlinkEdit = function ( req, res, next ){
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  Friendlink.findById( req.params.id, function ( err, Friendlink ){
    if( err ) return next( err );
    res.render( 'admin/friendlink-edit', {
      title   : '编辑友情链接',
      Friendlink : Friendlink,
      User: req.session.User
    });
  });
};

exports.friendlinkUpdate = function ( req, res, next ){
  Friendlink.findById( req.params.id, function ( err, Friendlink ){
    Friendlink.name = req.body.name;
    Friendlink.link = req.body.link;
    Friendlink.save( function ( err, Friendlink ){
      if( err ) return next( err );
      res.redirect( '/admin/friendlink' );
    });
  });
};

exports.friendlinkDestroy = function ( req, res, next ){
  Friendlink.findById( req.params.id, function ( err, Friendlink ){
    Friendlink.remove( function ( err, Friendlink ){
      if( err ) return next( err );
      res.redirect( '/admin/friendlink' );
    });
  });
};

//page
exports.pageList = function (req, res ) {
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  Page.find()
    .exec(function (err, Pages) {
      res.render('admin/page-list', {
          title: '页面列表',
          Pages: Pages,
          User: req.session.User
      });
    });
};

exports.pageAdd = function (req, res) {
  if (!req.session.User) {
    return res.redirect('/admin/login');
  }
  if (req.method === 'GET') {
    res.render('admin/page-add', {
        title: '添加新页面',
        User: req.session.User
    });
  } else if (req.method === 'POST') {
    if (req.body.name) {
      new Page({
          name   : req.body.name,
          content: req.body.content,
          url    : req.body.url
      }).save(function (err) {
            res.redirect('/admin/page-list');
          });
    }else{
      res.redirect('/admin/page-list');
    }
  }
};

exports.pageDestroy = function ( req, res, next ){
  Page.findById( req.params.id, function ( err, Page ){
    Page.remove( function ( err, Page ){
      if( err ) return next( err );
      res.redirect( '/admin/page-list' );
    });
  });
};