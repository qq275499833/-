const detailProc = require('./detailProc');
const ipProc = require('../help/comm/ip_tools');
const toolkit = require('../help/comm/toolkit');
const mailProc = require('../help/comm/mail_proc');
const userService = require("./user");
const models = require('../models/index');
const isrepeatProc = require('./isrepeatProc');
const orderTools=require('../help/order/orderTools');
module.exports = {
    //查询订单
    queryorder: async function (str,url) {
        let phone = str;
        let r = /^[0-9]*[1-9][0-9]*$/;
        if(r.test(str)){
            phone = parseInt(str);
        }
        let siteurl=url;
        if(url.indexOf("?")>-1){
           siteurl=url.split("?")[0]
        }
        //针对new11模板
        if(url.indexOf('ordersearch')>-1){
            siteurl=url.replace("ordersearch",'buy');
        }
        let orders = await models.OrderBasic.findAll({
            include:[
                {
                    model: models.OrderGoods
                },
                {
                    model: models.OrderSite,
                    where:{
                        siteurl:{
                            '$like': '%' + siteurl + '%',
                        }
                    }
                }],
            where: {
                $or: [{clientphone: phone},
                    {clientname: str},
                    {orderid: phone}]
            },
            attributes: ['orderid', 'ordertime', 'orderprice', 'orderstate',  'clientname', 'clientphone', 'clientemail', 'clientaddress']
        });
        for(let k in orders){
            let order = orders[k];
            if(order.orderstate==="new")
                order.orderstate='waitconfirm';
            if(order.orderstate==="picking")
                order.orderstate='distribution';
            if(order.orderstate==="sending")
                order.orderstate='delivery';
            if(order.orderstate==="end")
                order.orderstate='Completed';
            if(order.orderstate==="return")
                order.orderstate='refunds';
        }
        return orders;
    },
    //创建订单
    createOrder:async function (req, res) {
        if(req.body.siteurl.indexOf(req.cookies.timestr)>-1){
            req.body.siteurl=req.body.siteurl.replace("?t="+req.cookies.timestr,"");
        }
        if(req.body.referrer.indexOf(req.cookies.timestr)>-1){
            req.body.referrer=req.body.referrer.replace("?t="+req.cookies.timestr,"");
        }
        let goods = req.body.goodsinfo;
        let cartinfo = req.body.cartinfo;
        let clientinfo = req.body.clientinfo;
        let siteurl = req.body.siteurl;
        let referrer = req.body.referrer;
        let giftCartinfo=req.body.giftCartinfo;
        let manyoffArr=req.body.manyoffArr;
        let redirecturl='';
        let redirectflag=0;
        if(goods.redirect_sitedir){
            redirectflag=1;
        }
        let date = new Date();
        let orderid = date.getTime();
        try{
            //console.error('检查下单限制');
            //-----------------------检查下单限制-----------------------
            let countinfo = await this.checkLimit(clientinfo, req);
            if(countinfo.namecount>0||countinfo.phonecount>0||countinfo.ipcount>0){
                console.log('触发下单限制|'+countinfo.namecount +'|'+ countinfo.phonecount  +'|'+ countinfo.ipcount);
                return {Error: true, Info: '您已被限制购买'};
            }
            //----------------------验证商品信息-----------------------
            let detail_data= await detailProc.getGoodsFromSitedir(goods.sitedir,goods.is_domain?JSON.parse(goods.is_domain):0, req.domain, req.realip,req.cookies.timestr);
            if(!detail_data) {
                return {Error: true, Info: '商品信息无效，请重新添加购物车后再次提交'};
            }
            detail_data=detail_data.detail;
            //-----------------------检查电话格式-----------------------
            let telCheck = await this.checkTelRules(req.body.clientinfo,detail_data.money);
            if (!telCheck) return {Error: true, Info: "请填写正确的电话号码"};
            //-----------------------检查黑名单-----------------------
            let clientphoneinfo = await this.checkBlackInfo(clientinfo, req);
            //-----------------------获取用户信息-----------------------
            let user_data = await userService.getUser(detail_data.username);
            if(!user_data){
                user_data = {
                    leadername:''
                };
            }
            //-----------------------准备下单商品数据----------------------
            let orderdata;
            if(req.body.package_id){
                orderdata =await this.getOrderData_new(detail_data, clientinfo,cartinfo,giftCartinfo,manyoffArr,orderid,req.body.package_id);
            }else{
                orderdata =await this.getOrderData(detail_data, clientinfo,cartinfo,giftCartinfo,manyoffArr,orderid);
            }

            if (!orderdata) return {error: true, msg: "您的购买信息无效(4032)，详情请联系客服"};
            //-----------------------组合客户地址-----------------------
            //console.error('组合客户地址');
            let clientaddress = clientinfo.city + ',' + clientinfo.area + ',' + clientinfo.clientaddress;
            if (detail_data.money === 'RM'||detail_data.money === '฿') {
                clientaddress = clientinfo.clientaddress + ',' + clientinfo.area + ',' + clientinfo.city;
            }
            //--------------------------下单-----------------------
            // console.error('下单到数据库');
            let order = await models.OrderBasic.create({
                orderid: orderid,
                ordertime: date.FormatDefault(),
                language: detail_data.language,
                money: detail_data.money,
                orderprice: orderdata.orderprice,
                orderpriceRMB: orderdata.orderpriceRMB,
                orderstate: 'new',
                expressnumber: '',
                expresstime: '',
                expressinfo: '',
                clientip: req.realip,
                clientlocation: '',
                clientreferer: referrer,
                clientname: clientinfo.clientname,
                clientphone: clientinfo.clientphone,
                clientphoneinfo: clientphoneinfo,
                clientzipcode: clientinfo.clientzipcode,
                clientemail: clientinfo.clientemail,
                clientaddress: clientaddress,
                clientdispatchtime: clientinfo.clientdispatchtime,
                clientotherinfo: clientinfo.clientotherinfo,
                /*payment:clientinfo.payment,*/
                username: detail_data.username,
                leadername: user_data.leadername,
                isrepeat: 0,
                state: 1,
                store_delivery:clientinfo.store_delivery
            });
            //添加商品信息到OrderGoods表
            if(!orderdata.goodslist.length){
                return {Error: true, Info: '商品信息无效，请重新添加购物车后再次提交'};
                console.error('下单出错商品',req.body.cartinfo);
            }
            await models.OrderGoods.bulkCreate(orderdata.goodslist);
            //添加网站信息到OrderSites表
            //生成跳转地址
            if(redirectflag){
                let domian_id=detail_data.domain_id;
                let domain=await models.Domain.findOne({
                    where: {
                        id: domian_id
                    },
                    attributes: ['name']
                });
                redirecturl='http://'+domain.name+'/'+goods.sitedir;
            }
            await models.OrderSite.create({
                name:detail_data.sitename,
                money:detail_data.money,
                template:detail_data.template,
                language:detail_data.language,
                siteurl:siteurl,
                username:detail_data.username,
                orderid:orderid,
                redirecturl:redirecturl,
                skip_switch:detail_data.skip_switch,
            });
            //console.error('统计销量');
            await this.report(order, orderdata.goodslist);
            if(user_data.sendmail === '是'){
                //this.sendmail(order, goodslist, user_data);
            }
            //console.error('获取来源信息');
            //----------------------获取来源信息，重复单查询---------------------
            this.getIpInfo(req,orderid,clientinfo);
            //console.error('返回数据');
            req.session.OrderInfo = {
                orderid: orderid,
                goodslist:orderdata.goodslist,
                clientname: clientinfo.clientname,
                clientphone: clientinfo.clientphone,
                clientaddress: clientinfo.clientaddress,
                orderprice: orderdata.orderprice
            };
            return order;
        }catch (error){
            console.error(error);
            toolkit.Catch(null,null,error);
            return { Error:true, Info: ''};
        }
    },
    //检查电话规则
    checkTelRules:async function(clientinfo,money){
        try{
            let rule=await models.TelRules.findOne({
                where:{
                    country:money
                }
            });
            if(rule.enable){
                let phonelength=clientinfo.clientphone.split("").length;
                let start=1;
                if(rule.start_limit){
                    start=clientinfo.clientphone.indexOf(rule.start_limit);
                }
                if(!start){
                    if(phonelength!==rule.start_limit_num){
                        return false;
                    }
                    if(rule.start_limit_rule===1){
                        let phone=/^([0-9]+)$/;
                        if(!phone.test(clientinfo.clientphone)){
                            return false;
                        }
                    }else if(rule.start_limit_rule===2){
                        let phone=/^([0-9-]+)$/;
                        if(!phone.test(clientinfo.clientphone)){
                            return false;
                        }
                    }
                    return true;
                }else{
                    if(phonelength<rule.tel_num_min||phonelength>rule.tel_num_max){
                        return false;
                    }
                    if(rule.tel_rule===1){
                        let phone=/^([0-9]+)$/;
                        if(!phone.test(clientinfo.clientphone)){
                            return false;
                        }
                    }else if(rule.tel_rule===2){
                        let phone=/^([0-9-]+)$/;
                        if(!phone.test(clientinfo.clientphone)){
                            return false;
                        }
                    }
                    return true;
                }
            }

        }catch (error){
            toolkit.Catch(null,null,error);
            return { Error:true, Info: ''};
        }
    },
    compare:function (property){
        return function(a,b){
            let value1 = a[property];
            let value2 = b[property];
            return value1 - value2;
        }
    },
    createOrderPaypal:async function(req,res){
        try{
            let orderid =req.body.orderid;
            let payid = req.body.payid;
            let paymentid = req.body.paymentid;
            let paymenttoken = req.body.paymenttoken;
            let returnurl = req.body.returnurl;
            let orderidP = req.body.orderidP;

            let order = await models.OrderBasic.findOne({
                where: {
                    orderid: orderid
                }
            });
            if(!order) return {Error: true, Info: global.Lang['付款失败']};
            await models.OrderPaypal.create({
                orderid:orderid,
                payid:payid,
                paymentid:paymentid,
                paymenttoken:paymenttoken,
                returnurl:returnurl,
                orderidP:orderidP
            });
            if(order.payment !== '2'){
                order.payment = 2;
            }
            await order.save();
            return {Error: false};
        }catch (error){
            toolkit.Catch(null,null,error);
            return { Error:true, Info: ''};
        }
    },
    sendmail:function(order, goodslist, user){
        (async () => { try {
            if (order.clientemail && user && user.email && user.smtp && user.smtpuser && user.smtppass) {
                let transporter = mailProc.init({
                    service: user.smtp,
                    user: user.smtpuser,
                    pass: user.smtppass
                });
                await mailProc.sendMail(transporter, {
                    from: user.email,
                    to: order.clientemail,
                    subject: "已收到您的訂單【" + order.orderid + "】，歡迎您隨時關注訂單狀態！",
                    html: '<h2>尊敬的' + order.clientname + '您好：</h2>\
                    我們已經收到您的訂單，內容如下：\
                    <br>商品：' + goodslist[0].goodsname + '<br>金額：' + order.orderprice + '<br>我們會儘快爲您發貨。'
                });
            }
        } catch (err) {toolkit.Catch(null,null,err);}})();
    },
    /*限制*/
    checkLimit:async function(clientinfo, req){
        const ipcount = await models.LimitIP.count({
            where: {
                clientip:req.realip
            }
        });
        const phonecount = await models.LimitPhone.count({
            where: {
                clientphone:clientinfo.clientphone
            }
        });
        const namecount = await models.LimitName.count({
            where: {
                clientname:clientinfo.clientname
            }
        });
        return {ipcount:ipcount,phonecount:phonecount,namecount:namecount};
    },
    /*黑名单*/
    checkBlackInfo: async function(clientinfo, req){
        let phone_black=await models.BlackInfo.findOne({
            where:{
                phone:clientinfo.clientphone
            }
        });
        let ip_black=await models.BlackInfo.findOne({
            where:{
                ip:req.realip
            }
        });
        let phone_ip_black=await models.BlackInfo.findOne({
            where: {
                $and: [{phone: clientinfo.clientphone},{ip: req.realip}]
            }
        });
        let ret=0;
        if(phone_black){
            ret=1;
        }
        if(ip_black){
            ret=2;
        }
        if(phone_ip_black){
            ret=3;
        }
        return ret;
    },
    report:async function(order, goodslist) {
        /*---------------商品统计----------------*/
        for(let i in goodslist){
            let goods = goodslist[i];
            let goodsstatus= await models.GoodsStatus.findById(goods.goodsid);
            if(goodsstatus){
                goodsstatus.purchasecount+=1;
                goodsstatus.salesmoney += order.orderpriceRMB;
                goodsstatus.lastsoldtime = new Date();
                await goodsstatus.save();
            }else{
                await models.GoodsStatus.create({
                    id: goods.goodsid,
                    username: order.username,
                    viewcount: 0,
                    purchasecount: 1,
                    salesmoney: order.orderpriceRMB,
                    copycount: 0,
                    returnedcount: 0,
                    returnedmoney: 0,
                    lastsoldtime: new Date()
                },);
            }
        }
    },
    getIpInfo:async function(req,orderid,clientinfo) {
        //-----------------------查询来源---------------------
        let sbinfo ={
            isMobile:req.useragent.isMobile ? '是' : '否',
            os:req.useragent.os,
            browser:req.useragent.browser,
            platform:req.useragent.platform,
            language:req.headers['accept-language'].split(',')[0]
        };
        let realip = toolkit.getRealIp(req);
        let ipinfo = {
            ip_country:'',
            ip_region:'',
            ip_city:'',
            ip_isp:'',
            ip_type:'',
            ip_score:''
        };
        let ip_result=false;
        /*---------------获取ip归属----------------*/
        if(!ip_result){
            try{
                let ipdata = await ipProc.getLocalInfoByJD(realip);
                ipdata = JSON.parse(ipdata.body);
                if (ipdata.code === '10000'||ipdata.code === 10000) {
                    if(ipdata.result.data){
                        if(ipdata.result.data.length>0){
                            ipinfo.ip_country = ipdata.result.data[0].replace(/XX/g,'');
                        }
                        if(ipdata.result.data.length>1){
                            ipinfo.ip_region = ipdata.result.data[1].replace(/XX/g,'');
                        }
                        if(ipdata.result.data.length>2){
                            ipinfo.ip_city = ipdata.result.data[2].replace(/XX/g,'');
                        }
                        if(ipdata.result.data.length>3){
                            ipinfo.ip_isp = ipdata.result.data[3].replace(/XX/g,'');
                        }
                    }

                }
            } catch (ex) {
                toolkit.Catch(null,null,ex);
            }
            // try {
            //     let ipdata = await ipProc.getLocalInfoByTB(realip);
            //     if(ipdata && ipdata.body){
            //         ipdata = JSON.parse(ipdata.body);
            //         if (ipdata.code === '0'||ipdata.code === 0) {
            //             ipinfo.ip_country = ipdata.data.country.replace(/XX/g,'');
            //             ipinfo.ip_region = ipdata.data.region.replace(/XX/g,'');
            //             ipinfo.ip_city = ipdata.data.city.replace(/XX/g,'');
            //             ipinfo.ip_isp = ipdata.data.isp.replace(/XX/g,'');
            //             ip_result = true;
            //         }
            //     }
            // } catch (ex) {
            //     toolkit.Catch(null,null,ex);
            // }
        }
        try {
            //console.error('获取ip真人度');
            /*---------------获取ip真人度----------------*/
            let ipreal = await ipProc.getReal(realip);
            ipreal = JSON.parse(ipreal.body);
            if (ipreal.code === "10000") {
                ipinfo.ip_score = ipreal.result.data ? ipreal.result.data.score : 0;
            }
        } catch (ex) {
            toolkit.Catch(null,null,ex);
        }
        try {
            //console.error('获取ip类型');
            /*---------------获取ip类型----------------*/
            let iptype1 = await ipProc.getType(realip);
            iptype1 = JSON.parse(iptype1.body);
            if (iptype1.code === "10000") {
                ipinfo.ip_type = iptype1.result.data ? iptype1.result.data.type : '';
                if (ipinfo.ip_type === "1") ipinfo.ip_type = "数据中心";
                if (ipinfo.ip_type === "2") ipinfo.ip_type = "专用出口";
                if (ipinfo.ip_type === "3") ipinfo.ip_type = "普通宽带";
                if (ipinfo.ip_type === "4") ipinfo.ip_type = "2G/3G/4G";
                if (ipinfo.ip_type === "5") ipinfo.ip_type = "骨干节点";
            }
        } catch (ex){
            toolkit.Catch(null,null,ex);
        }
        let clientlocation={ Info:"国家："+ipinfo.ip_country + ipinfo.ip_region + ipinfo.ip_city +";运营商：" + ipinfo.ip_isp+
            ";类型：" + ipinfo.ip_type +";真人度：" + ipinfo.ip_score +";移动端：" + sbinfo.isMobile +
            ";平台：" + sbinfo.platform +";操作系统：" + sbinfo.os +";浏览器：" + sbinfo.browser +";语言：" + sbinfo.language,
            ip_city: ipinfo.ip_city
        };
        //----------------------查询重复订单---------------------
        //console.error('查询重复订单');
        //let isrepeat = await this.checkRepeatOrder(clientinfo,clientlocation, req,orderid);
        let isrepeat = await isrepeatProc.checkRepeatOrder(clientinfo,clientlocation, req,orderid);
        await models.OrderBasic.update({
            clientlocation: clientlocation.Info,
            isrepeat:isrepeat
        }, {
            field: ['clientlocation','isrepeat'],
            where: {orderid: orderid}
        });

    },
    getOrderData:async function(detail_data,clientinfo,cartinfo,giftCartinfo,manyoffArr,orderid){
        if(detail_data.manyoff_new) {
            detail_data.manyoff_new = JSON.parse(detail_data.manyoff_new);
        }
        if(detail_data.manyoff) {
            detail_data.manyoff = JSON.parse(detail_data.manyoff);
        }
        let goodslist=[];
        let allnum = 0;
        let orderprice=0;
        for(let i in cartinfo){
            let item = cartinfo[i];
            let spec;
            for(let j in detail_data.GoodsSpecs){
                let s = detail_data.GoodsSpecs[j];
                if(s.id+'' === item.sku+''){
                    spec = s;
                    break;
                }
            }
            if(!spec) {
                return {Error: true, Info: '商品信息无效，请重新添加购物车后再次提交'};
            }
            goodslist.push({
                goodsid:  detail_data.id,
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
            allnum+=item.number;
            if(!item.manyoff){
                orderprice+=parseInt(spec.price)*parseInt(item.number);
            }
        }
        //赠品规格信息
        if(giftCartinfo){
            for(let i in giftCartinfo){
                let spec,item;
                for(let k in giftCartinfo[i]){
                    item = giftCartinfo[i][k];
                    for(let j in detail_data.giftGoods){
                        for(let  t in detail_data.giftGoods[j].GoodsSpecs){
                            let s = detail_data.giftGoods[j].GoodsSpecs[t];
                            // console.log(s.id);
                            // console.log(item.sku);
                            if(s.id+'' === item.sku+''){
                                spec = s;
                                break;
                            }
                        }
                    }
                    if(!spec) {
                        return {Error: true, Info: '赠品信息无效，请重新添加购物车后再次提交'};
                    }
                    goodslist.push({
                        goodsid:  detail_data.giftGoods[i].id,
                        goodsname: detail_data.giftGoods[i].name,
                        specname: spec.name,
                        option1: spec.option1,
                        option2: spec.option2,
                        option3: spec.option3,
                        spu: detail_data.giftGoods[i].userkey,
                        specid: spec.id,
                        sku: spec.sku,
                        price: spec.price,
                        img: item.img,
                        sourceid: detail_data.giftGoods[i].source,
                        number: item.number,
                        username: detail_data.giftGoods[i].username,
                        orderid: orderid,
                        gift:1
                    });
                }
            }
        }
        if(manyoffArr&&manyoffArr.length){
            for(let j in manyoffArr){
                let salecount=manyoffArr[j].salecount;
                for(let i in detail_data.manyoff){
                    if(detail_data.manyoff[i].salecount===salecount){
                        if(detail_data.manyoff[i].price>0){
                            orderprice+= detail_data.manyoff[i].price;
                        }
                    }
                }
            }
        }else {
            let offprice = 0;
            for(let j in detail_data.manyoff_new){
                let item = detail_data.manyoff_new[j];
                for(let k=1;k<=allnum;k++){
                    if(item.salecount === parseInt(k)){
                        offprice += item.price;
                    }
                }
            }
            orderprice=orderprice-parseInt(offprice);
            for (let i in detail_data.manyoff) {
                if (detail_data.manyoff[i].salecount === allnum) {
                    if (detail_data.manyoff[i].price > 0) {
                        orderprice = detail_data.manyoff[i].price;
                        break;
                    }
                }
            }
            let saleoff_price = 0;
            if (detail_data.saleoff) {
                detail_data.saleoff = JSON.parse(detail_data.saleoff);
                for (let j in detail_data.saleoff) {
                    let item = detail_data.saleoff[j];
                    if (allnum >= item.salecount) {
                        saleoff_price = item.offprice;
                    }
                }
                orderprice = orderprice - saleoff_price;
            }
            if (detail_data.priceoff && JSON.parse(detail_data.priceoff).length) {
                detail_data.priceoff = JSON.parse(detail_data.priceoff);
                detail_data.priceoff = detail_data.priceoff.sort(this.compare('totalmoney'));
                let index1 = -2;
                for (let i = 0; i < detail_data.priceoff.length; i++) {
                    if (detail_data.priceoff[i].totalmoney > orderprice) {
                        index1 = i - 1;
                        break;
                    }
                }
                if (index1 >= 0) {
                    orderprice = orderprice - detail_data.priceoff[index1].saleprice;
                } else if (index1 === -2) {
                    orderprice = orderprice - detail_data.priceoff[detail_data.priceoff.length - 1].saleprice;
                }
            }
        }
        if(clientinfo.remoteMoney){
            orderprice = orderprice+parseInt(clientinfo.remoteMoney);
        }
        let orderpriceRMB =await this.getOrderPriceRate(detail_data.money,  orderprice);
        return {goodslist,orderprice,orderpriceRMB};
    },
    getOrderPriceRate:async function(money,orderprice){
        let orderpriceRMB=0;
        let HLConfig=await global.HLConfig();
        if (HLConfig[money]) {
            orderpriceRMB = (orderprice/ HLConfig[money]);
        }
        if(orderpriceRMB===0&&money === '฿'){
            orderpriceRMB = (orderprice / HLConfig['TH']);
        }
        if(orderpriceRMB===0&&money === 'S$'){
            orderpriceRMB = (orderprice/ HLConfig['SS']);
        }
        if(orderpriceRMB===0&&money === '円'){
            orderpriceRMB = (orderprice / HLConfig['JPN']);
        }
        return orderpriceRMB;
    },
    getOrderData_new:async function(detail_data,clientinfo,cartinfo,giftCartinfo,manyoffArr,orderid,package_id){
        let goodslist=[];
        //计算合计价格
        let amountInfo = orderTools.getOrderPrice(detail_data,cartinfo,orderid);//返回商品总价，数量，商品合并orderprice, allnum, goodslist
        if (amountInfo.allnum === 0 || amountInfo.orderprice === 0) {
            console.error("amountInfo获取失败");
            return null;
        }
        amountInfo.giftinfo=giftCartinfo;
        amountInfo.package_id=package_id;
        //计算促销策略后的总价,赠品列表
        orderTools.getPromotion(detail_data, amountInfo,orderid);
        //计算人民币价格
        let orderprice = amountInfo.orderprice;
        if(clientinfo.remoteMoney){
            orderprice = orderprice+parseInt(clientinfo.remoteMoney);
        }
        let orderpriceRMB =await this.getOrderPriceRate(detail_data.money,orderprice);
        //整理商品和赠品信息
        goodslist=amountInfo.goodslist;
        return {goodslist,orderprice,orderpriceRMB};
    }
};