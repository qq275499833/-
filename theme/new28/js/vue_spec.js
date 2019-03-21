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
            t: 0,
            d: 0,
            h: 0,
            m: 0,
            s: 0,
            d1: 0,
            h1: 0,
            m1: 0,
            s1: 0,
            d2: 0,
            h2: 0,
            m2: 0,
            s2: 0,
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
                money: 0
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
            steps1: false,
            steps2: false,
            steps3: false,
            chang_label: '',
            //选购id
            choose_id: JSON.parse(data.detail.manyoff)[0].salecount,
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
            count: false,
            area:{},
            city:{}
        },
        created: function () {
            setInterval(this.GetRTime, 1000);
            if (this.d == 0 && this.h == 0 && this.m == 0 && this.s == 0) {
                clearInterval(this.GetRTime);
            }
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
            if (this.manyoff.length > 0) {
                for (var i = 1; i < this.detail.specs.name_list.length; i++) {
                    this.add_spec();
                }
            }
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
            show_kf() {
                this.count = !this.count;
                if (this.count) {
                    $('.details_countdown').css({
                        'border-bottom': '1px solid #ddd',
                        'margin-bottom': '10px'
                    });
                } else {
                    $('.details_countdown').css({
                        'border-bottom': '',
                        'margin-bottom': ''
                    });
                }
            },
            changH() {
                if (this.detail.GoodsSpecs.length > 8) {
                    $('.choose_buy_bounced1').css('max-height', '800px');
                } else {
                    // $('.choose_buy_bounced').css('min-height','550px');
                }
            },
            //抢购模态框函数
            add_order(e) {
                $('.shop_model').css('display', 'block');
                $('.home_zixun_fixed').css('display', 'none');
                // this.choose_id = e.target.dataset.id;
            },
            //右侧购物车图标点击显示模态框
            cart_order() {
                document.getElementById("shop").scrollIntoView(true);
            },
            //限量抢购函数
            choose(e) {
                $('.limited').css('display', 'block');
                $('.home_zixun_fixed').css('display', 'none');
                this.limited_id = e.target.dataset.id;
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
                    money: 0
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
            //计算价格
            calc_price_nocart: function () {
                this.allPrice = 0;
                this.manyoff_price = 0;
                this.saleoff_price = 0;
                this.realPrice = 0;
                this.all_money=0;
                for (var i in this.arr) {
                    var prod = this.arr[i];
                    this.all_money += prod.price;
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
                    if (this.clientinfo.city === '城市' || this.clientinfo.city === 'Province' || this.clientinfo.city === 'จังหวัด' || this.clientinfo.city === '区域' || this.clientinfo.city === undefined || this.clientinfo.city === ''||this.clientinfo.city ==='都道府県を選択') {
                        $('#city').focus();
                        return tools.show_msg(cityStr);
                    }
                    if (this.clientinfo.area === '区县' || this.clientinfo.area === '區縣' || this.clientinfo.area === 'City' || this.clientinfo.area === 'เมือง' || this.clientinfo.area === '區' || this.clientinfo.area === undefined || this.clientinfo.area === '') {
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
                                this.cartinfo = {
                                    clientname: "",
                                    clientphone: "",
                                    clientaddress: "",
                                    clientemail: "",
                                    clientzipcode: "",
                                    city: "",
                                    area: "",
                                    clientotherinfo: ""
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
                                $('.head_nav').css('display', 'none');
                            })
                        }
                    }
                });
                //删除数据
                localStorage.removeItem(this.stgSitedir_A);
                localStorage.removeItem(this.stgSitedir_B);
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
                                                    that.flag1 = 1;that.extrapay =0;

                                                }else if(data1.cityMess.cityinfo.isArrive === 0){
                                                    that.flag2 = 0;
                                                    that.flag1 = 0;
                                                    that.extrapay =0;
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
            //关闭订单信息
            close_orderinfo: function () {
                this.expressinfo = "";
                $('.find-btn').removeAttr('disabled').removeClass("disabled");
                this.orders = [];
            },
            //new28立即结算
            immediately_Buy() {
                if (this.arr.length > 0) {
                    this.submit_order_nocart();

                } else {
                    tools.show_msg(selectStr);
                    document.getElementById("shop").scrollIntoView(true);
                }
            },
            test(e) {
                this.chang_label = e.target.dataset.index;
            },
            //加入购物车
            add_cart(item, shop, e) {
                if (shop.inventory == 0) {
                    tools.show_msg(selectOos1);
                } else {
                    if (e.target.localName === 'a') {
                        e.target.innerText = '已加入';
                        e.target.classList.add("change_bg");
                        app.timeout1(e)
                    } else {
                        e.target.parentElement.classList.add("change_bg");
                        e.target.parentElement.innerText = '已加入';
                        app.timeout2(e)
                    }

                    this.getProduct.push({
                        specname: this.detail.GoodsSpecs[0].name,
                        number: 1,
                        img: this.detail.GoodsSpecs[0].img,
                        price: this.detail.GoodsSpecs[0].price,
                        sku: this.detail.GoodsSpecs[0].id,
                        allprice: 0
                    });
                    this.arr.push({
                        id: data.detail.id,
                        name: item.name,
                        price: item.price,
                        salecount: item.salecount,
                        selected: this.getProduct
                    });
                    this.calc_price_nocart();
                    localStorage.setItem(this.stgSitedir_A, JSON.stringify(this.arr));
                    // localStorage.removeItem("shop_Data");
                    this.getProduct = [];
                    this.num = 0;
                    //加入购物车成功
                    tools.show_msg(Add_cart);
                }
                // setTimeout(this.add_cart_bg(e),2000);

            },
            timeout1(e) {
                setTimeout(() => {
                    e.target.classList.remove("change_bg");
                    e.target.innerHTML = '<i :data-id="[[index]]" class="shopping_cart" ></i>' + choose_buy;
                }, 1000);
            },
            timeout2(e) {
                setTimeout(() => {
                    e.target.parent().classList.remove("change_bg");
                    e.target.classList.remove("change_bg");
                    e.target.parent().innerHTML = '<i :data-id="[[index]]" class="shopping_cart" ></i>' + choose_buy;
                }, 1000);
            },
            //    返回首页
            go_index() {
                this.arr = [];
                this.limited_arr = [];
                $('.order_details').css('display', 'none');
                $('.index').css('display', 'block');
                $('.home_zixun_fixed').css('display', 'block');
                $('.home_photo').css('display', 'block');
                document.getElementById("introduce").scrollIntoView(true);
                $('.head_nav').css('display', 'block');
                location.reload();
            }
        }
    });
}

