let express = require('express');
let router = express.Router();
let pageProc = require('../service/pageProc');
let detail = require('../service/detailProc');
let home = require('../service/homeProc');
let theme=require('../service/themeProc');
let toolkit = require('../help/comm/toolkit');
router.get(['/:sitedir'], function (req, res) {
    (async () => { try {
        toolkit.visit_stats(req);
        let type = req.query.type;
        let id = req.query.id;
        let sitedir = req.params.sitedir;
        let page_data,data,goodshome;
        if(sitedir){
            let site_id = req.params.sitedir;
            let data = await detail.getGoodsFromSitedir(site_id, 0, req.domain, req.realip,req.cookies.timestr);
            if(!data) {
                data = await detail.getGoodsFromSitedir(site_id, 1, req.domain, req.realip,req.cookies.timestr);
                if(!data) {
                    return res.render('../views/error');
                }
            }
            if(!data) return res.send({Error:true});
            goodshome = await home.getGoodsHome(data.detail.home_select,data.detail.username);
            page_data = await pageProc.getPageInfo(id,data.detail.username,type, data.detail.language);
            if(!page_data) return res.send({Error:true});
            page_data.logo = goodshome.home?goodshome.home.logo:"";
            const CDNConfig=global.CDNConfig();
            page_data.cdnbase=CDNConfig.cdnbase;
            page_data.domain = req.domain;
            /*============判断模版是否可用================*/
            let themeinfo=await theme.getTheme(data.detail.template);
            if(!themeinfo||themeinfo.state ==='否'){
                data.detail.template = 'new01';
            }
            /*=============渲染模版================*/
            data.detail.template = req.template?req.template:data.detail.template;
            res.send({
                version:global.appversion,
                env:global.env,
                appid:global.appid,
                detail:data.detail,
                page:page_data
            })
        }
    } catch (err) {toolkit.Catch(req,res,err);}})();
});
module.exports = router;