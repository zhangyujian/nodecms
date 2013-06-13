
/**
 * Module dependencies.
 */

var express = require('express')
  ,adminRoutes = require('./routes/admin')
  ,path = require('path')
  ,config = require('./config').config;

var app = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');//设置模板地址
  app.set('view engine', 'jade');//引用jade模板引擎
  app.use(express.favicon(__dirname + config.favicon));//设置favicon.ico
  app.use(express.bodyParser({uploadDir: __dirname+'/public/data/temp'}));//设置上传缓存路径
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/admin', adminRoutes.index);
//产品 Routes
app.get('/admin/product-list', adminRoutes.productList);
app.get('/admin/product-add', adminRoutes.productAdd);
app.post('/admin/product-add', adminRoutes.productAdd);
app.get('/admin/product-destroy/:id', adminRoutes.productDestroy);
app.get( '/admin/product-edit/:id', adminRoutes.productEdit);
//产品分类 Routes
app.get('/admin/product-cat-list', adminRoutes.productCatList);
app.get('/admin/product-cat-add', adminRoutes.productCatAdd);
app.post('/admin/product-cat-add', adminRoutes.productCatAdd);
app.get('/admin/product-cat-destroy/:id', adminRoutes.productCatDestroy);
//config 渲染到模板
app.locals({
  config:config
});

app.listen(config.port, function(){
  console.log("Express server listening on port 3002");
});
