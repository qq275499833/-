let express = require('express');
let router = express.Router();
let detail = require('../service/detailProc');
let home = require('../service/homeProc');
let theme = require('../service/themeProc');
const userService = require("../service/user");
let toolkit = require('../help/comm/toolkit');
router.get(['/', '/:site_id', "/:site_id/home.html", "/:site_id/index.html", "/:site_id/detail.html", '/:site_id/cart.html',
    '/:site_id/cart', '/cart/:site_id', '/:site_id/:path', '/:site_id/:path/:id/:username'], async function (req, res) {
    try {
        //获取商品基本信息
        let site_id = req.params.site_id;
        let path = req.params.path;
        let time=req.query.t;
        let is_domain;
        if (site_id) {
            let ranges = [
                '\ud83c[\udf00-\udfff]',
                '\ud83d[\udc00-\ude4f]',
                '\ud83d[\ude80-\udeff]'
            ];
            if (path) {
                if (path === 'home') {
                    let data = await home.getGoodsHome(req.params.id, req.params.username);
                    if (!data) return res.render('../views/error');
                    if (!data.home) return res.render('../views/error');
                    let isMobile = req.useragent.isMobile ? '' : '_pc';
                    res.render(data.home.template + '/home' + isMobile, data);
                    return;
                } else {
                    site_id = path.replace(new RegExp(ranges.join('|'), 'g'), '');
                }
            } else {
                site_id = site_id.replace(new RegExp(ranges.join('|'), 'g'), '');
            }
        } else {
            site_id = req.domain;
            is_domain = 1;
        }
        let data = await detail.getGoodsFromSitedir(site_id, is_domain, req.domain, req.realip, time);
        if (!data) return res.render('../views/error');
        if (data.detail.state !== '上架中') {
            return res.render('../views/error');
        }
        data.detail.sitedir = site_id;
        data.version = global.appversion;
        data.env = global.env;
        data.appid = global.appid;
        data.detail.domain = req.domain;
        data.apiserver = "";
        //获取用户信息
        let user = await userService.getUser(data.detail.username);
        if (!user) return res.render('../views/error');
        //获取首页信息
        let goodshome = await home.getGoodsHome(data.detail.home_select, data.detail.username);
        data.logo = goodshome.home ? goodshome.home.logo : "";
        //获取语言信息

        //获取偏远信息

        //更新浏览量
        toolkit.visit_stats(req);
        let vcdata=global.DataCaches['goods_viewcount_'+data.detail.id];
        if(vcdata){
            vcdata.viewcount+=1;
            global.DataCaches['goods_viewcount_'+data.detail.id]=vcdata;
        }else{
            global.DataCaches['goods_viewcount_'+data.detail.id]={
                username:data.detail.username,viewcount:1
            }
        }
        //渲染页面
        /*============判断模版是否可用================*/
        let themeinfo = await theme.getTheme(data.detail.template);
        if (!themeinfo || themeinfo.state === '否') {
            data.detail.template = 'new01';
        }
        /*=============渲染模版================*/
        let isMobile = req.useragent.isMobile ? '' : '_pc';
        res.cookie('sitedir', data.detail.sitedir, {path: '/'});
        res.cookie('timestr', time, {path: '/'});
        data.detail.template = req.template ? req.template : data.detail.template;
        res.render(data.detail.template + '/detail' + isMobile, data);
    } catch (err) {
        toolkit.Catch(req, res, err);
    }
});
module.exports = router;