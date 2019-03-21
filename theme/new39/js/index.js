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

//获取当前时间
function CurentTime() {
    var now = new Date();
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日
    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分
    var ss = now.getSeconds(); //秒
    var clock = year + "-";
    if (month < 10) clock += "0";
    clock += month + "-";
    if (day < 10) clock += "0";
    clock += day + " ";
    if (hh < 10) clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm+ ":";
    if (ss < 10) clock += '0';
    clock += ss;
    var a=document.getElementsByClassName("hint-text")
    for(var i=0;i<a.length;i++){
        a[i].innerHTML=clock
    }
    return (clock);
}



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
            //本地存储
            localCart_data1: data.detail.sitedir,
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
            priceoff: data.detail.priceoff ? JSON.parse(data.detail.priceoff) : "",
            allPrice: 0,
            manyoff_price: 0,
            saleoff_price: 0,
            moneyprice:0,
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
            com1:[],
            com2:[],
            com3:[],
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
            Package_price:0,
            giftCount:data.detail.manyoff?JSON.parse(data.detail.manyoff)[0].giftcount:"",
            giftGoodsSpec:data.detail.giftGoodsSpecsStr?JSON.parse(data.detail.giftGoodsSpecsStr):"",
            giftLength:0,
            giftSelect:[],
            area:{},
            city:{},
            purchaseInfo:"",
            about:"",
            contact:"",
            privacy:"",
            terms:"",
            service:"",
            //购物车承接数组
            arr: [],
            isFocused1:false,
            hasErr1:false,
            isHasErr1:false,
            isFocused2:false,
            hasErr2:false,
            isHasErr2:false,
            isFocused3:false,
            hasErr3:false,
            isFocused5:false,
            hasErr5:false,
            isHasErr5:false,
            sexRadio:0,
            isFocused6:false,
            isFocused7:false,
            isDown:false,
            col0:true,
            col1:false,
            col2:false,
            col3:false,
            col4:false,
            heightObj:{
                height:"auto"
            },
            current:0,
            // 选购数量
            productNumber:1,
            allNumber:0,
            // 套餐
            manyoff_arr:[],
            viewNum:0,
            current_manyoff:{},
            gift_select: []
            
           
           
        },
        created: function () {
            if((data.detail.manyoff)[0].salecount){
                this.choose_id= this.option1_list.length-1
            }else{
                this.choose_id='';
            };
            // this.$nextTick(() => { //等待dom同步后打开模态框
            //     this.Package_price=this.manyoff[0].price;
            // });
            setInterval(this.GetRTime,1000);
            //倒计时
            if(this.d ==0 && this.h==0 && this.m==0 && this.s ==0){
                clearInterval(this.GetRTime);  
            };
            this.getPurchaseInfo();
            //this.scorll_height();
            //评价调用
            this.comments();
            // 评价滚动
            setInterval(this.evaluation_scroll,30);
            // //折扣
            this.discount();
            //评价调用
            this.comments(this.detail.id,1);
            //选择城市
            this.init_Select_City(this.detail.money, null, 'city');
            this.initgift();
            //页面加载取数据
            if (JSON.parse(localStorage.getItem(this.localCart_data1)) !== null) {
                this.arr= JSON.parse(localStorage.getItem(this.localCart_data1));
            }
            // 限时抢购
            $(document).scroll(function(){   //页面加载时，获取滚动条初始高度
                var distance = $(document).scrollTop();  //获取滚动条初始高度的值 ：0
                if(distance <20) {  //当滚动条高度小于20px时
                    $('.Count_down').css('display','none');
                } else {
                    $('.Count_down').css('display','block');
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
            
           
            //默认选中一级规格
            for (var i in this.name_list) {
                var spec = this.name_list[i];
                if (spec.isdefault === 1) {
                    this.select_specitem_nocart(spec, 1);
                    break;
                }
            }
            // 套餐
            this.manyoff_arr = this.detail.GoodsPromotions.filter(function (item) {
                return item.promotion_type === 3;
            });
            for (let promotion of this.manyoff_arr) {
                promotion.gift_specs = [];
                for (let i in promotion.gifts) {
                    promotion.gift_specs.push(this.format(promotion.gifts[i]));
                }
            }
            //this.package_select(this.manyoff_arr[0]);
            
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
            getPurchaseInfo(){
                $.get("/getpurchaseinfo/" +this.detail.language).success(function(data){
                    if (!data.Error) {
                        app.$nextTick(function () {
                            this.purchaseInfo = data;
                        });
                    }
                });
            },
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
            check_option2_disable:function(item,num){
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
                    number: 1,
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
            //初始化赠品
            initgift:function() {
                if (this.detail.gifts) {
                    for (var i = 0; i < JSON.parse(this.detail.giftGoodsIds).length; i++) {
                        var giftid = JSON.parse(this.detail.giftGoodsIds)[i].id;
                        var giftname= JSON.parse(this.detail.giftGoodsIds)[i].name;
                        var gift = [{
                            id: giftid,
                            sitename:giftname,
                            specname: '',
                            sku: '',
                            price: 0,
                            img: '',
                            option1: '',
                            option2: '',
                            number: 1
                        }];
                        this.giftSelect[i] = gift;
                    }
                    this.giftSelect = JSON.parse(JSON.stringify(this.giftSelect));
                }
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
             //价格满减排序
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
            //提交订单
            submit_order_nocart: function () {
                if (submiting) return;
                if (this.prods.length === 0) return;
                var cartinfo = [];
                for (var i in this.arr) {
                    for(var j in this.arr[i].sort){
                        var prod = this.arr[i].sort[j];
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
                        
                        //console.log(prod)
                    }

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

                        //打开订单完成模态框
                        $("#orderForm").css("display","block");
                        $("#page").css("display","none");
                            
                        //  关闭限时抢购倒计时
                        $('.Count_down').css('display','none');
                        //  关闭立即抢购
                        $("#buyFixed").css("display","none");
                        CurentTime()
                    }
                });


            },
           
            //提交评价
            add_comment: function () {
                var TW_phone = /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[0-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/;
                var HK_phone = /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/;
                var RM_phone = /^([0-9-]+)$/;
                var otherPhone = /^([0-9-]+)$/;
                var a = this.comment_phone,
                    e = this.comment_body;
                if (this.detail.money === 'HK') {
                    if (!a || !HK_phone.test(a)) {
                        $('#comment_phone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                } else if (this.detail.money === 'NT') {
                    if (!a || !TW_phone.test(a)) {
                        $('#comment_phone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                } else if (this.detail.money === 'RM') {
                    if (!a || !RM_phone.test(a)) {
                        $('#comment_phone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                } else {
                    if (!a || a === ' ' || !otherPhone.test(a)) {
                        $('#comment_phone').focus();
                        return tools.show_msg(PhoneStr);
                    }
                }
                $.post("/comment", {
                    goodsid: this.detail.id,
                    phone: a,
                    body: e,
                    sitedir: this.detail.sitedir,
                    referrer: document.referrer ? document.referrer : '直接进入',
                }, function (data) {
                    app.$nextTick(function () {
                        tools.show_msg(data.Info[this.detail.language]);
                        this.comment_phone = "";
                        this.comment_body = "";
                    })
                })
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
                                                    that.extrapay =0;
                                                }else if(data1.cityMess.cityinfo.isArrive === 0){
                                                    that.flag2 = 0;
                                                    that.flag1 = 0;
                                                    that.extrapay =0;
                                                }else if(data1.cityMess.cityinfo.isArrive === 1){
                                                    that.flag2 = 1;
                                                    tools.show_msg(remote);
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
                                        that.extrapay =0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 0)){
                                        that.flag2 = 0;
                                        that.flag1 = 0;
                                        that.extrapay =0;
                                    }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 1)){
                                        that.flag2 = 1;
                                        tools.show_msg(remote);
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
                                                    that.extrapay =0;
                                                    that.mark = 1;
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
                                                        tools.show_msg(remote);
                                                        that.flag1 = 0;
                                                        that.extrapay =data4.cityMess.cityinfo.extrapay;
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
                                        tools.show_msg(remote);
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
          
      
            GetRTime() {
                var EndTime = new Date(this.detail.countdown);
                EndTime.setDate(EndTime.getDate());
                var NowTime = new Date();
                EndTime.setDate( EndTime.getDate());
                var t =  EndTime.getTime() -  NowTime.getTime();
                if(t<=0){
                    $("#countdown").hide();
                    // int=window.clearInterval(int);
                    this.isDown=false
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
                        this.isDown=true
                    }
                }
            },
            myFocus1(){
                this.isFocused1=true;
                if(this.clientinfo.clientname==""){
                    this.hasErr1=false;
                    this.isHasErr1=true;
                }
            },
            myBlur1(){
                this.isFocused1=false;
                if(this.clientinfo.clientname==""){
                    this.hasErr1=true
                    this.isHasErr1=true
                }else{
                    this.hasErr1=false;
                    this.isHasErr1=false;
                }
            },
            myFocus2(){
                this.isFocused2=true;
                this.isHasErr2=true;
                if(this.clientinfo.clientphone==""){
                    this.hasErr2=false;
                }
            },
            myBlur2(){
                this.isFocused2=false;
                if(this.clientinfo.clientphone==""){
                    this.hasErr2=true
                    this.isHasErr2=true
                }else{
                    this.hasErr2=false;
                    this.isHasErr2=false;
                }
            },
            inputName(){
                if(this.clientinfo.clientname!=''){
                    this.hasErr1=false;
                    this.isHasErr1=false;
                }
            },
            inputPhone(){
                if(this.clientinfo.clientphone==""){
                    this.isHasErr2=true
                    this.hasErr2=true
                }else{
                    this.hasErr2=false;
                    this.isHasErr2=false;
                }               
            },
            myFocus5(){
                this.isFocused5=true;
                if(this.clientinfo.clientaddress==""){
                    this.hasErr5=false;
                    this.isHasErr5=true;
                }
            },
            myBlur5(){
                this.isFocused5=false;
                if(this.clientinfo.clientaddress==""){
                    this.hasErr5=true
                    this.isHasErr5=true
                }else{
                    this.hasErr5=false;
                    this.isHasErr5=false;
                }
            },
            inputSite(){
                if(this.clientinfo.clientaddress!=''){
                    this.hasErr5=false;
                    this.isHasErr5=false;
                }
            },
            myFocus6(){
                this.isFocused6=true;
            },
            myBlur6(){
                this.isFocused6=false;
            },
            myFocus7(){
                this.isFocused7=true;
            },
            myBlur7(){
                this.isFocused7=false;
            },
            switchCol(event){
                if(event==0){
                    this.col0=true
                    this.col1=this.col2=this.col3=this.col4=false
                    this.heightObj.height='auto'
                }
                if(event==1){
                    this.col1=true
                    this.col0=this.col2=this.col3=this.col4=false
                    this.heightObj.height='auto'
                }
                if(event==2){
                    this.col2=true
                    this.col0=this.col1=this.col3=this.col4=false
                    this.heightObj.height='auto'
                }
                if(event==3){
                    this.col3=true
                    this.col0=this.col1=this.col2=this.col4=false
                    this.heightObj.height='auto'
                }
                if(event==4){
                    this.col4=true
                    this.col0=this.col1=this.col2=this.col3=false
                    this.heightObj.height='auto'
                }
            },

             //套餐选择点击事件
            package_select(many) {
                this.package_count=many.gift_count;
                this.current_manyoff = many;
                console.log(many);
                this.prods = [];
                this.gift_select=[];
                for (var i = 0; i < many.count; i++) {
                    this.add_spec();
                }

                for(var i in many.gifts){
                    this.$set(this.gift_select,i,[]);
                    for (var k = 0; k < many.gift_count; k++) {
                        this.gift_select[i].push({
                            id: many.gifts[i].id,
                            sitename:many.gifts[i].sitename,
                            specname: '',
                            sku: '',
                            price: 0,
                            img: '',
                            option1: '',
                            option2: '',
                            number: 1
                        })
                    }
                }
                console.log(this.gift_select)
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


            viewProduct(num,many){
                // 选择打开那个窗口
                this.viewNum=num
                if(many){
                    this.prods=[];
                    for (var i = 0; i < many.count; i++) {
                        this.add_spec();
                        this.package_select(many)
                    }
                }
                //console.log(this.prods)
                //console.log(num)
                $("#viewProduct").css("display","block")
                $("#viewProduct").css("padding-right","17px")
                //  关闭立即抢购
                $("#buyFixed").css("display","none");
                 //  关闭限时抢购倒计时
                $('.Count_down').css('display','none');
            },
            viewNone(){
                $("#viewProduct").css("display","none")

                if(this.prods.length>1){
                    this.prods=[];
                    this.add_spec();
                }
                $("#buyFixed").css("display","none");
                $('.Count_down').css('display','block');
            },
            xgAddNum(){
                this.productNumber++
                this.calc_price_nocart();
                localStorage.setItem(this.localCart_data1, JSON.stringify(this.arr));
            },
            xgDecNum(){
                if (this.productNumber<=1){
                    this.productNumber=1;
                }else {
                    this.productNumber-=1;
                }
                this.calc_price_nocart();
                localStorage.setItem(this.localCart_data1, JSON.stringify(this.arr));
            },
            addNum(index){ 
                this.arr[index].sort[0].number++
                this.calc_price_nocart();
                localStorage.setItem(this.localCart_data1, JSON.stringify(this.arr));
            },
            decNum(index){
             
                if( this.arr[index].sort[0].number<=1){
                    this.removeCartItem(index)
                    this.calc_price_nocart();
                }
                for(var i in this.arr){
                    if(Number(i)===index){
                        this.arr[i].sort[0].number-=1;
                    }
                }
                this.calc_price_nocart();
                localStorage.setItem(this.localCart_data1, JSON.stringify(this.arr));

   
            },
            // 加入购物车
            add_cart(num){
                if(num===0){
                    for (var i in this.prods) {
                        var prod = this.prods[i];
                        if (!prod.id || !prod.sku || prod.price === 0) {
                            tools.show_msg(selectStr + (parseInt(i) + 1));
                            return;
                        }
                        //判断是否缺货
                        for (var j in this.detail.GoodsSpecs) {
                            var spec = this.detail.GoodsSpecs[j];
                            if (prod.sku === spec.id) {
                                if (spec.inventory === 0) {
                                    tools.show_msg(selectOos + (parseInt(i) + 1) + selectOos1);
                                    return;
                                }
                            }
                        }
                    }
                    for(var i in this.arr){
                        if(this.arr[i].specname===this.prods[0].specname&&this.arr[i].option1===this.prods[0].option1&&this.arr[i].option2===this.prods[0].option2){
                            this.arr[i].number+=this.productNumber
                            this.calc_price_nocart();
                            //存数据
                            localStorage.setItem(this.localCart_data1, JSON.stringify(this.arr));
                            tools.show_msg(addcart);
                             //关闭模态框
                            $("#viewProduct").css("display","none")
                            return;
                        }
                    }

                    var sort=[]
               
                    for(var i in this.prods){
                        sort.push({
                            id: data.detail.id,
                            specname: this.prods[i].specname,
                            number: this.productNumber,
                            img: this.prods[i].img,
                            price: this.prods[i].price,
                            sku: this.prods[i].sku,
                            option1: this.prods[i].option1,
                            option2: this.prods[i].option2,
                            // allprice: this.prods[i].allprice
                        })
                        
                    }
                    this.arr.push({
                        //delId:i,
                        //gift:gifts, 
                        sort:sort, 
                    })

                    


                    // this.arr.push({
                    //     //gift:this.getProduct[0].gift,
                    //     id: data.detail.id,
                    //     specname: this.prods[0].specname,
                    //     number: this.productNumber,
                    //     img: this.prods[0].img,
                    //     price: this.prods[0].price,
                    //     sku: this.prods[0].sku,
                    //     option1: this.prods[0].option1,
                    //     option2: this.prods[0].option2,
                    //     // allprice: this.prods[i].allprice
                    // })

                    console.log(this.arr)

                }
                // 套餐
                if(num!==0){
                    for (var i in this.prods) {
                        var prod = this.prods[i];
                        if (!prod.id || !prod.sku || prod.price === 0) {
                            tools.show_msg(selectStr + (parseInt(i) + 1));
                            return;
                        }
                        //判断是否缺货
                        for (var j in this.detail.GoodsSpecs) {
                            var spec = this.detail.GoodsSpecs[j];
                            if (prod.sku === spec.id) {
                                if (spec.inventory === 0) {
                                    tools.show_msg(selectOos + (parseInt(i) + 1) + selectOos1);
                                    return;
                                }
                            }
                        }
                    }
                    
                    // console.log(this.current_manyoff)
                    
                    if (this.manyoff_arr) {
                        for (var i in this.gift_select) {
                            //var gifts = [];
                            for (var k in this.gift_select[i]) {
                                var prod = this.gift_select[i][k];
                                if (!prod.id || !prod.sku) {
                                    tools.show_msg(selectGiftStr + (parseInt(i) + 1));
                                    return;
                                }   
                            }
                        }
                    }

        
                    var gifts=[]
                    var sort=[]
                    gifts=gifts.concat.apply(gifts,this.gift_select)
                    
                    for(var i in this.prods){
                        sort.push({
                            id: data.detail.id,
                            specname: this.prods[i].specname,
                            number: this.productNumber,
                            img: this.prods[i].img,
                            price: this.prods[i].price,
                            sku: this.prods[i].sku,
                            option1: this.prods[i].option1,
                            option2: this.prods[i].option2,
                            // allprice: this.prods[i].allprice
                        })
                        
                    }
                    this.arr.push({
                        //delId:i,
                        gift:gifts, 
                        sort:sort, 
                    })


                    //console.log(this.prods)
                    //console.log(this.manyoff_arr)
                    console.log(this.arr)
                    
                    //console.log(this.current_manyoff)
                }
            
  
                    this.calc_price_nocart();
                    //存数据
                    localStorage.setItem(this.localCart_data1, JSON.stringify(this.arr));
                    if(this.prods.length>1){
                        this.prods=[];
                        this.add_spec();
                    }
                    //关闭模态框
                    $("#viewProduct").css("display","none")
                    tools.show_msg(addcart);
                    console.log(this.arr)
                    console.log(this.current_manyoff)
                
            },
            // 删除购物车订单
            removeCartItem(index){
                this.arr.splice(index,1);
                localStorage.setItem(this.localCart_data1, JSON.stringify(this.arr));
                this.calc_price_nocart();
                tools.show_msg(deleteCartPr);
            },
            closeOrder(){
                $("#orderForm").css("display","none");
                $("#page").css("display","block");

                //  打开立即抢购
                $("#buyFixed").css("display","block");
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
            getDisableState:function (item,index2,index1,option_index) {
                if(option_index==='1'){
                    return this.gift_select[index1][index2].specname !== item.name;
                }else{
                    return this.gift_select[index1][index2].specname !== item.name||this.gift_select[index1][index2].option1 !== item.option1;
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
            //计算价格
            calc_price_nocart: function () {
                this.allPrice = 0;
                this.manyoff_price = 0;
                this.saleoff_price = 0;
                this.realPrice = 0;
                for (var i in this.arr) {
                    var prod = this.arr[i];
                    this.allPrice += prod.price*prod.number;
                }
                let amountInfo={
                    order_price:this.allPrice,
                    goods_count: this.current_manyoff.count
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
                        if (amountInfo.goods_count === prom.count&&prom.price1>0) {
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
            }

            

           
            
        }
    });
}

