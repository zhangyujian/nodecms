var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('./config').config;
var ObjectId = Schema.ObjectId;

mongoose.connect(config.db);

var ArticleSchema = new Schema({  
    title    :    { type : String },
    author   :    { type : String },
    content  :    { type : String },
    tags     :    [String],
    count    :    { type:Number, default:0 },
    img      :    { type : String },
    publish  :    { type: Boolean, default: false },
    date     :    { type: Date, default: Date.now },
    comments :    [{ email: String, name: String, content: String, date: Date }], 
    rate     :    { type:Number, default:0 },
    classify :    { type : String }
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

mongoose.model('Article', ArticleSchema);
mongoose.model('Product', ProductSchema);
mongoose.model('ProductCat', ProductCatSchema);
mongoose.model('Message', MessageSchema);