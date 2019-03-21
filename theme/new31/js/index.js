//客服
var show_kflist_timer;
var kf_isshow = false;

function show_kflist() {
    if (kf_isshow) {
        $(".kf_list").hide();
        kf_isshow = false;
        clearTimeout(show_kflist_timer);
    }
    else {
        $('.kf_list').show();
        kf_isshow = true;
        show_kflist_timer = setTimeout(function () {
            $('.kf_list').hide();
        }, 1000 * 8);
    }
}
localStorage.setItem('url',window.location.href);

//立即购买滚动
function go_buy() {
    document.getElementById("buy").scrollIntoView(true);
}

function check_top() {
    var ele_top = $('.spec_Btns').offset().top;
    var top = (window.innerHeight ? window.innerHeight : $(window).height()) + $(window).scrollTop();
    if (top >= ele_top) {
        $('.cart-box-fixed').hide();
    } else {
        $('.cart-box-fixed').show();
    }
}

//tools
var tools = {
    show_msg: function (info, time) {
        if (typeof(layer.tab) === 'function') {
            layer.msg(info);
        } else {
            layer.open({
                content: info,
                skin: 'msg',
                time: time || 2
            });
        }
    },
    show_loading: function (info, time) {
        if (typeof(layer.tab) === 'function') {
            layer.load(2, {time: (time || 15) * 1000});
        } else {
            layer.open({
                type: 2,
                shadeClose: false,
                content: info || '加载中',
                time: time || 15
            });
        }
    },
    show_win: function (content) {
        $(content).show();
    },
    close_win: function (con) {
        $(con).hide();
    },
    close_all: function () {
        layer.closeAll();
    }
};
var siteId = appData.sitedir;
var data, index = 0, submiting = false;
function indexData(site) {
    $.get("/indexData/" + site).success(function (data1) {
        if (data1.Error) {
            tools.show_msg(data1.Info[appData.language]);
            if (index < 3) {
                indexData(siteId);
                index++;
            } else {
                return false;
            }
        } else {
            data = data1;
            loadData(data);
        }
    })
}

