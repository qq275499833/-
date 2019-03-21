let express = require('express');
let router = express.Router();
let comments = require('../service/comments');
let remotes = require('../service/remotes');
let toolkit = require('../help/comm/toolkit');
router.post('/',function (req, res) {
    (async () => {
        try {
            if(!req.body.goodsid||!req.body.phone||!req.body.sitedir)
                return toolkit.sendError(res);
            let ret = await comments.createComment(req, res);
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
router.get('/remote/:cityTest/:cityState/:cityArea',function(req, res){
    (async () => {
        try{
            //console.log(req.params);
            if(!req.params.cityTest)  return toolkit.sendError(res);
            let ret = await remotes.getremoteCity(req,res);
            if(ret.Error){
                return toolkit.sendError(res, ret.Info);
            }else{
                res.send({
                    cityMess:ret
                });
                //console.log(ret);
            }
        } catch(err){

        }
    })()
});
router.get('/remote1/:code/:cityState1',function(req, res){
    (async () => {
        try{
            if(!req.params.code)  return toolkit.sendError(res);
            let ret = await remotes.getremoteCode(req,res);
            if(ret.Error){
                return toolkit.sendError(res, ret.Info);
            }else{
                res.send({
                    cityMess:ret
                });
                //console.log(ret);
            }
        } catch(err){

        }
    })()
});
router.get('/remote2/:cityState/:cityArea/:all',function(req,res){
    (async () => {
        try{
            if(!req.params.cityArea)  return toolkit.sendError(res);
            let ret = await remotes.getremoteAll(req,res);
            if(ret.Error){
                return toolkit.sendError(res, ret.Info);
            }else{
                res.send({
                    cityMess:ret
                });
                //console.log(ret);
            }
        } catch(err){

        }
    })()
});
router.get('/remote3/:cityState/:cityArea/:zip/:cityTest',function(req,res){
    (async () => {
        try{
            if(!req.params.cityArea)  return toolkit.sendError(res);
            let ret = await remotes.getremoteZip(req,res);
            if(ret.Error){
                return toolkit.sendError(res, ret.Info);
            }else{
                res.send({
                    cityMess:ret
                });
                //console.log(ret);
            }
        } catch(err){

        }
    })()
});
module.exports = router;