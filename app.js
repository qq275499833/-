const path = require('path');
const xtpl = require('xtpl');
require("./help/comm/xtplcmd");
const Redis = require('ioredis');
const logger = require('morgan');
require('./help/comm/date_tools');
const express = require('express');
const sentry = require('@sentry/node');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const toolkit = require('./help/comm/toolkit');
const userAgent = require('express-useragent');
const RedisStore = require('connect-redis')(session);

/*-----------统计变量-----------*/
global.Today_views = 0;
global.Today_users = 0;
global.Today_query_orders = 0;
global.Today_orders = 0;
global.ClientIpInfo = {};
global.ClientDomainInfo = {};

/*-----------系统变量-----------*/
global.Lang = {};
global.AreaInfo = {};
global.twStore={};
global.redisclient = {};
global.DataCaches={};
global.starttime = new Date();
global.appid=global.config.appid;

const app = express();

//控制台输出环境信息
global.appversion = "20190219-02";
global.env = app.get('env');
console.error("运行环境:", global.env, process.env.NODE_ENV);
console.error('程序版本：' + global.appversion);

//线上模式不输出日志
if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));

//模板引擎
app.set('views', path.join(__dirname, 'theme'));
app.engine('.html', xtpl.__express);
app.set('view engine', 'html');

//错误上报
sentry.init({
    dsn: 'https://eca03204a1c9477591c5c8d64dee9081@sentry.seezt.top/3',
    maxBreadcrumbs: 50,
    release: global.appversion
});
sentry.configureScope(scope => {
    scope.setExtra('battery', 0.3);
    scope.setTag({
        appid:global.config.appid,
        version:global.appversion
    });
});

//去掉header的服务器版本
app.set('x-powered-by', false);

//GZIP
app.use(compression());

//userAgent
app.use(userAgent.express());

//cookie
app.use(cookieParser());

//session
global.sessionStore = new RedisStore({
    client: new Redis(global.config.redis[global.config.appid]),
    prefix: "session_erp" + "_"+global.config.appid + ":"
});
app.use(session({
    name: "session_erp" + "_"+global.config.appid,
    secret: 'secret',
    cookie: {maxAge: 1000 * 60 * 60 * 6,httpOnly:false},
    resave: true,
    rolling: true,
    saveUninitialized: false,
    store: global.sessionStore
}));

//静态文件
app.use(express.static(path.join(__dirname, 'public')));

//解析IP
app.use(function (req,res,next) {
    req.ip = toolkit.getClientIp(req);
    next();
});

//解析jsonBody
app.use(bodyParser.json());

//解析form表单
app.use(bodyParser.urlencoded({extended: false}));

//路由
app.use('/theme',express.static(path.join(__dirname, 'theme')));
app.use(function (req, res, next) {
    req.domain = req.hostname?req.hostname.replace('www.', ''):"";
    req.realip = toolkit.getClientIp(req);
    if(global.env==='development') {//开发模式强制使用固定模板
        req.template = 'new39';
    }
    next();
});
app.use('/queryorder', require('./routes/queryorder'));
app.use('/createOrderPaypal', require('./routes/createOrderPaypal'));
app.use('/querycomments', require('./routes/querycomments'));
app.use('/comment', require('./routes/comment'));
app.use('/indexData', require('./routes/indexData'));
app.use('/createorder', require('./routes/createorder'));
app.use('/getpurchaseinfo', require('./routes/getpurchaseinfo'));
app.use('/pageData', require('./routes/pageData'));
app.use('/buy', require('./routes/buy'));
app.use('/ordersearch', require('./routes/ordersearch'));
app.use('/api/getSubAddressList', require('./routes/getSubAddressList'));
app.use('/twStore', require('./routes/twStore'));
app.use('/about', require('./routes/page/about'));
app.use('/contact', require('./routes/page/contact'));
app.use('/privacy', require('./routes/page/privacy'));
app.use('/terms', require('./routes/page/terms'));
app.use('/service', require('./routes/page/service'));
app.use('/home', require('./routes/home'));
app.use('/mgr', require('./routes/mgr'));
app.use('/page', require('./routes/page/other'));
app.get('/favicon.ico',function (req,res) {
    res.status(404);
});
app.use('/', require('./routes/index'));
/*-----------处理各种404-----------*/
app.use(function (req, res, next) {
    res.render('../views/error');
});
/*-----------输出错误信息-----------*/
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    toolkit.Catch(req, res, err);
});
module.exports = app;
