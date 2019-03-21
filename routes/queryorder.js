let express = require('express');
let router = express.Router();
let orderProc = require('../service/orderProc');
let toolkit = require('../help/comm/toolkit');
router.post('/',function (req, res) {
    (async () => {
        try {
            if (req.body.expressinfo&&req.body.url){
                if (req.session.LastInfo) {
                    if ((new Date().getTime() - req.session.LastInfo.time) / 1000 < 5)
                        return toolkit.sendError(res);
                    req.session.LastInfo.time = new Date().getTime();
                } else {
                    req.session.LastInfo = {ip: req.realip, time: new Date().getTime()};
                }
                let data = await orderProc.queryorder(req.body.expressinfo,req.body.url);
                if(!data||data.length === 0)
                    return toolkit.sendError(res);
                res.send({
                    orders: data
                });
            }else{
                res.send({
                    Error: true,
                    Info: global.Lang['请输入您的订单号，收货电话或收货人姓名']
                });
            }
        } catch (err) {
            toolkit.Catch(null,null,err);
            return toolkit.sendError(res);
        }
    })();
});
module.exports = router;