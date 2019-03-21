const models = require('../models/index');
module.exports={
    querycomment: async function (id,page) {
        let page1 = page?page:1;
        let maxPa = await models.GoodsComment.findAll({
            where:{
                good_id:id,
                // isshow:1,
            },
        });
        let comments = await models.GoodsComment.findAll({
            where:{
                good_id:id,
            },
            offset:(page1-1)*10,
            limit:10,

        });
        return {
            comments:comments,
            page1:page1,
            maxPa:maxPa
        };
    },
    createComment:async function(req,res){
        let order=await models.OrderBasic.findOne({
            where:{
                clientphone:req.body.phone,
                orderstate:'end'
            },
            attributes:['username','clientname'],
            include: [{
                model: models.OrderGoods,
                attributes: ['goodsid','specname']
            }]

        });
        if(!order) return {Error: true, Info: global.Lang['您还未下单或者您的订单还未完成送货']};
        let GoodsComment = await models.GoodsComment.create({
            good_id:order.OrderGoods[0].goodsid,
            isshow:0,
            name:order.clientname,
            username:order.username,
            body:req.body.body,
            imgs:'',
            localion: req.realip+";"+req.body.phone,
            sitedir:req.body.sitedir,
            referer:req.body.referrer,
            specinfo:order.OrderGoods[0].specname,
            star:req.body.star
        });
        return GoodsComment;
    },
};