const redisProc = require('../help/redis/redis_proc');
const models = require('../models/index');
module.exports = {
    getGoodsHome: async function (id,username) {
        let home_data = await this.getHomeInfo(id,username);
        const CDNConfig=await global.CDNConfig();
        if (!home_data) return {
            cdnbase: CDNConfig.cdnbase,
            home: null
        };
        return {
            cdnbase: CDNConfig.cdnbase,
            home: home_data
        };
    },

    getHomeInfo: async function(id,username){
        if(!id || id==="" || id==='0'){
            const ret = await models.GoodsHome.findOne({
                where: {original: '1',username:username},
                attributes:['id']
            });
            if(!ret) return null;
            id = ret.id;
        }
        let home_data = await redisProc.get_home_cache(id);
        if (!home_data) {
            let homeinfo = await models.GoodsHome.findOne({
                where: {id: id},
                include: [{
                    model: models.User,
                    attributes: ['id', 'fblink', 'linelink', 'whatsapplink', 'email']
                }]
            });
            if (!homeinfo) return null;
            if(homeinfo.heads) homeinfo.heads = JSON.parse(homeinfo.heads);
            if(homeinfo.types){
                let temp = JSON.parse(homeinfo.types?homeinfo.types:'[]');
                homeinfo.types = [];
                for(let i in temp){
                    let typeinfo = temp[i];
                    if(typeinfo.name && typeinfo.goods){
                        let goodslist = await models.Goods.findAll({
                            where:{
                                id: typeinfo.goods
                            },
                            attributes:['sitename','sitedir','head_imgs','price','oldprice']
                        });
                        homeinfo.types.push({name: typeinfo.name, goods: goodslist});
                    }
                }
            }
            await redisProc.set_home_cache(id, JSON.stringify(homeinfo));
            home_data = homeinfo;
        } else {
            home_data = JSON.parse(home_data);
        }
        return home_data;
    }
};