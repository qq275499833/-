let express = require('express');
let router = express.Router();
let home = require('../service/homeProc');
let toolkit = require('../help/comm/toolkit');
router.get(['/:id/:username',"/home/:id/:username/index.html"], function (req, res) {
    (async () => { try {
        let data = await home.getGoodsHome(req.params.id,req.params.username);
        if(!data) return res.render('../views/error');
        if(!data.home) return res.render('../views/error');
        let isMobile = req.useragent.isMobile ? '' : '_pc';
        res.render(data.home.template+'/home'+isMobile, data);
    } catch (err) {toolkit.Catch(req,res,err);}})();
});
module.exports = router;