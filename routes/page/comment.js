let express = require('express');
let router = express.Router();
let orderProc = require('../service/orderProc');
let toolkit = require('../help/toolkit');
router.post('/',function (req, res) {
    (async () => {
        try {
            if(!req.body.goodsid||!req.body.phone||!req.body.sitedir)
                return toolkit.sendError(res);
            let ret = await orderProc.createComment(req, res);
            if(ret.Error){
                return toolkit.sendError(res, ret.Info);
            }else{
                res.send({Info: global.Lang['评价成功']});
                res.end();
            }
        } catch (err) {
            toolkit.Catch(null,null,err);
            return toolkit.sendError(res);
        }
    })();
});
module.exports = router;