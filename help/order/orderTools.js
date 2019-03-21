const orderTools = {
    getPromotion: function (goods, amountInfo,orderid) {
        //3-0优先级逐个调用
        let sorts = goods.promotion_sort.split(',');
        let index = sorts.indexOf("3");
        this.runPromotion(index, goods.GoodsPromotions, amountInfo);
        index = sorts.indexOf("2");
        this.runPromotion(index, goods.GoodsPromotions, amountInfo);
        index = sorts.indexOf("1");
        this.runPromotion(index, goods.GoodsPromotions, amountInfo);

        index = sorts.indexOf("0");
        this.runPromotion(index, goods.GoodsPromotions, amountInfo);

        let giftsArr = goods.GoodsPromotions.filter(function (item) {
            return item.id === amountInfo.package_id;
        });
        if(amountInfo.giftinfo){
            for(let i in amountInfo.giftinfo){
                let spec,item;
                for(let k in amountInfo.giftinfo[i]){
                    item = amountInfo.giftinfo[i][k];
                    for(let j in giftsArr[0].gifts){
                        for(let  t in giftsArr[0].gifts[j].GoodsSpecs){
                            let s = giftsArr[0].gifts[j].GoodsSpecs[t];
                            if(s.id+'' === item.sku+''){
                                spec = s;
                                break;
                            }
                        }
                    }
                    if(!spec) {
                        return {Error: true, Info: '赠品信息无效，请重新添加购物车后再次提交'};
                    }
                    amountInfo.goodslist.push({
                        goodsid:  giftsArr[0].gifts[i].id,
                        goodsname: giftsArr[0].gifts[i].name,
                        specname: spec.name,
                        option1: spec.option1,
                        option2: spec.option2,
                        option3: spec.option3,
                        spu: giftsArr[0].gifts[i].userkey,
                        specid: spec.id,
                        sku: spec.sku,
                        price: spec.price,
                        img: item.img,
                        sourceid:giftsArr[0].gifts[i].source,
                        number: item.number,
                        username: giftsArr[0].gifts[i].username,
                        orderid: orderid,
                        gift:1
                    });
                }
            }
        }
    },
    runPromotion: function (index, Promotions, amountInfo) {
        if (index === 3) {
            //单件优惠
            this.singleDiscount(Promotions, amountInfo);
        } else if (index === 2) {
            //合计件数一口价
            this.multipleFixedPrice(Promotions, amountInfo);
        } else if (index === 1) {
            //合计件数满减
            this.totalCountReduction(Promotions, amountInfo);
        } else if (index === 0) {
            //合计价格满减
            this.totalPriceReduction(Promotions, amountInfo);
        }
    },
    totalPriceReduction: function (Promotions, amountInfo) {
        //合计价格满减
        let offprice = 0;
        let lastprice = 0;
        Promotions.map(function (prom) {
            if (prom.promotion_type === 1) {
                if (prom.price1 > lastprice && prom.price1 > 0) {
                    if (amountInfo.orderprice >= prom.price1) {
                        offprice = prom.price2;
                        lastprice = prom.price1;
                    }
                }
            }
        });
        amountInfo.orderprice = amountInfo.orderprice - offprice;
    },
    totalCountReduction: function (Promotions, amountInfo) {
        //合计件数满减
        let offprice = 0;
        let lastcount = 0;
        Promotions.map(function (prom) {
            if (prom.promotion_type === 2) {
                if (prom.count > lastcount && prom.count > 0) {
                    if (amountInfo.allnum >= prom.count) {
                        offprice = prom.price1;
                        lastcount = prom.count;
                    }
                }
            }
        });
        amountInfo.orderprice = amountInfo.orderprice - offprice;
    },
    multipleFixedPrice: function (Promotions, amountInfo) {
        //合计件数一口价
        Promotions.map(function (prom) {
            if (prom.promotion_type === 3) {
                if (amountInfo.allnum === prom.count) {
                    amountInfo.orderprice = prom.price1;
                }
            }
        });
    },
    singleDiscount: function (Promotions, amountInfo) {
        //单件优惠
        let offprice = 0;
        for (let i = 1; i <= amountInfo.allnum; i++) {
            Promotions.map(function (prom) {
                if (prom.promotion_type === 4) {
                    if (prom.count + '' === i + '') {
                        offprice += prom.price1;
                    }
                }
            });
        }
        amountInfo.orderprice = amountInfo.orderprice - offprice;
    },
    getOrderPrice: function (detail_data, cartinfo,orderid) {
        let goodslist = [];
        let allnum = 0;
        let orderprice = 0;
        for (let i in cartinfo) {
            let item = cartinfo[i];
            let spec;
            for (let j in detail_data.GoodsSpecs) {
                let s = detail_data.GoodsSpecs[j];
                if (s.id + '' === item.sku + '') {
                    spec = s;
                    break;
                }
            }
            if (!spec) {
                return {Error: true, Info: '商品信息无效，请重新添加购物车后再次提交'};
            }
            goodslist.push({
                goodsid: detail_data.id,
                goodsname: detail_data.name,
                specname: spec.name,
                option1: spec.option1,
                option2: spec.option2,
                option3: spec.option3,
                spu: detail_data.userkey,
                specid: spec.id,
                sku: spec.sku,
                price: spec.price,
                img: item.img,
                sourceid: detail_data.source,
                number: item.number,
                username: detail_data.username,
                orderid: orderid
            });
            allnum += item.number;
            if (!item.manyoff) {
                orderprice += parseInt(spec.price) * parseInt(item.number);
            }
            return {orderprice, allnum, goodslist};
        }
    }
};
module.exports = orderTools;