indexData(siteId);
//购买信息滚动
$.get("/getpurchaseinfo/" +appData.language).success(function(data){
    setTimeout(function() {
        $('#marqueeContainer').empty();
        var li="";
        for(var i in data){
            li+='<li><div><span style="color: #0C3;font-weight: bolder">['+new_buy+']&nbsp;&nbsp;&nbsp;</span><span>'+data[i].info+'</span><i style="background:url(/theme/new31/images/dui.png)no-repeat;width: 20px;display: inline-block;height: 20px;background-size: 20px;vertical-align: middle;"></i></div></li>'
        }
        $("#marqueeContainer").prepend(li);
        setInterval(function(){doscroll()}, 2000);
    }, 0);
});
var doscroll = function(){
    var parent = $('#marqueeContainer');
    var first = parent.find('li:last');
    var height = parseInt(first.height())+3.3;
    first.animate({
        marginBottom: -height + 'px',
    }, 1000, function() {
        first.css('marginBottom', 0).prependTo(parent);
    });
};
function loadData(data) {
    var app = new Vue({
        el: '#app',
        delimiters: ['[[', ']]'],
        data: {
            mark:1,
            check:1,//0
            extrapay:'',
            flag2:3,
            flag1:1,
            //倒计时
            t:0,
            d:0,
            h:0,
            m:0,
            s:0,
            //折扣承接
            // dis:'',
            discount_num:'',
            apiserver:data.apiserver,
            value:'',
            upDateTime:'',
            mn1:true,
            apiserver:data.apiserver,
            detail: data.detail,
            cdnbase: data.cdnbase,
            name_list: data.detail.specs.name_list,
            option1_list: data.detail.specs.option1_list,
            option2_list: data.detail.specs.option2_list,
            option1_show: data.detail.specs.option1_list.length,
            option2_show: data.detail.specs.option2_list.length,
            prods: [{
                id: data.detail.id,
                sourceid: data.detail.source,
                userkey: data.detail.userkey,
                name: data.detail.name,
                specname: '',
                sku: '',
                price: 0,
                img: '',
                option1: '',
                option2: '',
                number: 1
            }],
            manyoff_new: JSON.parse(data.detail.manyoff_new),
            manyoff: JSON.parse(data.detail.manyoff),
            saleoff: JSON.parse(data.detail.saleoff),
            count_info: JSON.parse(data.detail.count_info),
            allPrice: 0,
            manyoff_price: 0,
            saleoff_price: 0,
            realPrice: 0,
            getProduct: [],
            lj_img:[],
            clientinfo: {
                clientname: "",
                clientphone: "",
                clientaddress: "",
                clientemail: "",
                clientzipcode: "",
                city: "",
                area: "",
                clientotherinfo: "",
            },
            orderid: 0,
            order_clientaddress: "",
            order_clientname: "",
            orderprice: 0,
            order_clientphone: "",
            commentList: [],
            comment_phone: "",
            comment_body: "",
            cityData: [],
            areaData: [],
            codeData: [],
            expressinfo: "",
            orders: [],
            fblink: data.detail.fblink ? data.detail.fblink : data.detail.User.fblink,
            linelink: data.detail.linelink ? data.detail.linelink : data.detail.User.linelink,
            whatsapplink: data.detail.whatsapplink ? data.detail.whatsapplink : data.detail.User.whatsapplink,
            pj1:0,
            pj2:0,
            item:JSON.parse(data.detail.manyoff)[0].salecount,
            package_price:JSON.parse(data.detail.manyoff)[0].price,
            flag:0,
            area:{},
            city:{},
            giftLength:0,
            giftSelect:[],

        },
        created: function () {
            setInterval(this.GetRTime,1000);
            //倒计时
            if(this.d ==0 && this.h==0 && this.m==0 && this.s ==0){
                clearInterval(this.GetRTime);
            }
            //评价调用
            this.comments();
            // //折扣
            this.discount();
            //评价调用
            this.comments(this.detail.id,1);
            //选择城市
            this.init_Select_City(this.detail.money, null, 'city');
        },
        mounted: function () {
            //swiper
            new Swiper('.swiper-container', {
                autoHeight: true,
                loop: true,
                // 如果需要分页器
                pagination: '.swiper-pagination',
                // 如果需要前进后退按钮
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
            });
            //判断起卖件数
            if (this.manyoff_new.length > 0) {
                for (var i = 1; i < parseInt(this.manyoff_new[0].salecount); i++) {
                    this.add_spec();
                }
            }
            //默认选中一级规格
            for (var i in this.name_list) {
                var spec = this.name_list[i];
                if (spec.isdefault === 1) {
                    this.select_specitem_nocart(spec, 1);
                    break;
                }
            }
            //判断manyoff起卖件数
            if(this.manyoff.length>0){
                if(this.item>this.prods.length){
                    for(var i=1;i<this.item;i++){
                        this.add_spec();
                    }
                }
            }
        },
        methods: {
            //折扣方法，保留一位小数
            //百分比写法： <!--[[parseInt((1-(detail.price/detail.oldprice))*100)]]%-->
            discount: function () {
                this.value=(this.detail.price/this.detail.oldprice)*10;
                this.discount_num=this.value.toString().slice(0,3);
                this.discount_num=Number(this.discount_num);
            },
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
                        if (typeof
                            a === typeof b) {
                            return a < b ? -1 : 1;
                        }
                        return typeof a < typeof b ? -1 : 1;
                    } else {
                        throw "error";
                    }
                };
            },
            // 二级数组去重并重新排列
            check_option1_repeat(list,num) {
                var templist1=[];
                var option1list = [];
                if (this.prods[num-1].specname) {
                    for (var i in list) {
                        if (list[i].name === this.prods[num-1].specname) {
                            if (option1list.indexOf(list[i].option1) < 0) {
                                templist1.push(list[i]);
                                option1list.push(list[i].option1);
                            }
                        }
                    }
                    for (var i in list) {
                        if (option1list.indexOf(list[i].option1) < 0) {
                            //查找二级规格是否已经存在
                            templist1.push(list[i]);
                            option1list.push(list[i].option1);
                        }
                    }
                } else {
                    for (var i in list) {
                        if (option1list.indexOf(list[i].option1) < 0) {
                            templist1.push(list[i]);
                            option1list.push(list[i].option1);
                        }
                    }
                }
                return templist1;

            },

            // 三级数组去重并重新排列
            check_option2_repeat(list,num) {
                var templist2=[];
                var option2list = [];
                if (this.prods[num-1].option1&&this.prods[num-1].specname) {
                    for (var i in list) {
                        if (list[i].name === this.prods[num-1].specname&&list[i].option1 === this.prods[num-1].option1) {
                            if (option2list.indexOf(list[i].option2) < 0) {
                                templist2.push(list[i]);
                                option2list.push(list[i].option2);
                            }
                        }
                    }
                    for (var i in list) {
                        if (option2list.indexOf(list[i].option2) < 0) {
                            templist2.push(list[i]);
                            option2list.push(list[i].option2);
                        }
                    }
                } else {
                    for (var i in list) {
                        if (option2list.indexOf(list[i].option2) < 0) {
                            templist2.push(list[i]);
                            option2list.push(list[i].option2);
                        }
                    }
                }
                return templist2;
            },
            //一级规格点击事件
            select_specitem_nocart: function (item, num) {
                this.prods[num-1].specname = item.name;
                this.prods[num-1].img = item.img;
                this.prods[num-1].option1="";
                this.prods[num-1].option2="";
                this.prods[num-1].price = "";
                this.prods[num-1].sku = "";
                if(this.option1_list.length===0){
                    this.prods[num-1].price = item.price;
                    this.prods[num-1].sku = item.id;
                    this.getProduct[num-1]=item;
                    this.calc_price_nocart();
                }else{
                    var arr=[],option1_list=[];
                    item.templist1=this.check_option1_repeat(this.detail.GoodsSpecs,num);
                    for(var i in this.detail.GoodsSpecs){
                        if(this.prods[num-1].specname===this.detail.GoodsSpecs[i].name){
                            if (option1_list.indexOf(this.detail.GoodsSpecs[i].option1) < 0) {
                                arr.push(i);
                                option1_list.push(this.detail.GoodsSpecs[i].option1);
                            }
                        }
                    }
                    if(arr.length===1){
                        this.select_option1_nocart(this.detail.GoodsSpecs[arr[0]],num);
                        arr=null;
                    }
                }
            },
            //二级规格选中和禁止选中
            check_option1_disbale:function(item,num){
                item.templist1=this.check_option1_repeat(this.detail.GoodsSpecs,num+1);
                if(item.templist1){
                    for(var i in item.templist1){
                        if(item.templist1[i].name===this.prods[num].specname&&item.templist1[i].option1===item.option1){
                            return false;
                        }
                    }
                    return true;
                }


            },
            check_option1_active:function(item,index1){
                item.templist1=this.check_option1_repeat(this.detail.GoodsSpecs,index1+1);
                if(item.templist1){
                    for(var i in item.templist1) {
                        if(this.prods[index1].option1 === item.option1 && this.prods[index1].specname === item.templist1[i].name){
                            return true;
                        }
                    }
                }


            },
            //二级规格点击事件
            select_option1_nocart: function (item, num) {
                this.prods[num-1].option1 = item.option1;
                this.prods[num-1].option2="";
                this.prods[num-1].price = "";
                this.prods[num-1].sku = "";
                if(this.option2_list.length===0){
                    for(var i in item.templist1){
                        if(item.templist1[i].name===this.prods[num-1].specname && item.templist1[i].option1===this.prods[num-1].option1){
                            this.prods[num-1].price = item.templist1[i].price;
                            this.prods[num-1].sku = item.templist1[i].id;
                            this.getProduct[num-1]=item.templist1[i];
                            this.calc_price_nocart();
                        }
                    }
                }else{
                    var arr=[],option2_list=[];
                    item.templist2 = this.check_option2_repeat(this.detail.GoodsSpecs,num);
                    for(var i in this.detail.GoodsSpecs){
                        if(this.prods[num-1].option1===this.detail.GoodsSpecs[i].option1&&this.prods[num-1].specname===this.detail.GoodsSpecs[i].name){
                            if (option2_list.indexOf(this.detail.GoodsSpecs[i].option2) < 0) {
                                arr.push(i);
                                option2_list.push(this.detail.GoodsSpecs[i].option2);
                            }
                        }
                    }
                    if(arr.length===1){
                        this.select_option2_nocart(this.detail.GoodsSpecs[arr[0]],num);
                        arr=null;
                    }
                }
            },
            //三级规格选中和禁止选中
            check_option2_disbale:function(item,num){
                item.templist2 = this.check_option2_repeat(this.detail.GoodsSpecs,num+1);
                if(item.templist2){
                    for(var i in item.templist2){
                        if(item.templist2[i].name===this.prods[num].specname&&item.templist2[i].option1===this.prods[num].option1&&item.templist2[i].option2===item.option2){
                            return false;
                        }
                    }
                    return true;
                }

            },
            check_option2_active:function(item,index1){
                item.templist2 = this.check_option2_repeat(this.detail.GoodsSpecs,index1+1);
                if(item.templist2){
                    for(var i in item.templist2) {
                        if(this.prods[index1].option2 === item.option2 &&item.templist2[i].option1===this.prods[index1].option1&& this.prods[index1].specname === item.templist2[i].name){
                            return true;
                        }
                    }
                }

            },
            //三级规格点击事件
            select_option2_nocart: function (item, num) {
                this.prods[num-1].option2 = item.option2;
                this.prods[num-1].price = "";
                this.prods[num-1].sku = "";
                for(var i in item.templist2){
                    if(item.templist2[i].name===this.prods[num-1].specname && item.templist2[i].option1===this.prods[num-1].option1 && item.templist2[i].option2===this.prods[num-1].option2){
                        this.prods[num-1].price = item.templist2[i].price;
                        this.prods[num-1].sku = item.templist2[i].id;
                        this.getProduct[num-1]=item.templist2[i];
                        this.calc_price_nocart();
                    }
                }
            },
            //当没有二级规格时判断缺货
            stockout1:function(item,num){
                item.templist1 = this.check_option1_repeat(this.detail.GoodsSpecs,num);
                for(var i in this.detail.GoodsSpecs){
                    var spec=this.detail.GoodsSpecs[i];
                    if(this.prods[num-1].specname===spec.name){
                        for(var j in item.templist1){
                            if(item.templist1[j].option1===spec.option1&&item.templist1[j].option1===item.option1){
                                if(this.option2_show===0){
                                    if(spec.inventory===0){
                                        return true;
                                    }else{
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            //当有二级规格时判断缺货
            stockout2:function(item,num){
                item.templist2 = this.check_option2_repeat(this.detail.GoodsSpecs,num);
                for(var i in this.detail.GoodsSpecs) {
                    var spec = this.detail.GoodsSpecs[i];
                    if (this.prods[num - 1].specname === spec.name&&this.prods[num - 1].option1 === spec.option1) {
                        for (var j in item.templist2) {
                            if (item.templist2[j].option2 === spec.option2 && item.templist2[j].option2 === item.option2) {
                                if (spec.inventory === 0) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    }
                }
            },

            //初始化规格数组
            add_spec: function () {
                this.prods.push({
                    id: this.detail.id,
                    sourceid: this.detail.sourceid,
                    userkey: this.detail.userkey,
                    name: this.detail.name,
                    specname: '',
                    sku: '',
                    price: 0,
                    img: '',
                    option1: '',
                    option2: '',
                    number: 1
                });
                //默认选中一级规格
                var length=this.prods.length;
                for (var i in this.name_list) {
                    var spec = this.name_list[i];
                    if (spec.isdefault===1) {
                        this.select_specitem_nocart(spec,length);
                        break;
                    }
                }
            },
            //删除某一件
            close_spec: function () {
                this.prods.splice(this.prods.length - 1, 1);
                this.getProduct.splice(this.getProduct.length - 1, 1);
                this.calc_price_nocart();
            },
            //判断某个商品是否可以删除
            close: function (index) {
                if (this.manyoff_new.length > 0) {
                    if ((index + 1) > parseInt(this.manyoff_new[0].salecount)) {
                        return true;
                    }
                } else {
                    if (index > 0) {
                        return true;
                    }
                }
            },
            //计算价格
            calc_price_nocart: function () {
                this.allPrice = 0;
                this.manyoff_price = 0;
                this.saleoff_price = 0;
                this.realPrice = 0;
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
            submit_order_nocart: function () {
                // return;
                if (submiting) return;
                if (this.prods.length === 0) return;
                var cartinfo = [];
                for (var i in this.prods) {
                    var prod = this.prods[i];
                    if (!prod.id || !prod.sku || !prod.img || prod.price === 0) {
                        tools.show_msg(selectStr + (parseInt(i) + 1));
                        return;
                    }
                    //判断是否缺货
                    for(var j in this.detail.GoodsSpecs){
                        var spec=this.detail.GoodsSpecs[j];
                        if(prod.sku===spec.id){
                            if(spec.inventory===0){
                                tools.show_msg(selectOos+(parseInt(i)+1)+selectOos1);
                                return;
                            }
                        }
                    }
                    cartinfo.push({
                        id: prod.id,
                        sku: prod.sku,
                        img: prod.img,
                        sitedir: appData.sitedir,
                        number: prod.number
                    });
                }
                var name=/^\s*$/;
                var otherPhone = /^([0-9]+)$/;
                if(!this.clientinfo.clientname||name.test(this.clientinfo.clientname)){
                    $('#clientname').focus();
                    return tools.show_msg(nameStr);
                }
                if (!this.clientinfo.clientphone || this.clientinfo.clientphone === ' ') {
                    $('#clientphone').focus();
                    return tools.show_msg(PhoneStr);
                }
                if(this.detail.money!=='円'){
                    this.clientinfo.city=this.city?this.city.name:"";
                    this.clientinfo.area=this.area?this.area.name:"";
                }
                this.clientinfo.remoteMoney = this.extrapay?this.extrapay:0;

                if (this.detail.money !== '￥' && this.detail.money !== 'S$') {
                    if (this.clientinfo.city === '城市' || this.clientinfo.city === 'Province' || this.clientinfo.city === 'จังหวัด' || this.clientinfo.city === '区域' || this.clientinfo.city === undefined || this.clientinfo.city === ""||this.clientinfo.city ==='都道府県を選択') {
                        $('#city').focus();
                        return tools.show_msg(cityStr);
                    }
                    if (this.clientinfo.area === '区县' || this.clientinfo.area === '區縣' || this.clientinfo.area === 'City' || this.clientinfo.area === 'เมือง' || this.clientinfo.area === '區' || this.clientinfo.area === undefined ||this.clientinfo.area === "") {
                        $('#area').focus();
                        return tools.show_msg(areaStr);
                    }
                } else {
                    this.clientinfo.city = "";
                    this.clientinfo.area = "";
                }
                let ranges = [
                    '\ud83c[\udf00-\udfff]',
                    '\ud83d[\udc00-\ude4f]',
                    '\ud83d[\ude80-\udeff]'
                ];
                this.clientinfo.clientemail =this.clientinfo.clientemail.replace(new RegExp(ranges.join('|'), 'g'), '');
                this.clientinfo.clientaddress=this.clientinfo.clientaddress.replace(new RegExp(ranges.join('|'), 'g'), '');
                this.clientinfo.clientotherinfo=this.clientinfo.clientotherinfo.replace(new RegExp(ranges.join('|'), 'g'), '');
                if (!this.clientinfo.clientaddress || this.clientinfo.clientaddress === ' ') {
                    $('#clientaddress').focus();
                    return tools.show_msg(addressStr);
                }
                if (this.detail.money === 'S$' || this.detail.money === 'RM' || this.detail.money === '฿') {
                    if (!this.clientinfo.clientzipcode || this.clientinfo.clientzipcode === ' ' || !otherPhone.test(this.clientinfo.clientzipcode)) {
                        $('#clientzipcode').focus();
                        return tools.show_msg(postcodeStr);
                    }
                    if (this.detail.money === 'RM' && this.clientinfo.clientzipcode.length !== 5) {
                        $('#clientzipcode').focus();
                        return tools.show_msg(postcodeStr);
                    }
                }
                submiting = true;
                tools.show_loading(submitingStr, 30);
                $.ajax({
                    type: "POST",
                    url: '/createorder',
                    contentType: "application/json",
                    data: JSON.stringify({
                        goodsinfo: {sitedir:appData.sitedir,redirect_sitedir:appData.redirect_sitedir,is_domain:appData.is_domain},
                        cartinfo: cartinfo,
                        clientinfo: this.clientinfo,
                        referrer: document.referrer ? document.referrer : '直接进入',
                        siteurl: window.location.href
                    }),
                    error: function (data) {
                        tools.close_all();
                        submiting = false;
                        tools.show_msg(submiterrorStr);
                        $('#submit_btn').attr('disabled', false);
                    },
                    success: function (data) {
                        tools.close_all();
                        submiting = false;
                        if (data.Error) {
                            tools.show_msg(submiterrorStr);
                        }
                        else {
                            app.$nextTick(function () {
                                var realPrice=this.realPrice;
                                if (typeof fbq === "function") {
                                    var currency = 'TWD';
                                    if (this.detail.money === 'RM')
                                        currency = 'MYR';
                                    if (this.detail.money === 'HK')
                                        currency = 'HKD';
                                    else if (this.detail.money === 'S$')
                                        currency = 'SGD';
                                    else if (this.detail.money === '฿')
                                        currency = 'THB';
                                    fbq('track', 'Purchase', {
                                        value: realPrice,
                                        currency: currency
                                    });
                                }
                                if (typeof run_sale_code === "function") {
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
            formatDate:function (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            /*邮编选择*/
            changeCode: function(moneyflag){//moneyflag
                var that = this;
                //var code = ($('#clientzipcode').children(":selected").val())?($('#clientzipcode').children(":selected").val()):($('#clientzipcode').val());
                var code = this.clientinfo.clientzipcode;
                if((moneyflag === '฿')||(moneyflag === 'RM')||(moneyflag === 'S$')){
                    var cityState1;
                    if(moneyflag === '฿'){
                        cityState1 = 3;
                    }else if(moneyflag === 'RM'){
                        cityState1 = 4;
                    }else if(moneyflag === 'S$'){
                        cityState1 = 5;
                    }
                    if(code!==null){//appData.apiserver+
                        $.get("/comment/remote1/" + code +"/" + cityState1).success(function(data){
                            if(data.Error){

                            }else{
                                if((data.cityMess.cityinfo === null)||(data.cityMess.cityinfo.isallow === '禁止')){
                                    that.flag2 = 3;
                                    that.flag1 = 1;
                                    that.extrapay =0;
                                }else if(data.cityMess.cityinfo.isArrive === 0){
                                    that.flag2 = 0;
                                    that.flag1 = 0;
                                    that.extrapay =0;
                                }else if(data.cityMess.cityinfo.isArrive === 1){
                                    that.flag2 = 1;
                                    that.flag1 = 0;
                                    that.extrapay = data.cityMess.cityinfo.extrapay;
                                    if(that.check === 1){
                                        that.flag1 = 1;
                                    }else{
                                        that.flag1 = 0;
                                    }
                                }
                            }
                        })
                    }
                }
            },
            //地址选择
            init_Select_City: function (code, id, ele) {
                var that = this;
                if (ele === 'city') {
                    $.getJSON('/api/getSubAddressList?countryCode=' + code, function (data) {
                        app.$nextTick(function () {
                            this.cityData = data;
                            this.clientinfo.city = this.cityData[0];
                        })
                    });
                } else {
                    $.getJSON('/api/getSubAddressList?countryCode=' + code + '&addressId=' + id.id, function (data) {
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
                //  获取Vue页面的值
                if((code === 'HK')||(code === 'NT')||(code === 'Rp')){
                    /*var cityArea = this.city.name;
                    var cityTest = this.area.name;*/
                    var cityArea = that.city.name;
                    var cityTest = that.area.name;
                    var cityState;
                    if(code === 'HK'){
                        cityState = 1;
                    }else if(code === 'NT'){
                        cityState = 0;
                    }else if(code === 'Rp'){
                        cityState = 2;
                    }
                    if(cityArea!== null){
                        var all ='全部';
                        $.get("/comment/remote2/"+ cityState+'/' +cityArea+'/'+all).success(function(data3){
                            if(data3.Error){

                            }else{
                                if(data3.cityMess.cityinfo === null){
                                    if(cityTest!== null){
                                        $.get("/comment/remote/" + cityTest +'/' + cityState+'/' +cityArea).success(function (data1) {
                                            if (data1.Error) {
                                                /*  tools.show_msg(data1.Info[appData.language]);*/
                                            } else {
                                                if((data1.cityMess.cityinfo === null)||(data1.cityMess.cityinfo.isallow === '禁止')){
                                                    that.flag2 = 3;
                                                    that.flag1 = 1;
                                                    that.extrapay = 0;
                                                }else if(data1.cityMess.cityinfo.isArrive === 0){
                                                    that.flag2 = 0;
                                                    that.flag1 = 0;
                                                    that.extrapay = 0;
                                                }else if(data1.cityMess.cityinfo.isArrive === 1){
                                                    that.flag2 = 1;
                                                    that.flag1 = 0;
                                                    that.extrapay = data1.cityMess.cityinfo.extrapay;
                                                    if(that.check === 1){
                                                        that.flag1 = 1;
                                                    }else{
                                                        that.flag1 = 0;
                                                    }
                                                }

                                            }
                                        });
                                    }
                                }else{
                                    if(data3.cityMess.cityinfo.isallow === '禁止'){
                                        that.flag2 = 3;
                                        that.flag1 = 1;
                                        that.extrapay = 0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 0)){
                                        that.flag2 = 0;
                                        that.flag1 = 0;
                                        that.extrapay = 0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 1)){
                                        that.flag2 = 1;
                                        that.flag1 = 0;
                                        that.extrapay = data3.cityMess.cityinfo.extrapay;
                                        if(that.check === 1){
                                            that.flag1 = 1;
                                        }else{
                                            that.flag1 = 0;
                                        }
                                    }
                                }
                            }
                        })
                    }
                    //

                    //
                }else if((code === '฿')||(code === 'RM')||(code === 'S$')){//另外的城市
                    /* var cityArea = this.city.name;
                     var cityTest = this.area.name;*/
                    var cityArea = that.city.name;
                    var cityTest = that.area.name;
                    var cityState1;
                    if(code === '฿'){
                        cityState1 = 3;
                    }else if(code === 'RM'){
                        cityState1 = 4;
                    }else if(code === 'S$'){
                        cityState1 = 5;
                    }
                    if(cityArea!== null){
                        var all ='全部';
                        $.get("/comment/remote2/"+ cityState1+'/' +cityArea+'/'+all).success(function(data3){
                            if(data3.Error){

                            }else{
                                if(data3.cityMess.cityinfo === null){
                                    if(cityTest!== null){
                                        //根据地区查邮编为全部的，
                                        var zip = '全部';
                                        $.get("/comment/remote3/"+ cityState1+'/' +cityArea+'/'+zip+'/'+cityTest).success(function(data4){
                                            if(data4.Error){

                                            }else{
                                                if(data4.cityMess.cityinfo === null){
                                                    //this.changeCode();//去掉change事件
                                                    that.flag2 = 3;
                                                    that.flag1 = 1;
                                                    that.extrapay = 0;
                                                    that.mark = 1;
                                                }else{
                                                    that.mark = 0;
                                                    if(data4.cityMess.cityinfo.isallow === '禁止'){
                                                        that.flag2 = 3;
                                                        that.flag1 = 1;
                                                        that.extrapay = 0;
                                                    }else if((data4.cityMess.cityinfo.isallow === '允许')&&(data4.cityMess.cityinfo.isArrive === 0)){
                                                        that.flag2 = 0;
                                                        that.flag1 = 0;
                                                        that.extrapay = 0;
                                                    }else if((data4.cityMess.cityinfo.isallow === '允许')&&(data4.cityMess.cityinfo.isArrive === 1)){
                                                        that.flag2 = 1;
                                                        that.flag1 = 0;
                                                        that.extrapay = data4.cityMess.cityinfo.extrapay;
                                                        if(that.check === 1){
                                                            that.flag1 = 1;
                                                        }else{
                                                            that.flag1 = 0;
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }else{
                                    that.mark = 0;
                                    if(data3.cityMess.cityinfo.isallow === '禁止'){
                                        that.flag2 = 3;
                                        that.flag1 = 1;
                                        that.extrapay = 0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 0)){
                                        that.flag2 = 0;
                                        that.flag1 = 0;
                                        that.extrapay = 0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 1)){
                                        that.flag2 = 1;
                                        that.flag1 = 0;
                                        that.extrapay = data3.cityMess.cityinfo.extrapay;
                                        if(that.check === 1){
                                            that.flag1 = 1;
                                        }else{
                                            that.flag1 = 0;
                                        }
                                    }
                                }
                            }
                        })
                    }

                }
            },
            getValue:function(){
                var that = this;
                var checked = document.getElementById("remote");
                if(checked.checked){
                    that.flag1 = 1;
                }else{
                    that.flag1 = 0;
                }
            },
            //查询订单
            find_order: function () {
                var expressinfo = this.expressinfo;
                if (!expressinfo) {
                    return tools.show_msg(findStr);
                }
                $('.find-btn').text('wait 10s');
                $('.find-btn').attr('disabled', "true").addClass("disabled");
                var time = 9;
                var id = setInterval(function () {
                    $('.find-btn').text('wait ' + time + 's');
                    time--;
                    if (time === -1) {
                        $('.find-btn').removeAttr('disabled').removeClass("disabled");
                        $('.find-btn').text(findbtnStr);
                        clearInterval(id);
                    }
                }, 1000);
                $.post(this.apiserver+"/queryorder/", {
                    expressinfo:expressinfo,
                    url:window.location.href
                }, function(data) {
                    tools.close_all();
                    if (data.Error) {
                        app.$nextTick(function () {
                            tools.show_msg(data.Info[this.detail.language]);
                        })
                    } else {
                        app.$nextTick(function () {
                            this.orders = data.orders;
                        })
                    }
                });
            },
            go_back(){
                $('.success_modal').css('display','none');

            },
            scorll_order(){
                document.getElementById("order").scrollIntoView(true);
            },
            //商品属性、动态添加class
            Switch_package(index,price) {
                this.package_price=price;
                this.item=index;
                var len=this.prods.length;
                var length=index-len;
                if(length>=0){
                    for(var i=0;i<parseInt(length);i++){
                        this.add_spec();
                    }
                }else{
                    var j=Math.abs(length);
                    this.prods.splice(this.prods.length - j, j);
                    this.calc_price_nocart();
                }
            },
            scorll_Top(){
                timer=setInterval(function(){
                    //获取滚动条距离顶部的高度
                    var osTop=document.documentElement.scrollTop|| document.body.scrollTop;
                    var ispeed=Math.floor(-osTop / 5);
                    isTop = true;
                    document.documentElement.scrollTop=document.body.scrollTop = osTop+ispeed;
                    // osTop-=200;
                    if(osTop==0){
                        clearInterval(timer);
                    }
                },30);
            },
            GetRTime() {
                var EndTime = new Date(this.detail.countdown);
                EndTime.setDate(EndTime.getDate());
                var NowTime = new Date();
                EndTime.setDate( EndTime.getDate());
                var t =  EndTime.getTime() -  NowTime.getTime();
                if(t<=0){
                    $("#countdown").hide();
                    // int=window.clearInterval(int);
                }else {
                    this.d = 0;
                    this.h = 0;
                    this.m = 0;
                    this.s = 0;
                    if (t >= 0) {
                        this.d = Math.floor(t / 1000 / 60 / 60 / 24);
                        if(this.d<10){
                            this.d = '0'+Math.floor(t / 1000 / 60 / 60 / 24);
                        }
                        this.h = Math.floor(t / 1000 / 60 / 60 % 24);
                        if(this.h<10){
                            this.h = '0'+Math.floor(t / 1000 / 60 / 60 % 24);
                        }
                        this.m = Math.floor(t / 1000 / 60 % 60);
                        if(this.m<10){
                            this.m = '0'+Math.floor(t / 1000 / 60 % 60);
                        }
                        this.s = Math.floor(t / 1000 % 60);
                        if(this.s<10){
                            this.s = '0'+Math.floor(t / 1000 % 60);
                        }
                    }
                }
            },
        }
    });
}

