let express = require('express');
let router = express.Router();
let detail = require('../service/detailProc');
let home = require('../service/homeProc');
let theme=require('../service/themeProc');
let toolkit = require('../help/comm/toolkit');
router.get(['/','/:site_id'], function (req, res) {
    (async () => { try {
        toolkit.visit_stats(req);
        toolkit.Allow_CORS_GET(res);
        let site_id = req.params.site_id;
        let data = await detail.getGoodsFromSitedir(site_id, 0, req.domain, req.realip,req.cookies.timestr);
        if(!data) {
             data = await detail.getGoodsFromSitedir(site_id, 1, req.domain, req.realip,req.cookies.timestr);
            if(!data) {
                return res.render('../views/error');
            }
        }
        let goodshome = await home.getGoodsHome(data.detail.home_select,data.detail.username);
        data.detail.sitedir=site_id;
        data.logo = goodshome.home?goodshome.home.logo:"";
        data.version=global.appversion;
        data.env=global.env;
        data.appid=global.appid;
        let themeinfo=await theme.getTheme(data.detail.template);
        /*============判断模版是否可用================*/
        if(!themeinfo||themeinfo.state ==='否'){
            data.detail.template = 'new01';
        }
        data.detail.template = req.template?req.template:data.detail.template;
        /*============域名和下单服务器================*/
        data.detail.domain = req.domain;
        data.apiserver = "";
        res.send(data);
    } catch (err) {toolkit.Catch(req,res,err);}})();
});
module.exports = router;