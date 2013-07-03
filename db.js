var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./config').config;
var ObjectId = Schema.ObjectId;

mongoose.connect(config.db);

var ArticleSchema = new Schema({  
    id       :    { type : Number,default:0 },
    cat_id   :    { type : String },
    title    :    { type : String },
    author   :    { type : String },
    content  :    { type : String },
    tags     :    [String],
    count    :    { type:Number, default:0 },
    img      :    { type : String },
    publish  :    { type: Boolean, default: false },
    date     :    { type: Date, default: Date.now },
    comments :    [{ email: String, name: String, content: String, date: Date }], 
});

var ArticleCatSchema = new Schema({
    name    :    { type : String }
});

var ProductSchema = new Schema({
	id       :    { type : Number,default:0 },
    cat_id   :    { type : String },
    title    :    { type : String },
    content  :    { type : String },
    img      :    { type : String },
    date     :    { type : Date,default: Date.now },
    price    :    { type : String },
});

var ProductCatSchema = new Schema({
    name    :    { type : String }
});

var MessageSchema = new Schema({
    name    :       { type : String },
    content :       { type : String },
    email   :       { type : String },
    date    :       { type : Date },
});

var FriendlinkSchema = new Schema({
    name    :       { type : String },
    link    :       { type : String },
});

var UserSchema = new Schema({
    name     :       { type : String },
    password :       { type : String },
    email    :       { type : String },
});

var PageSchema = new Schema({
    name     :       { type : String },
    content  :       { type : String },
    img      :       [String],
    url      :       { type : String },
});

mongoose.model('Article', ArticleSchema);
mongoose.model('ArticleCat', ArticleCatSchema);
mongoose.model('Product', ProductSchema);
mongoose.model('ProductCat', ProductCatSchema);
mongoose.model('Message', MessageSchema);
mongoose.model('Friendlink', FriendlinkSchema);
mongoose.model('User', UserSchema);
mongoose.model('Page', PageSchema);