require('../db');
var mongoose = require('mongoose'),
    config = require('../config').config,
    Util = require('../libs/util'),
    Product = mongoose.model('Product'),
    ProductCat = mongoose.model('ProductCat'),
    Article = mongoose.model('Article'),
    ArticleCat = mongoose.model('ArticleCat'),
    Message = mongoose.model('Message'),
    Friendlink = mongoose.model('Friendlink'),
    Page = mongoose.model('Page'),
    markdown = require('markdown').markdown;

// Front page

exports.index = function(req, res){
  res.render('default/index', { title: '专注用户体验' })
};
exports.sitebuild = function(req, res){
  res.render('default/sitebuild', { title: '网站建设-唯实' })
};
exports.about = function(req, res){
  res.render('default/about', { title: '关于我们/联系我们-唯实' })
};
exports.solution = function(req, res){
  res.render('default/solution', { title: '经典案例-唯实' })
};