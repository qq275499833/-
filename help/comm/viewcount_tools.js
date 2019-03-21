const models = require('../../models/index');
module.exports={
    update: function () {
        let that=this;
        setInterval(async function () {
            await that._update();
        },60000);
    },
    _update:async function () {
        for(let key in global.DataCaches){
            if(key.indexOf('goods_viewcount_')>=0){
                let id=key.split('_')[2];
                let data=global.DataCaches[key];
                if(data.viewcount>0){
                    let goodsStatus=await models.GoodsStatus.findById(id);
                    if(goodsStatus){
                        await models.GoodsStatus.update({
                                viewcount: goodsStatus.viewcount + data.viewcount
                            }, {
                                where: {id:id}
                            },
                        );
                    }else{
                        await models.GoodsStatus.create({
                            id:id,
                            username:data.username,
                            viewcount:data.viewcount,
                            purchasecount:0,
                            salesmoney:0,
                            copycount:0,
                            returnedcount:0,
                            returnedmoney:0,
                            lastsoldtime:new Date()
                        })
                    }
                    data.viewcount=0;
                    global.DataCaches[key]=data;
                }
            }
        }
    }
};