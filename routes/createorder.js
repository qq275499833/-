let express = require('express');
let router = express.Router();
let orderProc = require('../service/orderProc');
let toolkit = require('../help/comm/toolkit');
router.post('/',function (req, res) {
    (async () => {
        try {
            //console.error('进入下单');
            global.Today_query_orders += 1;
            if(!req.body.goodsinfo||!req.body.cartinfo||!req.body.clientinfo)
                return toolkit.sendError(res);
            //console.error('判断通过');
            let ret = await orderProc.createOrder(req, res);
            //console.error('下单完成');
            if(ret.Error){
                //console.error('下单出错了');
                return toolkit.sendError(res, global.Lang[ret.Info]);
            }else{
                //console.log(ret);
                //console.error('下单正常');
                global.Today_orders += 1;
                if(!global.ClientIpInfo[req.realip]){
                    global.ClientIpInfo[req.realip] = {views: 1, orders:1};
                }else{
                    global.ClientIpInfo[req.realip].orders+=1;
                }
                if(!global.ClientDomainInfo[req.domain]){
                    global.ClientDomainInfo[req.domain] = {views: 1, orders:1};
                }else{
                    global.ClientDomainInfo[req.domain].orders+=1;
                }
                //console.error('应答');
                res.send({
                    orderInfo:{
                        orderid: ret.orderid,
                        clientname: ret.clientname,
                        clientaddress: ret.clientaddress,
                        orderprice: ret.orderprice,
                        orderphone: ret.clientphone,
                    }
                });
                //console.error('应答完成');
            }
        } catch (err) {
            toolkit.Catch(null,null,err);
            return toolkit.sendError(res);
        }
    })();
});
module.exports = router;