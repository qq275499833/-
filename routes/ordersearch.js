let express = require('express');
let router = express.Router();
let detail = require('../service/detailProc');
let home = require('../service/homeProc');
let toolkit = require('../help/comm/toolkit');
let theme=require('../service/themeProc');
router.get(['/:site_id'], function (req, res) {
    (async () => { try {
        toolkit.visit_stats(req);
        let site_id = req.params.site_id;
        let data = await detail.getGoodsFromSitedir(site_id, 0, req.domain, req.realip,req.cookies.timestr);
        if(!data) {
            data = await detail.getGoodsFromSitedir(site_id, 1, req.domain, req.realip,req.cookies.timestr);
            if(!data) {
                return res.render('../views/error');
            }
        }
        data.detail.sitedir=req.params.site_id;
        // let data = await detail.getDetail(req.params.site_id,req.query.lang,req.query.theme);
        let goodshome = await home.getGoodsHome(data.detail.username);
        data.logo = goodshome.home?goodshome.home.logo:"";
        if(!data) return res.render('../views/error');
        /*============判断模版是否可用================*/
        let themeinfo=await theme.getTheme(data.detail.template);
        if(!themeinfo||themeinfo.state ==='否'){
            data.detail.template = 'new01';
        }
        /*============域名和下单服务器================*/
        data.detail.domain = req.domain;
        data.apiserver = "";
        data.version=global.appversion;
        data.env=global.env;
        data.appid=global.appid;
        data.detail.template = req.template?req.template:data.detail.template;
        /*=============渲染模版================*/
        res.render(data.detail.template+'/ordersearch', data);
    } catch (err) {toolkit.Catch(req,res,err);}})();
});
module.exports = router;