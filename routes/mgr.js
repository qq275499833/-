let express = require('express');
let models = require('../models');
let toolkit = require('../help/comm/toolkit');
let router = express.Router();

router.get('/update',function (req,res) {
    (async () => { try {
        global.BasicConfig = await models.ConfigPT.findOne();
        global.OrderConfig = await models.OrderConfig.findOne();
        global.CdnConfig = await models.CDNConfig.findOne();
        global.ApikeyConfig = await models.ApikeyConfig.findOne();
        global.HLConfig = await models.HLConfig.findOne();
        let GoodsThemes = await models.GoodsTheme.findAll();
        for(let i in GoodsThemes){
            let theme = GoodsThemes[i];
            global.Theme[theme.filename] = theme;
        }
        let langs = await models.Lang.findAll();
        for(let i in langs){
            let lang = langs[i];
            global.Lang[lang.src] = lang;
        }
        res.send({msg:'更新成功'});
    } catch (err) {
        toolkit.Catch(null,null,err);
        res.send({
            error:true,
            msg:'更新失败'+err.message});
    }})();
});

router.get('/getinfo',function (req,res) {
    res.send({
        id: global.config.appid,
        name: "spasys",
        desc: "单页商城系统",
        version: global.appversion,
        runtime: ((new Date()-global.starttime)/1000/60).toFixed(1),
        hlconfig:{
            NT:global.HLConfig.NT,
            HK:global.HLConfig.HK,
            RM:global.HLConfig.RM,
            $:global.HLConfig.$,
            TH:global.HLConfig.TH,
            SS:global.HLConfig.SS,
        },
        templates:global.Theme,
        cdnserver:global.CdnConfig.cdnbase,
        orderserver:global.OrderConfig.server,
        today_views: global.Today_views,
        today_users: global.Today_users,
        today_query_orders: global.Today_query_orders,
        today_orders: global.Today_orders
    });
});
router.get('/info',function (req,res) {
    res.render('../views/mgr',{
        id: global.config.appid,
        name: "spasys",
        desc: "单页商城系统",
        version: global.appversion,
        runtime: ((new Date()-global.starttime)/1000/60).toFixed(1),
        hlconfig:global.HLConfig,
        templates:global.Theme,
        cdnserver:global.CdnConfig.cdnbase,
        orderserver:global.OrderConfig.server,
        today_views: global.Today_views,
        today_users: global.Today_users,
        today_query_orders: global.Today_query_orders,
        today_orders: global.Today_orders
    });
});
module.exports = router;