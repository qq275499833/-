let express = require('express');
let router = express.Router();
let toolkit = require('./lib/toolkit');
let models  = require('../models/index');
router.post('/',function (req, res) {
    (async () => {
        try {
            let simple = JSON.parse(req.body.simpleinfo);
            if(!simple.clientname || !simple.username || !simple.language || !simple.clientphone || !simple.money || !simple.goodsid || !simple.template || !simple.clientaddress || !simple.clientreferer){
                return toolkit.sendError(res, "无效参数");
            }
            await models.OrderSimple.create(simple);
            //toolkit.OK(res, '保存成功');
            res.send({info: '添加成功'});
            res.end();
        } catch (err) {
            toolkit.savelog(err);
            return res.render('error');
        }
    })();
});
module.exports = router;