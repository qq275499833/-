let express = require('express');
let router = express.Router();
let comments = require('../service/comments');
let toolkit = require('../help/comm/toolkit');
router.get('/:id',function (req, res) {
    (async () => { try {
        let data = await comments.querycomment(req.params.id,req.query.page);
        if(!data||data.length === 0){
            return toolkit.sendError(res);
        }
        res.send({
            page:req.query.page,
            maxPage:(data.maxPa.length%5)?Math.ceil(data.maxPa.length/5):data.maxPa.length/5,
            comments: data.comments,
            total:data.maxPa.length,
        });
    } catch (err) {
        toolkit.Catch(null,null,err);
        res.send({
            comments: []
        });
    }})();
});
module.exports = router;