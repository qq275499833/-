const redisProc = require('../help/redis/redis_proc');
const zip = require('../help/zip');
const models = require('../models/index');
const skipGoodsProc = require("../help/goods/skipGoodsProc");
module.exports = {
    getGoodsFromSitedir:async function (site_id,is_domain,domain,realip,time) {
        //获取商品ID
        const gid = await this.getGoodsIdBySitedir(site_id,is_domain);
        if(gid === 0) return null;
        //获取商品
        let goods = await this.getGoodsFromCache(gid);
        if (!goods) return null;
        //检测跳转
        let detail=await this.checkSkipGoods(goods,domain,realip,time);
        const CDNConfig=await global.CDNConfig();
        return {
            cdnbase: CDNConfig.cdnbase,
            detail: detail
        };
    },
    getGoodsIdBySitedir:async function(site_id,is_domain){
        if(!site_id&&!is_domain)return null;
        let good,where = {};
        where.state= {$notIn:["已下架", "已删除",'待编辑']};
        if(is_domain){
            let domain=await models.Domain.findOne({
                where:{name:site_id}, attributes:['id']
            });
            if(!domain)return null;
            where.domain_id=domain.id;
            where.is_domain=is_domain;
        }else{
            where.sitedir=site_id;
        }
        good = await models.Goods.findOne({
            where:where,
            attributes:['id']
        });
        if(!good) return null;
        return good.id;
    },
    getGoodsFromCache: async function (id) {
        //获取缓存
        let goods;
        try{
            goods = await redisProc.get_goods_id_cache(id);
        }catch(e){
            goods=''
        }
        if (goods&&goods.sitedir) {
            //命中缓存
            // let content;
            // try{
            //     content = await redisProc.get_goods_content_id_cache(id);
            // }catch(e){
            //     content=''
            // }
            // if (content&&content.id) {
            //     // content.content = await zip.unzip(content.content);
            //     // content.content = JSON.parse(content.content);
            //     goods.GoodsContent = content;
            // }else{
            //    await redisProc.set_goods_content_id_cache(id, goods.GoodsContent);
            // }
            return goods;
        } else {
            //更新缓存
            let data = await this.getGoodsFromDB(id);
            if (data) {
               await redisProc.set_goods_id_cache(id, data);
            }
            return data;
        }
    },
    getGoodsFromDB:async function (id) {
        let goods = await models.Goods.findOne({
            where:{
                id:id,
                state:{$notIn:["已下架", "已删除",'待编辑']},
            },
            include: [{
                model: models.GoodsSpec,
                attributes: ['id', 'name', 'sku', 'option1', 'option2', 'price', 'img', 'isdefault','inventory'],
                order:[["name","desc"],["option1","desc"]]
            }, {
                model: models.GoodsContent,
                attributes: ['content']
            },{
                model: models.GoodsCode,
                attributes: ['ggcode', 'tjcode', 'kfcode']
            }, {
                model: models.User,
                attributes: ['fblink','linelink','whatsapplink','chaport_id']
            },{
                model: models.Paypal,
                attributes: ['paycode']
            }, {
                model: models.GoodsPromotion,
                attributes: {exclude: ['created_at', 'updated_at', 'good_id']}
            }]
        });
        if (!goods) return null;
        let name_key_list = [], option1_key_list = [], option2_key_list = [], name_list = [], option1_list = [],
            option2_list = [];
        goods.head_imgs = goods.head_imgs.split(';');
        goods.dataValues.adcode_src=goods.adcode;
        if (goods.adcode) {
            let ids = goods.adcode.split(',');
            goods.adcode = await models.Code.findAll({
                where: {
                    id: ids
                },
                attributes: ['headcode','code']
            });
        }
        goods.dataValues.othercode_src=goods.othercode;
        if (goods.othercode) {
            let ids = goods.othercode.split(',');
            goods.othercode = await models.Code.findAll({
                where: {
                    id: ids
                },
                attributes: ['headcode','code']
            });
        }
        goods.dataValues.body_ads_src=goods.body_ads;
        if (goods.body_ads) {
            let ids = goods.body_ads.split(',');
            goods.body_ads = await models.Goods.findAll({
                where: {
                    id: ids
                },
                attributes: ['id', 'name', 'sitename', 'sitedir', 'head_imgs', 'money', 'price', 'oldprice']
            });
        }
        goods.dataValues.order_ads_src=goods.order_ads;
        if (goods.order_ads) {
            let ids = goods.order_ads.split(',');
            goods.order_ads = await models.Goods.findAll({
                where: {
                    id: ids
                },
                attributes: ['id', 'name', 'sitename', 'sitedir', 'head_imgs', 'money', 'price', 'oldprice']
            });
        }
        if (goods.gifts) {
            let ids = goods.gifts.split(',');
            goods.gifts = await models.Goods.findAll({
                where: {
                    id: ids
                },
                attributes: ['id', 'name', 'sitename', 'sitedir', 'head_imgs', 'money', 'price', 'oldprice']
            });
            let giftSitedirs = [];
            for (var i in goods.gifts) {
                var giftSitedir = goods.gifts[i].sitedir;
                giftSitedirs.push(giftSitedir);
            }
            let giftGoods = await models.Goods.findAll({
                where: {sitedir: giftSitedirs,  state: {$notIn:["已下架", "已删除",'待编辑']}},
                include: [{
                    model: models.GoodsSpec,
                    attributes: ['id', 'name', 'sku', 'option1', 'option2', 'price', 'img', 'isdefault','inventory'],
                    order: [["name", "desc"], ["option1", "desc"]]
                }]
            });
            let giftGoodsSpecsStr=[],giftGoodsSpecs=[],giftGoodsIds=[];
            for (let i in giftGoods) {
                giftGoodsIds.push({name:giftGoods[i].sitename,id:giftGoods[i].id});
                let giftGoodSpecStr = giftGoods[i].GoodsSpecs;
                if (giftGoods[i].GoodsSpecs) {
                    let giftName_key_list=[],giftName_list=[],giftOption1_key_list=[],giftOption1_list=[],giftOption2_key_list=[],giftOption2_list=[];
                    for (let k in giftGoods[i].GoodsSpecs) {
                        let spec = giftGoods[i].GoodsSpecs[k];
                        if (spec.name !== '') {
                            if (giftName_key_list.indexOf(spec.name) < 0) {
                                giftName_key_list.push(spec.name);
                                giftName_list.push(spec);
                            }
                        }
                        if (spec.option1 !== '') {
                            if (giftOption1_key_list.indexOf(spec.option1) < 0) {
                                giftOption1_key_list.push(spec.option1);
                                giftOption1_list.push(spec);
                            }
                        }
                        if (spec.option2 !== '') {
                            if (giftOption2_key_list.indexOf(spec.option2) < 0) {
                                giftOption2_key_list.push(spec.option2);
                                giftOption2_list.push(spec);
                            }
                        }
                    }
                    let giftSpecs = {
                        giftName_key_list: giftName_key_list,
                        giftName_list: giftName_list,
                        giftOption1_key_list: giftOption1_key_list,
                        giftOption1_list: giftOption1_list,
                        giftOption2_key_list: giftOption2_key_list,
                        giftOption2_list: giftOption2_list,
                    };
                    giftGoodsSpecsStr.push(giftGoodSpecStr);
                    giftGoodsSpecs.push(giftSpecs);
                }

            }
            goods.giftGoodsSpecsStr=JSON.stringify(giftGoodsSpecsStr);
            goods.dataValues.giftGoodsSpecsStr=JSON.stringify(giftGoodsSpecsStr);
            goods.giftGoodsSpecs=giftGoodsSpecs;
            goods.dataValues.giftGoodsSpecs=giftGoodsSpecs;
            goods.giftGoods=giftGoods;
            goods.dataValues.giftGoods=giftGoods;
            goods.giftGoodsIds=JSON.stringify(giftGoodsIds);
            goods.dataValues.giftGoodsIds=JSON.stringify(giftGoodsIds);
        }
        goods.GoodsSpecsStr = JSON.stringify(goods.GoodsSpecs);
        goods.dataValues.GoodsSpecsStr = JSON.stringify(goods.GoodsSpecs);
        if (goods.GoodsSpecs) {
            for (let k in goods.GoodsSpecs) {
                let spec = goods.GoodsSpecs[k];
                if (spec.name !== '') {
                    if (name_key_list.indexOf(spec.name) < 0) {
                        name_key_list.push(spec.name);
                        name_list.push(spec);
                    }
                }
                if (spec.option1 !== '') {
                    if (option1_key_list.indexOf(spec.option1) < 0) {
                        option1_key_list.push(spec.option1);
                        spec.father = name_list[name_key_list.indexOf(spec.name)]?name_list[name_key_list.indexOf(spec.name)].id:"";
                        option1_list.push(spec);
                    }
                }
                if (spec.option2 !== '') {
                    if (option2_key_list.indexOf(spec.option2) < 0) {
                        option2_key_list.push(spec.option2);
                        spec.father = option1_list[option1_key_list.indexOf(spec.option1)]?option1_list[option1_key_list.indexOf(spec.option1)].id:"";
                        option2_list.push(spec);
                    }
                }
            }
            goods.specs = {
                name_key_list: name_key_list,
                name_list: name_list,
                option1_key_list: option1_key_list,
                option1_list: option1_list,
                option2_key_list: option2_key_list,
                option2_list: option2_list,
            };
            goods.dataValues.specs = {
                name_key_list: name_key_list,
                name_list: name_list,
                option1_key_list: option1_key_list,
                option1_list: option1_list,
                option2_key_list: option2_key_list,
                option2_list: option2_list,
            }
        }
        goods.manyoff_new = goods.manyoff_new?goods.manyoff_new:'[]';
        goods.dataValues.manyoff_new = goods.manyoff_new?goods.manyoff_new:'[]';
        let d = new Date(goods.countdown);
        goods.countdown=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        //GoodsPromotion表多件总价套餐赠品处理
        for(let promotion of goods.GoodsPromotions){
            if(promotion.promotion_type===3&&promotion.gifts_id){
                let ids = promotion.gifts_id.split(',');
                promotion.dataValues.gifts=[];
                for(let i of ids){
                    if(i){
                        let gift_new = await models.Goods.findOne({
                            include: [{
                                model: models.GoodsSpec,
                                attributes: ['id', 'name', 'sku', 'option1', 'option2', 'price', 'img', 'isdefault', 'inventory'],
                                order: [["id", "asc"]]
                            }],
                            where: {
                                id: i
                            },
                            attributes: ['id', 'name','source','userkey', 'sitename', 'sitedir', 'head_imgs', 'money', 'price', 'oldprice']
                        });
                        promotion.dataValues.gifts.push(gift_new);
                    }}
            }
        }
        return goods;
    },
    checkSkipGoods: async function(goods, domain, realip,time) {
        //将时间戳转化为日期
        if(time){
            //带时间参数不允许跳转
            let date = new Date(parseInt(time));
             date = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() ;
            let new_date = new Date();
            new_date = new_date.getFullYear() + "/" + (new_date.getMonth() + 1) + "/" + new_date.getDate() ;
            if(new_date === date){
                return goods;
            }
        }
        //没开启跳转
        if (goods.skip_switch !== '1'&&goods.skip_switch !== 1) {
            return goods;
        }
        //没跳转商品
        if (!goods.skip_id) {
            return goods;
        }
        //检测跳转
        const ret =await skipGoodsProc.check(goods.money, domain, realip);
        if(ret) return goods;
        //获取跳转商品ID
        const gid = await this.getGoodsIdBySitedir(goods.skip_id);
        if(gid === 0) return null;
        //获取跳转商品
        let detail= await this.getGoodsFromCache(gid);
        detail.redirect_sitedir=detail.sitedir;
        return detail;

    },
};