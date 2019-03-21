let express = require('express');
let router = express.Router();
let orderProc = require('../service/orderProc');
let toolkit = require('../help/comm/toolkit');
router.post('/',function (req, res) {
    (async () => {
        try {
            if(!req.body.orderid || !req.body.payid || !req.body.paymentid || !req.body.paymenttoken || !req.body.returnurl || !req.body.orderidP)
                return toolkit.sendError(res);
            //console.error('判断通过');
            let ret =await orderProc.createOrderPaypal(req, res);
            if(ret.Error){
                return toolkit.sendError(res, ret.Info);
            }else{
                res.send({Info: global.Lang['付款成功']});
                res.end();
            }
        } catch (err) {
            toolkit.Catch(null,null,err);
            return toolkit.sendError(res);
        }
    })();
});
module.exports = router;