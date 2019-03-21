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

function loadData(data) {
    var app = new Vue({
        el: '#app',
        delimiters: ['[[', ']]'],
        data: {
            apiserver:data.apiserver,
            mark:1,
            check:1,//0
            extrapay:'',
            flag2:3,
            flag1:1,
            value: '',
            detail: data.detail,
            cdnbase: data.cdnbase,
            prods: [{
                id: data.detail.id,
                sourceid: data.detail.source,
                userkey: data.detail.userkey,
                name: data.detail.name,
                specname: '',
                sku: '',
                price: 0,
                img: '',
                number: 1,
                money: 0,
                option1:'',
                option2:''
            }],
            name_list: data.detail.specs.name_list,
            option1_list: data.detail.specs.option1_list,
            option2_list: data.detail.specs.option2_list,
            option1_show: data.detail.specs.option1_list.length,
            option2_show: data.detail.specs.option2_list.length,
            manyoff_new: JSON.parse(data.detail.manyoff_new),
            manyoff: JSON.parse(data.detail.manyoff),
            saleoff: JSON.parse(data.detail.saleoff),
            count_info: JSON.parse(data.detail.count_info),
            giftGoodsSpec:data.detail.giftGoodsSpecsStr?JSON.parse(data.detail.giftGoodsSpecsStr):"",
            priceoff: data.detail.priceoff ? JSON.parse(data.detail.priceoff) : "",
            allPrice: 0,
            moneyprice: 0,
            manyoff_price: 0,
            saleoff_price: 0,
            realPrice: 0,
            getProduct: [],
            transitArr:[],
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
            num: 0,
            all_money: 0,
            selection: 0,
            isAble:false,
            area:{},
            city:{},
            opt1_list:[],
            opt2_list:[],
            opt1:[],
            opt2:[],
            opt3:[],
            flag:false,
            d:0,
            h:0,
            m:0,
            s:0,
            t:0,
            gift1:[],
            gift2:[],
            gift3:[],
            giftLength:1,
            giftSelect:[],
            showSize:false,
            showAddress:false,
            orderSuccess:false,
            payment_way:"货到付款",
            way:0,
            current_manyoff: {},
            gift_select: [],
            manyoff_arr: [],
            gift_allArr:[]
        },
        created: function () {
            setInterval(this.GetRTime, 1000);
            if (this.d == 0 && this.h == 0 && this.m == 0 && this.s == 0) {
                clearInterval(this.GetRTime);
            }
            //选择城市
            this.init_Select_City(this.detail.money, null, 'city');
            window.addEventListener('scroll', function () {
                let height = $('#home_slider').height();
                if (document.documentElement.scrollTop > height) {
                    $('.countdown').addClass('countdown_fixed');
                    $(".top_fixed ").fadeIn();
                } else {
                    $('.countdown').removeClass('countdown_fixed');
                    $(".top_fixed ").fadeOut();
                }
            });
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
            this.manyoff_arr = this.detail.GoodsPromotions.filter(function (item) {
                return item.promotion_type === 3;
            });
            for (let promotion of this.manyoff_arr) {
                promotion.gift_specs = [];
                for (let i in promotion.gifts) {
                    promotion.gift_specs.push(this.format(promotion.gifts[i]));
                }
            }
            this.current_manyoff=this.manyoff_arr[0];
            this.add_spec();
            for(var m=0;m<this.current_manyoff.count;m++){
                this.opt3[m]='0';
                this.opt2[m]='0';
                this.opt1[m]='0';
            }
            for(var i in this.current_manyoff.gifts){
                this.$set(this.gift_select,i,[]);
                this.$set(this.gift3,i,[]);
                this.$set(this.gift1,i,[]);
                this.$set(this.gift2,i,[]);
                for (var k = 0; k < this.current_manyoff.gift_count; k++) {
                    this.gift_select[i].push({
                        id: this.current_manyoff.gifts[i].id,
                        sitename:this.current_manyoff.gifts[i].sitename,
                        specname: '',
                        sku: '',
                        price: 0,
                        img: '',
                        option1: '',
                        option2: '',
                        number: 1
                    });
                    this.gift3[i].push("0");
                    this.gift1[i].push("0");
                    this.gift2[i].push("0");
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


        },
        computed:{
            isdisable(){
                return function (name,index2,index1,option_index) {
                    let item = this.getItem(name,index2,index1,option_index);
                    if(!item) return true;
                    let disable = false;
                    if(option_index === '1'){
                        disable = !this.gift_select[index1][index2].specname||(item.inventory===0&&this.current_manyoff.gift_specs[index1].option2_list.length===0);
                    }
                    else{
                        disable = !this.gift_select[index1][index2].option1 || item.inventory===0;
                    }
                    return this.getDisableState(item,index2,index1,option_index) || disable;
                }
            },
        },
        methods: {
            // 倒计时
            GetRTime() {
                var EndTime = new Date(this.detail.countdown);
                EndTime.setDate(EndTime.getDate());
                var NowTime = new Date();
                EndTime.setDate(EndTime.getDate());
                var t = EndTime.getTime() - NowTime.getTime();
                if (t <= 0) {
                    $("#countdown").hide();
                    $(".shop_price").css('width','100%');
                    // int=window.clearInterval(int);
                } else {
                    this.d = 0;
                    this.h = 0;
                    this.m = 0;
                    this.s = 0;
                    if (t >= 0) {
                        this.d = Math.floor(t / 1000 / 60 / 60 / 24);
                        if (this.d < 10) {
                            this.d = '0' + Math.floor(t / 1000 / 60 / 60 / 24);
                        }
                        this.d1 = String(this.d).substr(0, 1);
                        this.d2 = String(this.d).substr(1, 2);
                        this.h = Math.floor(t / 1000 / 60 / 60 % 24);
                        if (this.h < 10) {
                            this.h = '0' + Math.floor(t / 1000 / 60 / 60 % 24);
                        }
                        this.h1 = String(this.h).substr(0, 1);
                        this.h2 = String(this.h).substr(1, 2);
                        this.m = Math.floor(t / 1000 / 60 % 60);
                        if (this.m < 10) {
                            this.m = '0' + Math.floor(t / 1000 / 60 % 60);
                        }
                        this.m1 = String(this.m).substr(0, 1);
                        this.m2 = String(this.m).substr(1, 2);
                        this.s = Math.floor(t / 1000 % 60);
                        if (this.s < 10) {
                            this.s = '0' + Math.floor(t / 1000 % 60);
                        }
                        this.s1 = String(this.s).substr(0, 1);
                        this.s2 = String(this.s).substr(1, 2);
                    }
                }
            },
            // 二级数组去重并重新排列
            check_option1_repeat(list,num) {
                var templist1=[];
                var option1list = [];
                if(this.prods[num-1]!==undefined){
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
                }


            },
            // 三级数组去重并重新排列
            check_option2_repeat(list,num) {
                var templist2=[];
                var option2list = [];
                if(this.prods[num-1]!==undefined){
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
                }

            },
            //一级规格点击事件
            select_specitem_nocart: function (item, num) {
                this.opt2[num-1]='0';
                this.opt1[num-1]='0';
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
                }
            },
            //二级规格选中和禁止选中
            check_option1_disable:function(item,num){
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
                    item.templist1=this.check_option1_repeat(this.detail.GoodsSpecs,num);
                    for(var i in item.templist1){
                        if(item.templist1[i].name===this.prods[num-1].specname && item.templist1[i].option1===this.prods[num-1].option1){
                            this.prods[num-1].price = item.templist1[i].price;
                            this.prods[num-1].sku = item.templist1[i].id;
                            this.getProduct[num-1]=item.templist1[i];
                            this.calc_price_nocart();
                        }
                    }
                }
            },
            //三级规格选中和禁止选中
            check_option2_disable:function(item,num){
                if(item===undefined) return;
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
                // this.prods[num-1].price = "";
                // this.prods[num-1].sku = "";
                item.templist2 = this.check_option2_repeat(this.detail.GoodsSpecs,num);
                for(var i in item.templist2){
                    if(item.templist2[i].name===this.prods[num-1].specname && item.templist2[i].option1===this.prods[num-1].option1 && item.templist2[i].option2===this.prods[num-1].option2){
                        this.prods[num-1].price = item.templist2[i].price;
                        this.prods[num-1].sku = item.templist2[i].id;
                        this.getProduct[num-1]=item.templist2[i];
                        this.calc_price_nocart();
                    }
                }
            },
            //二级规格时判断缺货
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
            //三级规格时判断缺货
            stockout2:function(item,num){
                if(item===undefined) return;
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
                for(var i=1;i<this.current_manyoff.count;i++){
                    this.prods.push({
                        id: this.detail.id,
                        name: this.detail.name,
                        specname: '',
                        sku: '',
                        price: 0,
                        img: '',
                        number: 0,
                        money: 0,
                        option1:'',
                        option2:''
                    });
                }
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
            //删除某一件(选购)
            close_spec(index) {
                if (this.arr.length > 0) {
                    this.all_money = this.all_money - this.arr[index].price;
                    this.arr.splice(index, 1);
                    //删除成功
                    tools.show_msg(delete_success);
                }
                localStorage.setItem(this.stgSitedir_A, JSON.stringify(this.arr));
            },
            compare(property) {
                return function (a, b) {
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            },
            com_index(arr, num) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].totalmoney > num) {
                        return i - 1;
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
                }
                let amountInfo={
                    order_price:this.allPrice,
                    gifts_id: this.current_manyoff.gifts_id,
                    goods_count:this.current_manyoff.count
                };
                this.getPromotion(this.detail,amountInfo);
                this.realPrice=amountInfo.order_price;
            },
            getPromotion: function (goods, amountInfo) {
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
            },
            runPromotion: function (index, Promotions, amountInfo) {
                //此处3、2、1、0只指促销顺序，自上而下
                if (index === 3) {
                    this.singleDiscount(Promotions, amountInfo);
                } else if (index === 2) {

                    this.multipleFixedPrice(Promotions, amountInfo);
                } else if (index === 1) {

                    this.totalCountReduction(Promotions, amountInfo);
                } else if (index === 0) {

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
                            if (amountInfo.order_price >= prom.price1) {
                                offprice = prom.price2;
                                lastprice = prom.price1;
                            }
                        }
                    }
                });
                amountInfo.totalOffPrice = offprice;
                amountInfo.order_price = amountInfo.order_price - offprice;
            },
            totalCountReduction: function (Promotions, amountInfo) {
                //合计件数满减
                let offprice = 0;
                let lastcount = 0;
                Promotions.map(function (prom) {
                    if (prom.promotion_type === 2) {
                        if (prom.count > lastcount && prom.count > 0) {
                            if (amountInfo.goods_count >= prom.count) {
                                offprice = prom.price1;
                                lastcount = prom.count;
                            }
                        }
                    }
                });
                amountInfo.totalCountOffPrice = offprice;
                amountInfo.order_price = amountInfo.order_price - offprice;
            },
            multipleFixedPrice: function (Promotions, amountInfo) {
                //合计件数一口价
                Promotions.map(function (prom) {
                    if (prom.promotion_type === 3) {
                        if (amountInfo.gifts_id === prom.gifts_id&&prom.price1>0) {
                            amountInfo.order_price = prom.price1;
                            amountInfo.totalCountOffPrice = 0;
                            amountInfo.totalOffPrice = 0;
                            amountInfo.singleOffPrice = 0;
                        }
                    }
                });
            },
            singleDiscount: function (Promotions, amountInfo) {
                //单件优惠
                let offprice = 0;
                for (let i = 1; i <= amountInfo.goods_count; i++) {
                    Promotions.map(function (prom) {
                        if (prom.promotion_type === 4) {
                            if (prom.count + '' === i + '') {
                                offprice += prom.price1;
                            }
                        }
                    });
                }
                amountInfo.singleOffPrice = offprice;
                amountInfo.order_price = amountInfo.order_price - offprice;
            },
            //提交订单
            submit_order_nocart: function () {
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
                var map = {}, mergeCartinfo = [];
                for(var i = 0; i < cartinfo.length; i++){
                    var ai = cartinfo[i];
                    if(!map[ai.sku]){
                        mergeCartinfo.push({
                            id: ai.id,
                            sku: ai.sku,
                            img: ai.img,
                            sitedir: ai.sitedir,
                            number:ai.number,
                        });
                        map[ai.sku] = ai;
                    }else{
                        for(var j = 0; j < mergeCartinfo.length; j++){
                            var dj = mergeCartinfo[j];
                            if(dj.sku === ai.sku){
                                dj.number+=ai.number;
                                break;
                            }
                        }
                    }
                }
                var giftCartinfo={};
                for(var i in this.gift_select){
                    var gifts=[];
                    for(var k in this.gift_select[i]){
                        var prod = this.gift_select[i][k];
                        if(!prod.id||!prod.sku){
                            tools.show_msg(selectGiftStr+(parseInt(i)+1));
                            return;
                        }
                        gifts.push({
                            id: prod.id,
                            sku: prod.sku,
                            img: prod.img,
                            sitedir: appData.sitedir,
                            number: prod.number
                        });
                    }
                    var temp = {}, mergeGiftsinfo = [];
                    for(var f = 0; f< gifts.length; f++){
                        var a = gifts[f];
                        if(!temp[a.sku]){
                            mergeGiftsinfo.push({
                                id: a.id,
                                sku: a.sku,
                                img: a.img,
                                sitedir: a.sitedir,
                                number:a.number,
                            });
                            temp[a.sku] = a;
                        }else{
                            for(var j = 0; j < mergeGiftsinfo.length; j++){
                                var d = mergeGiftsinfo[j];
                                if(d.sku === a.sku){
                                    d.number+=a.number;
                                    break;
                                }
                            }
                        }
                    }
                    giftCartinfo[i]=mergeGiftsinfo;
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
                if(this.detail.money==='NT'){
                    if($("#payment2").is(":checked")||$("#payment3").is(":checked")){
                        this.clientinfo.city=this.city;
                        this.clientinfo.area=this.area;
                        if(!this.clientinfo.city||this.clientinfo.city === '城市'){
                            $('#city1').focus();
                            return tools.show_msg(cityStr);
                        }
                        if(!this.clientinfo.area||this.clientinfo.area === '區縣'){
                            $('#area1').focus();
                            return tools.show_msg(areaStr);
                        }
                        if(!this.clientinfo.store){
                            $('#store').focus();
                            return tools.show_msg(storeStr);
                        }
                    }
                }
                if (this.detail.money !== '￥' && this.detail.money !== 'S$') {
                    if (this.clientinfo.city === '城市' || this.clientinfo.city === 'Province' || this.clientinfo.city === 'จังหวัด' || this.clientinfo.city === '区域' || this.clientinfo.city === undefined || this.clientinfo.city === ""||this.clientinfo.city ==='都道府県を選択') {
                        $('#city').focus();
                        return tools.show_msg(cityStr);
                    }
                    if (this.clientinfo.area === '区县' || this.clientinfo.area === '區縣' || this.clientinfo.area === 'City' || this.clientinfo.area === 'เมือง' || this.clientinfo.area === '區' || this.clientinfo.area === undefined || this.clientinfo.area ==="") {
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
                // if (this.clientinfo.clientemail && !Email.test(this.clientinfo.clientemail)) {
                //     $('#clientemail').focus();
                //     return tools.show_msg(emailStr);
                // }
                submiting = true;
                tools.show_loading(submitingStr, 30);
                $.ajax({
                    type: "POST",
                    url: '/createorder',
                    contentType: "application/json",
                    data: JSON.stringify({
                        goodsinfo: {sitedir:appData.sitedir,redirect_sitedir:appData.redirect_sitedir,is_domain:appData.is_domain},
                        cartinfo: mergeCartinfo,
                        giftCartinfo:giftCartinfo,
                        clientinfo: this.clientinfo,
                        package_id:this.current_manyoff.id,
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
                            app.$nextTick(function () {
                                tools.show_msg(data.Info[this.detail.language]);
                            })
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
                                this.orderSuccess=true;
                            })
                        }
                    }
                });


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
                $.post(this.apiserver+"/queryorder", {
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
            //邮编选择
            changeCode: function(moneyflag){//moneyflag
                var that = this;
                var code = ($('#clientzipcode').children(":selected").val())?($('#clientzipcode').children(":selected").val()):($('#clientzipcode').val());
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
                this.payment_way="货到付款";
                this.clientinfo.store_delivery='货到付款';
                $("#scqh").hide();
                $("#hdfk").show();
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
                //获取Vue页面数据
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
                                                    that.mark = 1;
                                                    that.extrapay =0;
                                                }else{
                                                    that.mark = 0;
                                                    if(data4.cityMess.cityinfo.isallow === '禁止'){
                                                        that.flag2 = 3;
                                                        that.flag1 = 1;
                                                        that.extrapay =0;
                                                    }else if((data4.cityMess.cityinfo.isallow === '允许')&&(data4.cityMess.cityinfo.isArrive === 0)){
                                                        that.flag2 = 0;
                                                        that.flag1 = 0;
                                                        that.extrapay =0;
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
                                        that.extrapay =0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 0)){
                                        that.flag2 = 0;
                                        that.flag1 = 0;
                                        that.extrapay =0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 1)){
                                        that.flag2 = 1;
                                        that.flag1 = 0;
                                        that.extrapay =data3.cityMess.cityinfo.extrapay;
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
            pay_shop(shop, type) {
                var that=this;
                this.clientinfo.clientaddress = '';
                $("#scqh").show();
                $("#hdfk").hide();
                $("#city1").empty();
                $('#area1').empty();
                $('#store').empty();
                $('#clientaddress').val('').removeAttr("disabled");
                $.ajax({
                    type: "POST",
                    url: that.apiserver + '/twStore/' + shop,
                    contentType: "application/json",
                    data: JSON.stringify({
                        type: type,
                    }),
                    error: function (data) {
                        tools.show_msg(submiterrorStr);
                    },
                    success: function (data) {
                        $.each(data, function (index, item) {
                            $("#city1").append('<option value="' + item.cityName + '" data-id="' + item.cityId + '">' + item.cityName + '</option>');
                        });
                    }
                });
            },
            select_area(type) {
                var that=this;
                if ($("#payment2").is(":checked")) {
                    shop = "shop711";
                    that.clientinfo.store_delivery='711超商取貨';
                    that.payment_way="711超商取貨";
                } else {
                    that.payment_way="全家超商取貨";
                    shop = "family";
                    that.clientinfo.store_delivery='全家超商取貨';
                }
                if (type === "getTown") {
                    $('#area1').empty();
                    $("#store").empty();
                    $('#clientaddress').val('').removeAttr("disabled");
                } else {
                    $("#store").empty();
                    $('#clientaddress').val('').removeAttr("disabled");
                }
                $.ajax({
                    type: "POST",
                    url: that.apiserver + '/twStore/' + shop,
                    contentType: "application/json",
                    data: JSON.stringify({
                        type: type,
                        city: that.city,
                        area: that.area,
                    }),
                    error: function (data) {
                        tools.show_msg(submiterrorStr);
                    },
                    success: function (data) {
                        if (type === "getTown") {
                            $.each(data, function (index, item) {
                                $("#area1").append('<option value="' + item.TownName + '" data-id="' + item.TownID + '">' + item.TownName + '</option>');
                            });
                        } else {
                            storeList = data;
                            $("#store").append('<option value="">请选择店铺</option>');
                            if ($("#payment2").is(":checked")) {
                                $.each(data, function (index, item) {
                                    $("#store").append('<option value="' + item.Address + '" data-id="' + item.POIID + '">' + item.POIName + '——' + item.Address + '</option>');
                                });
                            } else {
                                $.each(data, function (index, item) {
                                    $("#store").append('<option class="store_add" value="' + item.NAME + '" data-id="' + item.SERID + '">' + item.NAME + '</option>');
                                });
                            }
                        }

                    }
                });
            },
            select_store() {
                var store = $("#store").val();
                if (!store) this.clientinfo.clientaddress = '';
                $("#clientaddress").removeAttr("disabled");

                if ($("#payment2").is(":checked")) {
                    for (var item of storeList) {
                        if (item.Address === store) {
                            // var address=item.Address+'。店名：'+item.POIName+'。店号：'+item.POIID+'。电话：'+item.Telno+'。';
                            // $("#clientaddress").val(address).attr("disabled",true);
                            this.clientinfo.clientaddress = item.Address + '。店名：' + item.POIName + '。店号：' + item.POIID + '。电话：' + item.Telno + '。';
                            $("#clientaddress").attr("disabled", true);
                            this.clientinfo.store=item.POIName;
                        }
                    }
                } else {
                    for (var item of storeList) {
                        if (item.NAME === store) {
                            var address=item.addr+'。店名：'+item.NAME+'。店号：'+item.SERID+'。电话：'+item.TEL+'。';
                            $("#clientaddress").val(address).attr("disabled",true);
                            this.clientinfo.clientaddress = item.addr + '。店名：' + item.NAME + '。店号：' + item.SERID + '。电话：' + item.TEL + '。';
                            // $("#clientaddress").attr("disabled", true);
                            this.clientinfo.store=item.NAME;
                        }
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
            //整理赠品规格数组
            format: function (goods) {
                let name_key_list = [];
                let name_list = [];
                let option1_key_list = [];
                let option1_list = [];
                let option2_key_list = [];
                let option2_list = [];
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
                                spec.father = name_list[name_key_list.indexOf(spec.name)] ? name_list[name_key_list.indexOf(spec.name)].id : "";
                                option1_list.push(spec);
                            }
                        }
                        if (spec.option2 !== '') {
                            if (option2_key_list.indexOf(spec.option2) < 0) {
                                option2_key_list.push(spec.option2);
                                spec.father = option1_list[option1_key_list.indexOf(spec.option1)] ? option1_list[option1_key_list.indexOf(spec.option1)].id : "";
                                option2_list.push(spec);
                            }
                        }
                    }
                    return goods.specs = {
                        list: goods.GoodsSpecs,
                        name_key_list: name_key_list,
                        name_list: name_list,
                        option1_key_list: option1_key_list,
                        option1_list: option1_list,
                        option2_key_list: option2_key_list,
                        option2_list: option2_list,
                    };
                }

            },
            getItem:function (name,index2,index1,option_index) {
                for (let option of this.current_manyoff.gift_specs[index1].list){
                    if( this.gift_select[index1][index2].specname === option.name){
                        const where = option_index === '1'?true:option['option1'] ===  this.gift_select[index1][index2]['option1'];
                        if(where&&option['option'+option_index] === name){
                            return option;
                        }
                    }
                }
                return null;
            },
            //赠品一级规格点击事件
            select_specitem(item,index2,index1) {
                this.gift1[index1][index2]='0';
                this.gift2[index1][index2]='0';
                this.gift_select[index1][index2].specname=item.name;
                this.gift_select[index1][index2].img=item.img;
                this.gift_select[index1][index2].option1 = "";
                this.gift_select[index1][index2].option2 = "";
                this.gift_select[index1][index2].price = "";
                this.gift_select[index1][index2].sku = "";
                if (this.current_manyoff.gift_specs[index1].option1_list.length === 0) {
                    this.gift_select[index1][index2].price = item.price;
                    this.gift_select[index1][index2].sku = item.id;
                }
                let arr = [], option1_list = [];
                for (let i in this.current_manyoff.gift_specs[index1].list) {
                    if (this.gift_select[index1][index2].specname === this.current_manyoff.gift_specs[index1].list[i].name) {
                        if (option1_list.indexOf(this.current_manyoff.gift_specs[index1].list[i].option1) < 0) {
                            arr.push(i);
                            option1_list.push(this.current_manyoff.gift_specs[index1].list[i].option1);
                        }
                    }
                }
                if (arr.length === 1) {
                    this.select_option(this.current_manyoff.gift_specs[index1].list[arr[0]].option1,index2,index1,'1');
                    arr = null;
                }
            },
            //赠品二级规格点击事件
            select_option: function (name,index2,index1,option_index) {
                let item = this.getItem(name,index2,index1,option_index);
                if(!item) return true;
                if(option_index==='1'){
                    this.gift_select[index1][index2].option1 = item.option1;
                    this.gift_select[index1][index2].option2 = "";
                    this.gift_select[index1][index2].price = "";
                    this.gift_select[index1][index2].sku = "";
                    if(this.current_manyoff.gift_specs[index1].option2_list.length === 0){
                        this.gift_select[index1][index2].price = item.price;
                        this.gift_select[index1][index2].sku = item.id;
                    }
                    let arr = [], option2_list = [];
                    for (let i in this.current_manyoff.gift_specs[index1].list) {
                        if (this.gift_select[index1][index2].specname === this.current_manyoff.gift_specs[index1].list[i].name&&this.gift_select[index1][index2].option1 === this.current_manyoff.gift_specs[index1].list[i].option1) {
                            if (option2_list.indexOf(this.current_manyoff.gift_specs[index1].list[i].option2) < 0) {
                                arr.push(i);
                                option2_list.push(this.current_manyoff.gift_specs[index1].list[i].option2);
                            }
                        }
                    }
                    if (arr.length === 1) {
                        this.select_option(this.current_manyoff.gift_specs[index1].list[arr[0]].option2,index2,index1,'2');
                        arr = null;
                    }
                }else if(option_index==='2'){
                    this.gift_select[index1][index2].option2 = item.option2;
                    this.gift_select[index1][index2].price = item.price;
                    this.gift_select[index1][index2].sku = item.id;
                }
            },
            getDisableState:function (item,index2,index1,option_index) {
                if(option_index==='1'){
                    return this.gift_select[index1][index2].specname !== item.name;
                }else{
                    return this.gift_select[index1][index2].specname !== item.name||this.gift_select[index1][index2].option1 !== item.option1;
                }
            },
            //关闭订单信息
            close_orderinfo: function () {
                this.expressinfo = "";
                $('.find-btn').removeAttr('disabled').removeClass("disabled");
                this.orders = [];
            },
            //第一个立即购买，显示商品规格
            oneSubmit(){
              this.showSize=true;
            },
            //关闭商品规格弹框
            closeSize(){
                this.showSize=false;
                this.opt1=0;
                this.opt2=0;
                this.gift1=0;
                this.gift2=0;
            },
            //第二個提交，只判斷商品和赠品是否选择
            submitSize() {
                /*
                * 商品：opt3,opt1,opt2
                * 赠品：gift3,gift1,gift2
                * */
                if(this.opt3===0){
                    tools.show_msg(selectStr);
                    return;
                }
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
                }
                    for(var i in this.gift_select){
                        for(var k in this.gift_select[i]){
                            var prod = this.gift_select[i][k];
                            if(!prod.id||!prod.sku){
                                tools.show_msg(selectGiftStr+(parseInt(i)+1));
                                return;
                            }
                        }
                    }
                this.showAddress=true;
            },
            closeArrress(){
                this.showAddress=false;
            },
            scorll_Top(){
                timer=setInterval(function(){
                    //获取滚动条距离顶部的高度
                    var osTop=document.documentElement.scrollTop|| document.body.scrollTop;
                    var ispeed=Math.floor(-osTop / 5);
                    isTop = true;
                    document.documentElement.scrollTop=document.body.scrollTop = osTop+ispeed;
                    // osTop-=200;
                    if(osTop===0){
                        clearInterval(timer);
                    }
                },30);
            },
            //选购弹出框事件
            /*e:当前点击的事件对象
            *item1:当前商品的信息
            * item:当前manyoff信息
             * index:manyoff循环的下标
              * */
        }
    });
}

