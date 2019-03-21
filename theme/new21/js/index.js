//客服
var show_kflist_timer;
var kf_isshow= false;
function show_kflist() {
    if(kf_isshow) {
        $(".kf_list").hide();
        kf_isshow = false;
        clearTimeout(show_kflist_timer);
    }
    else{
        $('.kf_list').show();
        kf_isshow = true;
        show_kflist_timer = setTimeout(function () {
            $('.kf_list').hide();
        }, 1000*8);
    }
}


//立即购买滚动
function go_buy() {
    document.getElementById("buy").scrollIntoView(true);
}
function check_top(){
    var ele_top = $('.spec_Btns').offset().top;
    var top = (window.innerHeight ? window.innerHeight : $(window).height()) + $(window).scrollTop();
    if(top >= ele_top){
        $('.cart-box-fixed').hide();
    }else{
        $('.cart-box-fixed').show();
    }
}
//tools
var tools = {
    show_msg:function (info, time) {
        if(typeof(layer.tab) === 'function') {
            layer.msg(info);
        }else{
            layer.open({
                content: info,
                skin: 'msg',
                time: time || 2
            });
        }
    },
    show_loading:function (info, time) {
        if(typeof(layer.tab) === 'function') {
            layer.load(2, {time:(time || 15) * 1000});
        }else{
            layer.open({
                type: 2,
                shadeClose: false,
                content: info||'加载中',
                time: time || 15
            });
        }
    },
    show_win:function(content) {
        $(content).show();
    },
    close_win:function(con){
        $(con).hide();
    },
    close_all:function () {
        layer.closeAll();
    }
};
var siteId=appData.sitedir;
var data,index=0,submiting = false;
function indexData(site){
    $.get("/indexData/" + site).success(function (data1) {
        if(data1.Error) {
            tools.show_msg(data1.Info[appData.language]);
            if(index<3){
                indexData(siteId);
                index++;
            }else{
                return false;
            }
        }else{
            data=data1;
            loadData(data);
        }
    })
}
indexData(siteId);
function loadData(data){
    var app=new Vue({
        el: '#app',
        delimiters: ['[[', ']]'],
        data: {
            detail:data.detail,
            cdnbase:data.cdnbase,
            name_list:data.detail.specs.name_list,
            option1_list:data.detail.specs.option1_list,
            option2_list:data.detail.specs.option2_list,
            option1_show:data.detail.specs.option1_list.length,
            option2_show:data.detail.specs.option2_list.length,
            prods:[{
                id: data.detail.id,
                sourceid: data.detail.source,
                userkey: data.detail.userkey,
                name:data.detail.name,
                specname: '',
                sku: '',
                price: 0,
                img: '',
                option1: '',
                option2: '',
                number: 1
            }],
            manyoff_new:JSON.parse(data.detail.manyoff_new),
            manyoff:JSON.parse(data.detail.manyoff),
            saleoff:JSON.parse(data.detail.saleoff),
            count_info:JSON.parse(data.detail.count_info),
            allPrice:0,
            manyoff_price:0,
            saleoff_price:0,
            realPrice:0,
            getProduct:[],
            clientinfo : {
                clientname:"",
                clientphone:"",
                clientaddress:"",
                clientemail:"",
                clientzipcode:"",
                city:"",
                area:"",
                clientotherinfo:"",
            },
            orderid:0,
            order_clientaddress:"",
            order_clientname:"",
            orderprice:0,
            order_clientphone:"",
            commentList:[],
            comment_phone:"",
            comment_body:"",
            cityData:[],
            areaData:[],
            codeData:[],
            expressinfo:"",
            orders:[],
            fblink:data.detail.fblink?data.detail.fblink:data.detail.User.fblink,
            linelink:data.detail.linelink?data.detail.linelink:data.detail.User.linelink,
            whatsapplink:data.detail.whatsapplink?data.detail.whatsapplink:data.detail.User.whatsapplink
        },
        created:function(){
            //评价调用
            this.comments();
            //选择城市
            this.init_Select_City(this.detail.money,null,'city');
        },
        mounted:function(){
            //swiper
            new Swiper ('.swiper-container', {
                autoHeight: true,
                loop: true,
                // 如果需要分页器
                pagination: '.swiper-pagination',
                // 如果需要前进后退按钮
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
            });
            //判断起卖件数
            if(this.manyoff_new.length>0){
                for (var i = 1; i < parseInt(this.manyoff_new[0].salecount); i++) {
                    this.add_spec();
                }
            }
            //默认选中一级规格
            for (var i in this.name_list) {
                var spec = this.name_list[i];
                if (spec.isdefault===1) {
                    this.select_specitem_nocart(spec,1);
                    break;
                }
            }
        },
        methods: {
            // 字符串排序
            by: function(name) {
                return function(o, p) {
                    var a, b;
                    if (typeof o === "object" && typeof p === "object" && o && p) {
                        a = o[name];
                        b = p[name];
                        if (a === b) {
                            return 0;
                        }
                        if (typeof a === typeof b) {
                            return a < b ? -1 : 1;
                        }
                        return typeof a < typeof b ? -1 : 1;
                    } else {
                        throw "error";
                    }
                };
            },
            // 一级去重
            check_spec_repeat(list,num) {
                var arr = [];
                return list.filter(function(i) {
                    if (arr.indexOf(i.name) < 0) {
                        arr.push(i.name);
                        return true;
                    }
                    return false;
                });
            },
            // 二级数组去重并重新排列
            check_option1_repeat(list,num) {
                let templist = [];
                let option1list = [];
                if (this.prods[num-1].specname) {
                    for (var i in list) {
                        if (list[i].name === this.prods[num-1].specname) {
                            if (option1list.indexOf(list[i].option1) < 0) {
                                templist.push(list[i]);
                                option1list.push(list[i].option1);
                            }
                        }
                    }
                    for (var i in list) {
                        if (option1list.indexOf(list[i].option1) < 0) {
                            //查找二级规格是否已经存在
                            templist.push(list[i]);
                            option1list.push(list[i].option1);
                        }
                    }
                } else {
                    for (var i in list) {
                        if (option1list.indexOf(list[i].option1) < 0) {
                            templist.push(list[i]);
                            option1list.push(list[i].option1);
                        }
                    }
                }
                return templist.sort(this.by("option1"));
            },
            // 三级数组去重并重新排列
            check_option2_repeat(list,num) {
                let templist = [];
                let option2list = [];
                if (this.prods[num-1].option1&&this.prods[num-1].specname) {
                    for (let i in list) {
                        if (list[i].name === this.prods[num-1].specname&&list[i].option1 === this.prods[num-1].option1) {
                            if (option2list.indexOf(list[i].option2) < 0) {
                                templist.push(list[i]);
                                option2list.push(list[i].option2);
                            }
                        }
                    }
                    for (var i in list) {
                        if (option2list.indexOf(list[i].option2) < 0) {
                            templist.push(list[i]);
                            option2list.push(list[i].option2);
                        }
                    }
                } else {
                    for (var i in list) {
                        if (option2list.indexOf(list[i].option2) < 0) {
                            templist.push(list[i]);
                            option2list.push(list[i].option2);
                        }
                    }
                }
                return templist.sort(this.by("option2"));
            },
            //一级规格点击事件
            select_specitem_nocart: function (item, num) {
                this.prods[num-1].specname = item.name;
                this.prods[num-1].img = item.img;
                if(this.option1_list.length===0){
                    this.prods[num-1].price = item.price;
                    this.prods[num-1].sku = item.id;
                    this.getProduct[num-1]=item;
                    this.calc_price_nocart();
                }else{
                    var arr=[];
                    for(var i in this.detail.GoodsSpecs){
                        if(this.prods[num-1].specname===this.detail.GoodsSpecs[i].name){
                            arr.push(i);
                        }
                    }
                    if(arr.length===1){
                        this.select_option1_nocart(this.detail.GoodsSpecs[arr[0]],num);
                        arr=null;
                    }
                }

            },
            //二级规格点击事件
            select_option1_nocart: function (item, num) {
                this.prods[num-1].option1 = item.option1;
                if(this.option2_list.length===0){
                    this.prods[num-1].price = item.price;
                    this.prods[num-1].sku = item.id;
                    this.getProduct[num-1]=item;
                    this.calc_price_nocart();
                }else{
                    var arr=[];
                    for(var i in this.detail.GoodsSpecs){
                        if(this.prods[num-1].option1===this.detail.GoodsSpecs[i].option1&&this.prods[num-1].specname===this.detail.GoodsSpecs[i].name){
                            arr.push(i);
                        }
                    }
                    if(arr.length===1){
                        this.select_option2_nocart(this.detail.GoodsSpecs[arr[0]],num);
                        arr=null;
                    }
                }
            },
            //三级规格点击事件
            select_option2_nocart: function (item, num) {
                this.prods[num-1].option2 = item.option2;
                this.prods[num-1].price = item.price;
                this.prods[num-1].sku = item.id;
                this.getProduct[num-1]=item;
                this.calc_price_nocart();
            },
            //初始化规格数组
            add_spec:function(){
                this.prods.push({
                    id: this.detail.id,
                    sourceid: this.detail.sourceid,
                    userkey: this.detail.userkey,
                    name:this.detail.name,
                    specname: '',
                    sku: '',
                    price: 0,
                    img: '',
                    option1: '',
                    option2: '',
                    number: 1
                });
            },
            //删除某一件
	        close_spec:function(){
		        this.prods.splice(this.prods.length - 1, 1);
		        this.getProduct.splice(this.getProduct.length - 1, 1);
		        this.calc_price_nocart();
	        },
            //判断某个商品是否可以删除
            close:function(index){
                if(this.manyoff_new.length>0){
                    if((index+1)>parseInt(this.manyoff_new[0].salecount)){
                        return true;
                    }
                }else{
                    if(index>0){
                        return true;
                    }
                }

            },
            //计算价格
            calc_price_nocart:function(){
                this.allPrice=0;
                this.manyoff_price=0;
                this.saleoff_price=0;
                this.realPrice=0;
                for (var i in this.prods) {
                    var prod = this.prods[i];
                    this.allPrice += prod.price;
                    //多件优惠
                    for (var j in this.manyoff_new) {
                        var item = this.manyoff_new[j];
                        if (item.salecount === parseInt(i) + 1 && prod.price > 0) {
                            this.manyoff_price += item.price;
                        }
                    }

                }
                this.realPrice = this.allPrice - this.manyoff_price;
                //一口价
                for (var i in this.manyoff) {
                    if (this.manyoff[i].salecount === this.prods.length) {
                        if (this.manyoff[i].price > 0) {
                            this.realPrice = this.manyoff[i].price;
                        }
                    }
                }
                //满减优惠
                if (this.saleoff.length > 0) {
                    for (var i in this.saleoff) {
                        var r = this.saleoff[i];
                        if (this.prods.length >= r.salecount) {
                            this.saleoff_price = r.offprice;
                        }
                    }
                }
                this.realPrice = this.realPrice - this.saleoff_price;
            },
            //提交订单
            submit_order_nocart:function () {
                if(submiting) return;
                if(this.prods.length===0) return;
                console.log(this.prods);
                var cartinfo = [];
                for(var i in this.prods){
                    var prod = this.prods[i];
                    if(!prod.id||!prod.sku||!prod.img||prod.price===0){
                        tools.show_msg(selectStr+(parseInt(i)+1));
                        return;
                    }
                    cartinfo.push({
                        id: prod.id,
                        sku: prod.sku,
                        img: prod.img,
                        sitedir: appData.sitedir,
                        number: prod.number
                    });
                }
                // var TW_phone = /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[0-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/;
                var TW_phone=/^(09\d{8})$|^([1-9]{1}[0-8]{1}\d+)$/;
                var HK_phone = /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/;
                // var RM_phone = /^(\+?6?01){1}(([0145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/;
                var RM_phone=  /^([0-9-]+)$/;
                var Email=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                var otherPhone=  /^([0-9-]+)$/;
                if(!this.clientinfo.clientname||this.clientinfo.clientname === ' '){
                    $('#clientname').focus();
                    return tools.show_msg(nameStr);
                }
                if(this.detail.money === 'HK'){
                    if(!this.clientinfo.clientphone||!HK_phone.test(this.clientinfo.clientphone)) {
                        $('#clientphone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }else if(this.detail.money === 'NT'){
                    if(!this.clientinfo.clientphone||!TW_phone.test(this.clientinfo.clientphone)) {
                        $('#clientphone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }else if(this.detail.money === 'RM'){
                    if(!this.clientinfo.clientphone||!RM_phone.test(this.clientinfo.clientphone)) {
                        $('#clientphone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }else{
                    if(!this.clientinfo.clientphone||this.clientinfo.clientphone === ' '||!otherPhone.test(this.clientinfo.clientphone)) {
                        $('#clientphone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }
                this.clientinfo.city=this.clientinfo.city.name;
                this.clientinfo.area=this.clientinfo.area.name;
                if(this.detail.money!=='￥'&&this.detail.money!=='S$'){
                    if(this.clientinfo.city === '城市'||this.clientinfo.city === 'Province'||this.clientinfo.city === 'จังหวัด'||this.clientinfo.city === '区域'||this.clientinfo.city === undefined){
                        $('#city').focus();
                        return tools.show_msg(cityStr);
                    }
                    if(this.clientinfo.area === '区县'||this.clientinfo.area === '區縣'||this.clientinfo.area === 'City'||this.clientinfo.area === 'เมือง'||this.clientinfo.area === '區'||this.clientinfo.area === undefined){
                        $('#area').focus();
                        return tools.show_msg(areaStr);
                    }
                }else{
                    this.clientinfo.city = "";
                    this.clientinfo.area = "";
                }
                let ranges = [
                    '\ud83c[\udf00-\udfff]',
                    '\ud83d[\udc00-\ude4f]',
                    '\ud83d[\ude80-\udeff]'
                ];
                this.clientinfo.clientemail = this.clientinfo.clientemail.replace(new RegExp(ranges.join('|'), 'g'), '');
                this.clientinfo.clientaddress=this.clientinfo.clientaddress.replace(new RegExp(ranges.join('|'), 'g'), '');
                this.clientinfo.clientotherinfo=this.clientinfo.clientotherinfo.replace(new RegExp(ranges.join('|'), 'g'), '');
                if(!this.clientinfo.clientaddress||this.clientinfo.clientaddress === ' ') {
                    $('#clientaddress').focus();
                    return tools.show_msg(addressStr);
                }
                if(this.detail.money === 'S$'||this.detail.money === 'RM'||this.detail.money === '฿'){
                    if(!this.clientinfo.clientzipcode||this.clientinfo.clientzipcode === ' '||!otherPhone.test(this.clientinfo.clientzipcode)) {
                        $('#clientzipcode').focus();
                        return tools.show_msg(postcodeStr);
                    }
                    if(this.detail.money === 'RM'&&this.clientinfo.clientzipcode.length!==5){
                        $('#clientzipcode').focus();
                        return tools.show_msg(postcodeStr);
                    }
                }
                if(this.clientinfo.clientemail&&!Email.test(this.clientinfo.clientemail)){
                    $('#clientemail').focus();
                    return tools.show_msg(emailStr);
                }
                submiting=true;
                tools.show_loading(submitingStr, 30);
                $.ajax({
                    type:"POST",
                    url:'/createorder',
                    contentType:"application/json",
                    data: JSON.stringify({
                        goodsinfo: {sitedir:this.detail.sitedir},
                        cartinfo: cartinfo,
                        clientinfo: this.clientinfo,
                        referrer:document.referrer?document.referrer:'直接进入',
                        siteurl: window.location.href
                    }),
                    error:function (data) {
                        tools.close_all();
                        submiting=false;
                        tools.show_msg(submiterrorStr);
                        $('#submit_btn').attr('disabled',false);
                    },
                    success:function(data){
                        tools.close_all();
                        submiting=false;
                        if(data.Error){
                            tools.show_msg(submiterrorStr);
                        }
                        else{
                            app.$nextTick(function(){
                                if(typeof fbq === "function"){
                                    var currency = 'TWD';
                                    if(this.detail.money === 'RM')
                                        currency = 'MYR';
                                    if(this.detail.money === 'HK')
                                        currency = 'HKD';
                                    else if(this.detail.money === 'S$')
                                        currency = 'SGD';
                                    else if(this.detail.money === '฿')
                                        currency = 'THB';
                                    fbq('track', 'Purchase',{
                                        value: this.realprice,
                                        currency: currency
                                    });
                                }
                                if(typeof run_sale_code === "function"){
                                    run_sale_code();
                                }
                                this.cartinfo = {
                                    clientname: "",
                                    clientphone: "",
                                    clientaddress: "",
                                    clientemail: "",
                                    clientzipcode: "",
                                    city: "",
                                    area: "",
                                    clientotherinfo: "",
                                };
                                this.orderid = data.orderInfo.orderid;
                                this.order_clientname = data.orderInfo.clientname;
                                this.order_clientaddress = data.orderInfo.clientaddress;
                                this.order_clientphone = data.orderInfo.orderphone;
                                this.orderprice = data.orderInfo.orderprice;
                                show_successwin();
                            })
                        }
                    }
                });
            },
            //提交评价
            add_comment:function() {
                var TW_phone = /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[0-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/;
                var HK_phone = /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/;
                var RM_phone= /^([0-9-]+)$/;
                var otherPhone = /^([0-9-]+)$/;
                var a = this.comment_phone,
                    e = this.comment_body;
                if(this.detail.money === 'HK'){
                    if(!a||!HK_phone.test(a)) {
                        $('#comment_phone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }else if(this.detail.money === 'NT'){
                    if(!a||!TW_phone.test(a)) {
                        $('#comment_phone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }else if(this.detail.money === 'RM'){
                    if(!a||!RM_phone.test(a)) {
                        $('#comment_phone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }else{
                    if(!a||a === ' '||!otherPhone.test(a)) {
                        $('#comment_phone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }
                $.post("/comment", {
                    goodsid: this.detail.id,
                    phone: a,
                    body: e,
                    sitedir: this.detail.sitedir,
                    referrer:document.referrer?document.referrer:'直接进入',
                }, function(data) {
                    app.$nextTick(function() {
                        tools.show_msg(data.Info[this.detail.language]);
                        this.comment_phone="";
                        this.comment_body="";
                    })
                })
            },
            //获取评论
            comments:function(){
                $.get("/querycomments/" + this.detail.id).success(function (data) {
                    if(data.Error){
                        app.$nextTick(function() {
                            //tools.show_msg(data.Info[this.detail.language]);
                            this.commentList=""
                        })
                    }else{
                        app.$nextTick(function() {
                            this.commentList = data.comments;
                        })

                    }
                })
            },
            //地址选择
            init_Select_City: function (code, id, ele) {
                if (ele === 'city') {
                    $.getJSON('/api/getSubAddressList?countryCode='+code, function (data) {
                        app.$nextTick(function () {
                            this.cityData = data;
                            this.clientinfo.city = this.cityData[0];
                        })
                    });
                } else {
                    $.getJSON('/api/getSubAddressList?countryCode='+code+'&addressId='+ id.id, function (data) {
                        if (ele === 'area') {
                            app.$nextTick(function () {
                                this.areaData = data;
                                this.clientinfo.area = this.areaData[0];
                            })
                        } else {
                            app.$nextTick(function () {
                                this.codeData = data;
                            })
                        }
                    })
                }
            },
            //查询订单
            find_order:function () {
                var expressinfo = this.expressinfo;
                if(!expressinfo){
                    return tools.show_msg(findStr);
                }
                $('.find-btn').text('wait 10s');
                $('.find-btn').attr('disabled',"true").addClass("disabled");
                var time = 9;
                var id = setInterval(function () {
                    $('.find-btn').text('wait ' + time +'s');
                    time--;
                    if(time === -1){
                        $('.find-btn').removeAttr('disabled').removeClass("disabled");
                        $('.find-btn').text(findbtnStr);
                        clearInterval(id);
                    }
                },1000);
                $.get("/queryorder/" + expressinfo).success(function (data) {
                    tools.close_all();
                    if(data.Error){
                        app.$nextTick(function() {
                            tools.show_msg(data.Info[this.detail.language]);
                        })
                    }else{
                        app.$nextTick(function() {
                            this.orders = data.orders;
                        })
                    }
                });
            },
            //关闭订单信息
            close_orderinfo:function (){
                this.expressinfo="";
                $('.find-btn').removeAttr('disabled').removeClass("disabled");
                this.orders=[];
            },

        }
    });
}

