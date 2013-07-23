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

exports.index = function(req, res){
  res.render('default/index', { 
    title: '首页'
  });
};