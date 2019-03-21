let express = require('express');
let router = express.Router();
let pageProc = require('../../service/pageProc');
let detail = require('../../service/detailProc');
let home = require('../../service/homeProc');
let theme=require('../../service/themeProc');
let toolkit = require('../../help/comm/toolkit');
router.get(['/'], function (req, res) {
    (async () => { try {
        toolkit.visit_stats(req);
        let type = '3';
        let id = req.query.id;
        let username=req.query.username;
        let homeId=req.query.home;
        let isMobile = req.useragent.isMobile ? '' : '_pc';
        const CDNConfig=global.CDNConfig();
        let page_data,data,goodshome;
        if(!username){
            data = await detail.getGoodsFromSitedir(req.cookies.sitedir, 0, req.domain, req.realip,req.cookies.timestr);
            if(!data){
                data = await detail.getGoodsFromSitedir(req.cookies.sitedir, 1, req.domain, req.realip,req.cookies.timestr);
                if(!data) return res.render('../views/error');
            }
            goodshome = await home.getGoodsHome(data.detail.home_select);
            page_data = await pageProc.getPageInfo(id,data.detail.username,type, data.detail.language);
            if(!page_data) return res.render('../views/error');
            page_data.homeId=data.detail.home_select;
            page_data.logo = goodshome.home?goodshome.home.logo:"";
            page_data.cdnbase=CDNConfig.cdnbase;
            page_data.domain = req.domain;
            data.detail.sitedir=req.cookies.sitedir;
            /*============判断模版是否可用================*/
            let themeinfo=await theme.getTheme(data.detail.template);
            if(!themeinfo||themeinfo.state ==='否'){
                data.detail.template = 'new01';
            }
            /*=============渲染模版================*/
            data.detail.template = req.template?req.template:data.detail.template;
            res.render(data.detail.template+'/page'+isMobile, {
                version:global.appversion,
                env:global.env,
                appid:global.appid,
                detail:data.detail,
                page:page_data
            });
        }else{
            goodshome = await home.getGoodsHome(homeId,username);
            page_data = await pageProc.getPageInfo(id,username,type, goodshome.home.language);
            if(!page_data) return res.render('../views/error');
            page_data.logo = goodshome.home?goodshome.home.logo:"";
            page_data.cdnbase=CDNConfig.cdnbase;
            page_data.domain = req.domain;
            page_data.template=goodshome.home.template;
            page_data.homeId=homeId;
            page_data.color=goodshome.home.color;
            res.render(goodshome.home.template+'/page'+isMobile, {
                version:global.appversion,
                env:global.env,
                appid:global.appid,
                page:page_data
            });
        }
    } catch (err) {toolkit.Catch(req,res,err);}})();
});
module.exports = router;