
/**
 * Module dependencies.
 */

var express     = require('express')
  , adminRoutes = require('./routes/admin')
  , userRoutes  = require('./routes/user')
  , path        = require('path')
  , flash       = require('connect-flash')
  , config      = require('./config').config;

var app = express();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');//设置模板地址
  app.set('view engine', 'jade');//引用jade模板引擎
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ key: 'sid', cookie: { maxAge: 60000 }}));
  app.use(express.favicon(__dirname + config.favicon));//设置favicon.ico
  app.use(express.bodyParser({uploadDir: __dirname+'/public/data/temp'}));//设置上传缓存路径
  app.use(express.methodOverride());

  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


app.get('/', function(req, res){
  res.send({ message: req.flash('info') });
});

app.get('/flash', function(req, res){
  req.flash('info', 'Hi there!')
  res.redirect('/');
});

app.get('/no-flash', function(req, res){
  res.redirect('/');
});

app.get('/multiple-flash', function(req, res){
    req.flash('info', ['Welcome', 'Please Enjoy']);
    res.redirect('/');
});

// Routes
app.get('/admin', adminRoutes.index);
//产品 Routes
app.get('/admin/product-list', adminRoutes.productList);
app.get('/admin/product-add', adminRoutes.productAdd);
app.post('/admin/product-add', adminRoutes.productAdd);
app.get('/admin/product-destroy/:id', adminRoutes.productDestroy);
app.get( '/admin/product-edit/:id', adminRoutes.productEdit);
app.post( '/admin/product-update/:id', adminRoutes.productUpdate);
//产品分类 Routes
app.get('/admin/product-cat-list', adminRoutes.productCatList);
app.get('/admin/product-cat-add', adminRoutes.productCatAdd);
app.post('/admin/product-cat-add', adminRoutes.productCatAdd);
app.get('/admin/product-cat-destroy/:id', adminRoutes.productCatDestroy);
app.get( '/admin/product-cat-edit/:id', adminRoutes.productCatEdit);
app.post( '/admin/product-cat-update/:id', adminRoutes.productCatUpdate);

//文章 Routes
app.get('/admin/article-list', adminRoutes.articleList);
app.get('/admin/article-add', adminRoutes.articleAdd);
app.post('/admin/article-add', adminRoutes.articleAdd);
app.get('/admin/article-destroy/:id', adminRoutes.articleDestroy);
app.get( '/admin/article-edit/:id', adminRoutes.articleEdit);
app.post( '/admin/article-update/:id', adminRoutes.articleUpdate);
//文章分类 Routes
app.get('/admin/article-cat-list', adminRoutes.articleCatList);
app.get('/admin/article-cat-add', adminRoutes.articleCatAdd);
app.post('/admin/article-cat-add', adminRoutes.articleCatAdd);
app.get('/admin/article-cat-destroy/:id', adminRoutes.articleCatDestroy);
app.get( '/admin/article-cat-edit/:id', adminRoutes.articleCatEdit);
app.post( '/admin/article-cat-update/:id', adminRoutes.articleCatUpdate);

//留言 Routes
app.get('/admin/message-list',adminRoutes.messageList);
app.get('/admin/message-destroy/:id',adminRoutes.messageDestroy);

//友情链接 Routes
app.get('/admin/friendlink',adminRoutes.friendlinkList);
app.get('/admin/friendlink-add', adminRoutes.friendlinkAdd);
app.post('/admin/friendlink-add', adminRoutes.friendlinkAdd);
app.get('/admin/friendlink-destroy/:id',adminRoutes.friendlinkDestroy);
app.get( '/admin/friendlink-edit/:id', adminRoutes.friendlinkEdit);
app.post( '/admin/friendlink-update/:id', adminRoutes.friendlinkUpdate);

//用户 Routes
app.get('/admin/login',userRoutes.login);
app.get('/admin/register',userRoutes.register);
app.post('/admin/register',userRoutes.register);
//config 渲染到模板
app.locals({
  config:config
});

app.listen(config.port, function(){
  console.log("Express server listening on port 3002");
});
