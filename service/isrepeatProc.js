const models = require('../models/index');
module.exports = {
    /*重复订单*/
checkRepeatOrder: async function(clientinfo,clientlocation,req,orderid){
    let phone_orders = await models.OrderBasic.findAll({
        where:{
            clientphone: clientinfo.clientphone,
            orderid:{$ne:orderid}
        },
        attribute: ['orderid', 'isrepeat']
    });
    let ip_orders = await models.OrderBasic.findAll({
        where: {
            clientip: req.realip,
            orderid:{$ne:orderid}
        },
        attribute: ['orderid', 'isrepeat','clientip','clientlocation']
    });
    let ip_phone_orders = await models.OrderBasic.findAll({
        where: {
            clientphone: clientinfo.clientphone,
            clientip: req.realip,
            orderid:{$ne:orderid}
        },
        attribute: ['orderid', 'isrepeat','clientip','clientlocation']
    });
    //电话重复的orderidlist
    let phone_order_ids = [];
    for(let o of phone_orders){
        phone_order_ids.push(o.orderid)
    }

    //ip地址重复的orderidlist
    let ip_order_ids = [];
    for(let o of ip_orders){
        ip_order_ids.push(o.orderid)
    }

    //电话ip都重复
    let ip_phone_order_ids = [];
    for(let o of ip_phone_orders){
        ip_phone_order_ids.push(o.orderid)
    }

    let ip_phone_order_repeat = [];
    for(let o of ip_phone_orders){
        ip_phone_order_repeat.push(o.isrepeat)
    }
    let ret = 0;
    if(phone_order_ids.length > 0) {
        this.RepeatUpdate012(3,phone_order_ids);
        this.RepeatUpdate(4,phone_order_ids);
        ret = 3;
    }
    let white;
    if(clientlocation.ip_city===''){
        white = await models.WhiteInfo.count({
            where: {
                ip: req.realip
            }
        });
    }else{
        white = await models.WhiteInfo.count({
            where: {
                $or:[{ip: req.realip},{
                    city:{
                        $like: '%'+clientlocation.ip_city+'%',
                    }
                }],
            }
        });
    }

    if(ip_order_ids.length > 0 ){
        if(white>0){
            //ret = 0;
            if(ret===4){
                ret = 0;
            }else if(ret===5){
                ret = 3;
            }
        }else {
            this.RepeatUpdate012(4, ip_order_ids);
            this.RepeatUpdate(3, ip_order_ids);
            if (ret === 0) ret = 4;
            else if (ret === 3) ret = 5;
        }
    }
    if(ip_phone_order_ids.length >0 ){
        if(white>0){
            ret = 3;
        }else {
            this.RepeatUpdate5(ip_phone_order_ids);
            ret = 5;
        }
    }
    return ret;
},
    RepeatUpdate012:function(num,orderid){
        (async () => {
            await models.OrderBasic.update({
                isrepeat: num
            },{
                field: ['isrepeat'],
                where: {
                    orderid: orderid,
                    isrepeat:[0,1,2]

                }
            });
        })();
    },
    RepeatUpdate:function(num,orderid){
        (async () => {
            await models.OrderBasic.update({
                isrepeat: 5
            }, {
                field: ['isrepeat'],
                where: {
                    orderid: orderid,
                    isrepeat:num
                }
            });
        })();
    },
    RepeatUpdate5:function(orderid){
        (async () => {
            await models.OrderBasic.update({
                isrepeat: 5
            }, {
                field: ['isrepeat'],
                where: {orderid: orderid}
            });

        })();
    },
};