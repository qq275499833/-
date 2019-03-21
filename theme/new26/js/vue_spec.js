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
            mark:1,
            check:1,//0
            extrapay:'',
            flag2:3,
            flag1:1,
            //本地存储的数组名称
            stgSitedir_A: data.detail.sitedir + 'l',
            stgSitedir_B: data.detail.sitedir + 'm',
            //只能点击一次
            click_one: true,
            discount_num: '',
            value: '',
            mn1: false,
            detail: data.detail,
            cdnbase: data.cdnbase,
            prods: [{
                id: data.detail.id,
                name: data.detail.name,
                specname: '',
                sku: '',
                price: 0,
                img: '',
                number: 0,
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
            allPrice: 0,
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
            com1: [],
            com2: [],
            com3: [],
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
            // item: JSON.parse(data.detail.manyoff)[0].salecount,
            steps1: false,
            steps2: false,
            steps3: false,
            chang_label: '',
            //选购id
            choose_id: '',
            // 限量选购id
            limited_id: 0,
            num: 0,
            // choose_id:
            selectedgoods1: "",
            selectedgoods2: '',
            //购物车承接数组
            arr: [],
            //限量选购数组
            limited_arr: [],
            all_money: 0,
            selection: 0,
            isAble:false,
            area:{},
            city:{},
            opt1_index:0,
            opt2_index:0,
            opt1_list:[],
            opt2_list:[],
            opt1:0,
            opt2:0,
            flag:false,
            test1:[]
        },
        watch: {
            arr: function (a1) {
            }
        },
        created: function () {
            if((data.detail.manyoff)[0].salecount){
                this.choose_id= JSON.parse(data.detail.manyoff)[0].salecount;
            }else{
                this.choose_id='';
            };
            //动态改变高度
            this.changH();
            //选择城市
            this.init_Select_City(this.detail.money, null, 'city');
            //页面加载取数据
            if (JSON.parse(localStorage.getItem(this.stgSitedir_A)) !== null) {
                this.arr = JSON.parse(localStorage.getItem(this.stgSitedir_A));
            }
            if (JSON.parse(localStorage.getItem(this.stgSitedir_B)) !== null) {
                this.limited_arr = JSON.parse(localStorage.getItem(this.stgSitedir_B));
            }
            this.calc_price_nocart();
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
                for (var i = 1; i < this.detail.specs.name_list.length; i++) {
                    this.add_spec();
                }
        },
        methods: {
            changH(){
                if( this.detail.GoodsSpecs.length>8){
                   $('.choose_buy_bounced1').css('max-height','800px');
                }else {
                    // $('.choose_buy_bounced').css('min-height','550px');
                }
            },
            //抢购模态框函数
            add_order(e) {
                $('.shop_model').css('display', 'block');
                $('.home_zixun_fixed').css('display', 'none');
                this.choose_id = e.target.dataset.id;
            },
            //右侧购物车图标点击显示模态框
            cart_order() {
                if (this.arr.length > 0 || this.limited_arr.length > 0) {
                    $('.cart_modal').css('display', 'block');
                    $('.home_zixun_fixed').css('display', 'none');

                } else {
                    //请选择商品
                    tools.show_msg(selectStr);
                    document.getElementById("shop").scrollIntoView(true);
                }
            },
            //限量抢购函数
            choose(e) {
                $('.limited').css('display', 'block');
                $('.home_zixun_fixed').css('display', 'none');
                this.limited_id = e.target.dataset.id;
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
                this.prods[num-1].specname = item.name;
                this.prods[num-1].img = item.img;
                this.prods[num-1].option1="";
                this.prods[num-1].option2="";
                // this.prods[num-1].price = "";
                // this.prods[num-1].sku = "";
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
                                this.opt1_list=option1_list;
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
                this.opt2=0;
                this.prods[num-1].option1 = item.option1;
                this.prods[num-1].option2="";
                // this.prods[num-1].price = "";
                // this.prods[num-1].sku = "";
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
            //限量抢购删除函数
            limited_close_spec(index) {
                if (this.limited_arr.length > 0) {
                    this.all_money = this.all_money - this.limited_arr[index].allprice;
                    this.limited_arr.splice(index, 1);
                    //删除成功
                    tools.show_msg(delete_success);
                }
                localStorage.setItem(this.stgSitedir_B, JSON.stringify(this.limited_arr));
            },
            //计算价格
            calc_price_nocart: function () {
                var saleoff_price = 0;
                if (this.arr != null) {
                    for (var i = 0; i < this.arr.length; i++) {
                        saleoff_price += this.arr[i].price;
                        this.all_money = saleoff_price;
                    }
                }
                if (this.limited_arr != null) {
                    for (var i = 0; i < this.limited_arr.length; i++) {
                        saleoff_price += this.limited_arr[i].price*this.limited_arr[i].number;
                        this.all_money = saleoff_price;
                    }
                }
            },
            submit_order_nocart() {
                if (submiting) return;
                var cartinfo = [];
                for (var i in this.arr) {
                    for (var j in this.arr[i].selected) {
                        var prod = this.arr[i];
                        cartinfo.push({
                            id: prod.id,
                            sku: prod.selected[j].sku,
                            img: prod.selected[j].img,
                            sitedir: appData.sitedir,
                            number: prod.salecount,
                            manyoff:this.manyoff
                        });
                    }
                }
                for (var i in this.limited_arr) {
                    var prod = this.limited_arr[i];
                    cartinfo.push({
                        id: prod.id,
                        sku: prod.sku,
                        img: prod.img,
                        sitedir: appData.sitedir,
                        number: prod.number,
                    });
                }
                // var map = {}, mergeCartinfo = [];
                // for(var i = 0; i < cartinfo.length; i++){
                //     var ai = cartinfo[i];
                //     if(!map[ai.sku]){
                //         mergeCartinfo.push({
                //             id: ai.id,
                //             sku: ai.sku,
                //             img: ai.img,
                //             sitedir: ai.sitedir,
                //             number:ai.number,
                //         });
                //         map[ai.sku] = ai;
                //     }else{
                //         for(var j = 0; j < mergeCartinfo.length; j++){
                //             var dj = mergeCartinfo[j];
                //             if(dj.sku === ai.sku){
                //                 dj.number+=ai.number;
                //                 break;
                //             }
                //         }
                //     }
                // }
                var otherPhone = /^([0-9]+)$/;
                var name=/^\s*$/;
                this.clientinfo.remoteMoney = this.extrapay?this.extrapay:0;
                if(!this.clientinfo.clientname||name.test(this.clientinfo.clientname)){
                    $('#clientname').focus();
                    return tools.show_msg(nameStr);
                }
                if (!this.clientinfo.clientphone || this.clientinfo.clientphone === ' ') {
                    $('#clientphone').focus();
                    return tools.show_msg(PhoneStr);
                }
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
                    url: '/createOrder',
                    contentType: "application/json",
                    data: JSON.stringify({
                        goodsinfo: {sitedir:appData.sitedir,redirect_sitedir:appData.redirect_sitedir,is_domain:appData.is_domain},
                        cartinfo: cartinfo,
                        clientinfo: this.clientinfo,
                        manyoffArr:this.arr,
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
                                        value: this.all_money,
                                        currency: currency
                                    });
                                }
                                if (typeof run_sale_code === "function") {
                                    run_sale_code();
                                }
                                this.clientinfo = {
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
                                this.steps1 = false;
                                this.steps2 = false;
                                this.steps3 = false;
                                $('.order_details').css('display', 'block');
                                $('.model').css('display', 'none');
                                $('#introduce').css('display', 'none');
                                $('.index').css('display', 'none');
                                //删除数据
                                localStorage.removeItem(this.stgSitedir_A);
                                localStorage.removeItem(this.stgSitedir_B);
                            })
                        }
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
            getValue:function(){
                var that = this;
                var checked = document.getElementById("remote");
                if(checked.checked){
                    that.flag1 = 1;
                }else{
                    that.flag1 = 0;
                }
            },
            //关闭订单信息
            close_orderinfo: function () {
                this.expressinfo = "";
                $('.find-btn').removeAttr('disabled').removeClass("disabled");
                this.orders = [];
            },
            //new26立即结算
            immediately_Buy() {

                if (this.arr.length > 0 || this.limited_arr.length > 0) {
                    $('.model').css('display', 'block');
                    $('.cart_modal').css('display', 'none');
                    $('.home_zixun_fixed').css('display', 'none');
                    this.steps1 = true;
                } else {
                    tools.show_msg(selectStr);
                    this.close_page();
                    document.getElementById("shop").scrollIntoView(true);
                }
            },
            //查看商品清单
            shop_show() {
                $('.cart_modal').css('display', 'block');
                $('.model').css('display', 'none');
                this.steps1 = false;
            },
            //步骤一下一步
            steps1_next() {
                this.steps1 = false;
                this.steps2 = true;
            },
            steps2_next() {
                    this.one_submit();
            },
            steps3_next() {
                this.submit_order_nocart();
            },
            //步骤一上一步
            steps1_back() {
                this.shop_show();
            },
            steps2_back() {
                this.steps1 = true;
                this.steps2 = false;
                this.steps3 = false;
            },
            steps3_back() {
                this.steps1 = false;
                this.steps2 = true;
                this.steps3 = false;
            },
            //关闭加入购物车模态框
            close_page() {
                this.opt1=0;
                this.opt2=0;
                this.selection=0;
                $("#select1").find("option:first").prop("selected", true);
                $("#select2").find("option:first").prop("selected", true);
                $("#select3").find("option:first").prop("selected", true);
                $("select").find("option:first").prop("selected", true);
                $(':text').attr('placeholder', '');
                $('.model_header').parent().parent().css('display', 'none');
                this.steps1 = false;
                this.steps2 = false;
                this.steps3 = false;
                this.clientinfo = {
                    clientname: "",
                    clientphone: "",
                    clientaddress: "",
                    clientemail: "",
                    clientzipcode: "",
                    city: "",
                    area: "",
                    clientotherinfo: "",
                };
                for (var i = 0; i < this.prods.length; i++) {
                    this.prods[i].id = data.detail.id;
                    this.prods[i].specname = '';
                    this.prods[i].number = 0;
                    this.prods[i].img = '';
                    this.prods[i].price = '';
                    this.prods[i].sku = '';
                }
                $('.home_zixun_fixed').css('display', 'block');
            },
            test(e) {
                this.chang_label = e.target.dataset.index;
            },
            //第二步骤，只判断收货地址信息
            one_submit() {
                var name=/^\s*$/;
                var otherPhone = /^([0-9-]+)$/;
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
                if (this.detail.money !== '￥' && this.detail.money !== 'S$') {
                    if (this.clientinfo.city === '城市' || this.clientinfo.city === 'Province' || this.clientinfo.city === 'จังหวัด' || this.clientinfo.city === '区域' || this.clientinfo.city === undefined||this.clientinfo.city === ""||this.clientinfo.city ==='都道府県を選択') {
                        $('#city').focus();
                        return tools.show_msg(cityStr);
                    }
                    if (this.clientinfo.area === '区县' || this.clientinfo.area === '區縣' || this.clientinfo.area === 'City' || this.clientinfo.area === 'เมือง' || this.clientinfo.area === '區' || this.clientinfo.area === undefined||this.clientinfo.area === "") {
                        $('#area').focus();
                        return tools.show_msg(areaStr);
                    }
                }
                else {
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
                    this.steps1 = false;
                    this.steps2 = false;
                    this.steps3 = true;


            },
            //选购弹出框事件
            /*e:当前点击的事件对象
            *item1:当前商品的信息
            * item:当前manyoff信息
             * index:manyoff循环的下标
              * */
            choose_buy(e, item1, item, index) {
                this.num=0;
                // e.target.onblur = function () {
                    // that.num= Number(e.target.value);
                    if (item.salecount !== undefined) {
                        if (this.num > item.salecount) {
                            //请选购()件商品，目前已选购()件商品
                            tools.show_msg(Please_choose_buy + '  '+item.salecount+'  ' + shop + '  '+that.num+'  ' + piece);
                            for (var i = 0; i < that.prods.length; i++) {
                                this.prods[i].specname = '';
                                this.prods[i].number = 0;
                                this.prods[i].img = '';
                                this.prods[i].price = '';
                                this.prods[i].sku = '';
                                this.prods[i].id = data.detail.id;
                            }
                            $("select").find("option:first").prop("selected", true);
                            this.num = 0;
                        } else {
                            // if(item1.inventory==0){
                            //     this.isAble=true;
                            // }else{
                            //     this.isAble=false;
                                this.prods[index].specname = item1.name;
                                this.prods[index].number = Number(e.target.value);
                                this.prods[index].img = item1.img;
                                this.prods[index].price = item1.price;
                                this.prods[index].sku = item1.id;
                                this.prods[index].id = data.detail.id;
                                for (var i = 0; i < this.prods.length; i++) {
                                    this.num+=this.prods[i].number;
                                }
                            // }
                        }
                    }
                // };
            },
            //加入购物车
            add_cart(item) {
                if(this.num>0){
                    if (this.num < item.salecount) {
                        // 请至少选购()件商品，目前已选购()件商品
                        tools.show_msg(least +'  '+item.salecount+'  ' + shop + '  '+this.num+'  ' + piece);
                        $("select").find("option:first").prop("selected", true);
                        for (var i = 0; i < this.prods.length; i++) {
                            this.prods[i].specname = '';
                            this.prods[i].number = 0;
                            this.prods[i].img = '';
                            this.prods[i].price = '';
                            this.prods[i].sku = '';
                            this.prods[i].id = this.detail.id;
                        }
                        this.num = 0;
                        // return;
                    }else if(this.num > item.salecount){
                        // 请选购()件商品，目前已选购()件商品
                        tools.show_msg(Please_choose_buy +'  '+ item.salecount+'  ' + shop +' '+ this.num +'  '+ piece);
                        for (var i = 0; i < this.prods.length; i++) {
                            this.prods[i].specname = '';
                            this.prods[i].number = 0;
                            this.prods[i].img = '';
                            this.prods[i].price = '';
                            this.prods[i].sku = '';
                            this.prods[i].id = this.detail.id;
                        }
                        $("select").find("option:first").prop("selected", true);
                        this.num = 0;
                    }else{
                        for (var i in this.prods) {
                            if (this.prods[i].specname !== '' && this.prods[i].number !== 0) {
                                this.transitArr.push({
                                    specname: this.prods[i].specname,
                                    number: this.prods[i].number,
                                    img: this.prods[i].img,
                                    price: this.prods[i].price,
                                    sku: this.prods[i].sku,
                                    allprice: 0
                                });
                            }
                        }
                        this.arr.push({
                            id: data.detail.id,
                            name: item.name,
                            price: item.price,
                            salecount: item.salecount,
                            selected: this.transitArr
                        });
                        this.calc_price_nocart();
                        localStorage.setItem(this.stgSitedir_A, JSON.stringify(this.arr));
                        this.transitArr = [];
                        $("select").find("option:first").prop("selected", true);
                        this.num = 0;
                        //加入购物车成功
                        tools.show_msg(Add_cart);
                        this.close_page();
                    }

                }else if(this.num===0){
                    tools.show_msg(selectStr);
                }
            },
            //限量选购
            limited_buy(e, item, index) {
                this.prods[index].specname = item.name;
                this.prods[index].number = Number(e.target.value);
                this.prods[index].img = item.img;
                this.prods[index].price = item.price;
                this.prods[index].sku = item.id;
                this.prods[index].id = data.detail.id;
                this.prods[index].allprice = Number(e.target.value) * item.price;
            },
            limited_opt1(e,index){
              this.opt1_index=index;
            },
            limited_opt2(e,index){
                this.opt2_index=index;
            },
            //限量购物车
            limited_add_buy(item) {
               if(item.inventory===0){
                   tools.show_msg(selectOos1);
               }else{
                   if (parseInt(this.selection) !== 0) {

                       for (var i in this.prods) {
                               if (this.prods[i].specname !== '') {
                                   if(this.detail.specs.option2_list.length===0&&this.detail.specs.option1_list.length>0){
                                       if(this.prods[i].option1 === ''){
                                           tools.show_msg(selectSize);
                                           return;
                                       }else{
                                           this.limited_arr.push({
                                               id: data.detail.id,
                                               specname: this.prods[i].specname,
                                               number: this.prods[i].number,
                                               img: this.prods[i].img,
                                               price: this.prods[i].price,
                                               sku: this.prods[i].sku,
                                               allprice: this.prods[i].allprice,
                                               option1:this.prods[i].option1,
                                               option2:this.prods[i].option2,
                                           });
                                       }
                                   }
                                   if(this.detail.specs.option2_list.length>0&&this.detail.specs.option1_list.length>0){
                                       if(this.prods[i].option1 === ''||this.prods[i].option2 === ''){
                                           tools.show_msg(selectSize);
                                           return;
                                       }else{
                                           this.limited_arr.push({
                                               id: data.detail.id,
                                               specname: this.prods[i].specname,
                                               number: this.prods[i].number,
                                               img: this.prods[i].img,
                                               price: this.prods[i].price,
                                               sku: this.prods[i].sku,
                                               allprice: this.prods[i].allprice,
                                               option1:this.prods[i].option1,
                                               option2:this.prods[i].option2,
                                           });
                                       }
                                   }
                                   if(this.detail.specs.option2_list.length===0&&this.detail.specs.option1_list.length===0){
                                       this.limited_arr.push({
                                           id: data.detail.id,
                                           specname: this.prods[i].specname,
                                           number: this.prods[i].number,
                                           img: this.prods[i].img,
                                           price: this.prods[i].price,
                                           sku: this.prods[i].sku,
                                           allprice: this.prods[i].allprice,
                                           option1:this.prods[i].option1,
                                           option2:this.prods[i].option2,
                                       });
                                   }
                           }
                       }
                       this.calc_price_nocart();
                       //存数据
                       localStorage.setItem(this.stgSitedir_B, JSON.stringify(this.limited_arr));
                       this.transitArr = [];
                       $("#select1").find("option:first").prop("selected", true);
                       $("#select2").find("option:first").prop("selected", true);
                       $("#select3").find("option:first").prop("selected", true);
                       this.num = 0;
                       //加入购物车成功
                       tools.show_msg(Add_cart);
                       this.close_page();
                       // this.add_spec();
                   }else{
                       tools.show_msg(selectStr);
                   }
                   this.selection = 0;
                   this.opt1 = 0;
                   this.opt2 = 0;
               }

            },
        //    返回首页
            go_index(){
                this.arr=[];
                this.limited_arr=[];
                $('.order_details').css('display', 'none');
                $('.index').css('display', 'block');
                $('.home_zixun_fixed').css('display', 'block');
                $('.home_photo').css('display', 'block');
                document.getElementById("introduce").scrollIntoView(true);
            }
        }
    });
}

