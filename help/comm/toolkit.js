const request = require('request');
const Raven = require("@sentry/node");
let toolkit = {
    getClientIp: function (req) {
        return (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress).replace('::ffff:', '');
    },
    Allow_CORS_POST:function (res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","POST");
    },
    Allow_CORS_GET:function (res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","GET");
    },
    Catch:function(req,res,error){
        setTimeout(function () {
            Raven.captureException(error);
        },10);
        console.error(error);
        if(res){
            if (global.env === 'development') {
                res.render('../views/error');
            } else {
                res.render('../views/error');
            }
        }
    },
    post_adv: function (url, data, headers) {
        return new Promise((resolve, reject)=>{
            request.post({url:url, form: data,headers:headers}, function(err,res){
                err ? reject(err) : resolve(res)
            });
        })
    },
    savelog:function (error, message) {
        setTimeout(function () {
            Raven.captureException(error);
        },10);
        console.error(message);
    },
    sendError:function (res, info) {
        return res.send({
            Error:true,
            Info:info||global.Lang['提交失败，请重新尝试或联系客服']
        });
    },
    getRealIp:function(req) {
        return (req.headers['x-real-ip'] || req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||(req.connection.socket?req.connection.socket.remoteAddress:"")).replace('::ffff:','');
    },
    visit_stats:function (req) {
        global.Today_views+=1;
        if(!global.ClientIpInfo[req.realip]){
            global.Today_users+=1;
            global.ClientIpInfo[req.realip] = {views: 1, orders:0};
        }else{
            global.ClientIpInfo[req.realip].views+=1;
        }
        if(!global.ClientDomainInfo[req.domain]){
            global.ClientDomainInfo[req.domain] = {views: 1, orders:0};
        }else{
            global.ClientDomainInfo[req.domain].views+=1;
        }
    }
};
module.exports = toolkit;