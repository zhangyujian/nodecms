var path = require('path');

exports.config = {
	debug: true,
	name: 'NodeCMS',
	description: 'NodeCMS网站管理系统，为提供最便捷的网站解决方案',
	keywords: 'NodeCMS CMS 开源程序 node.js',
	favicon: '/public/favicon.ico',//favicon.ico 路径
	//Service
	port: 3002,
	//db: 'mongodb://localhost/nodecms',//本地版本
	db: 'mongodb://yujian:zhang@121.199.29.125:27017/nodecms',//线上版本
	session_secret: 'NodeCMS',
    datapath: path.join(__dirname, '/public/data/img'),
};