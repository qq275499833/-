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
            service:""
        },
        created: function () {
            this.$nextTick(() => { //等待dom同步后打开模态框
                this.Package_price=this.manyoff[0].price;
            });
            setInterval(this.GetRTime,1000);
            //倒计时
            if(this.d ==0 && this.h==0 && this.m==0 && this.s ==0){
                clearInterval(this.GetRTime);
            }
            this.getPurchaseInfo();
            this.scorll_height();
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
            //判断manyoff起卖件数
            this.Switch_package(this.item,this.giftCount);
            //默认选中一级规格
            for (var i in this.name_list) {
                var spec = this.name_list[i];
                if (spec.isdefault === 1) {
                    this.select_specitem_nocart(spec, 1);
                    break;
                }
            }

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
                $.get('/pageData/'+this.detail.sitedir+'?id='+this.detail.about_id+'&type=1').success(function(data){
                    if (!data.Error) {
                        app.$nextTick(function () {
                            this.about=data.page.body;
                        });
                    }
                });
                $.get('/pageData/'+this.detail.sitedir+'?id='+this.detail.contact_id+'&type=2').success(function(data){
                    if (!data.Error) {
                        app.$nextTick(function () {
                            this.contact=data.page.body;
                        });
                    }
                });
                $.get('/pageData/'+this.detail.sitedir+'?id='+this.detail.privacy_id+'&type=3').success(function(data){
                    if (!data.Error) {
                        app.$nextTick(function () {
                            this.privacy=data.page.body;
                        });
                    }
                });
                $.get('/pageData/'+this.detail.sitedir+'?id='+this.detail.terms_id+'&type=4').success(function(data){
                    if (!data.Error) {
                        app.$nextTick(function () {
                            this.terms=data.page.body;
                        });
                    }
                });
                $.get('/pageData/'+this.detail.sitedir+'?id='+this.detail.service_id+'&type=5').success(function(data){
                    if (!data.Error) {
                        app.$nextTick(function () {
                            this.terms=data.page.body;
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
            // 赠品二级数组去重并重新排列
            check_giftoption1_repeat(list,index1,num) {
                var templist = [];
                var option1list = [];
                if (this.giftSelect[index1][num-1].specname) {
                    for (var i in list) {
                        if (list[i].name === this.giftSelect[index1][num-1].specname) {
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
                return templist;
            },
            // 赠品三级数组去重并重新排列
            check_giftoption2_repeat(list,index1,num) {
                var templist = [];
                var option2list = [];
                if (this.giftSelect[index1][num-1].option1&&this.giftSelect[index1][num-1].specname) {
                    for (let i in list) {
                        if (list[i].name === this.giftSelect[index1][num-1].specname&&list[i].option1 === this.giftSelect[index1][num-1].option1) {
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
                return templist;
            },
            //赠品一级规格点击事件
            select_giftspec:function(item,giftindex,index){
                this.giftSelect[giftindex][index - 1].specname = item.name;
                this.giftSelect[giftindex][index - 1].img = item.img;
                this.giftSelect[giftindex][index - 1].option1="";
                this.giftSelect[giftindex][index - 1].option2="";
                this.giftSelect[giftindex][index - 1].price ="";
                this.giftSelect[giftindex][index - 1].sku = "";
                if(this.detail.giftGoodsSpecs[giftindex].giftOption1_list.length===0) {
                    this.giftSelect[giftindex][index - 1].price = item.price;
                    this.giftSelect[giftindex][index - 1].sku = item.id;
                }else{
                    var arr=[],giftOption1_list=[];
                    for(var i in this.giftGoodsSpec){
                        for(var j in this.giftGoodsSpec[i]){
                            if(this.giftSelect[giftindex][index - 1].specname===this.giftGoodsSpec[i][j].name){
                                if (giftOption1_list.indexOf(this.giftGoodsSpec[i][j].option1) < 0) {
                                    arr.push(j);
                                    giftOption1_list.push(this.giftGoodsSpec[i][j].option1);
                                }
                            }
                        }
                    }
                    if(arr.length===1){
                        this.select_giftoption1(this.giftGoodsSpec[giftindex][arr[0]],giftindex,index);
                        arr=null;
                    }
                }
            },
            //赠品二级规格选中和禁用事件
            check_giftOption1_active:function(item,giftindex,index){
                item.templist2= this.check_giftoption1_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                if(item.templist2){
                    for(var i in item.templist2) {
                        if(this.giftSelect[giftindex][index-1].option1 === item.option1 && this.giftSelect[giftindex][index-1].specname === item.templist2[i].name){
                            return true;
                        }
                    }
                }
            },
            check_giftOption1_disable:function(item,giftindex,index){
                item.templist2= this.check_giftoption1_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                if(item.templist2){
                    for(var i in item.templist2){
                        if(item.templist2[i].name===this.giftSelect[giftindex][index-1].specname&&item.templist2[i].option1===item.option1){
                            return false;
                        }
                    }
                    return true;
                }
            },
            //赠品二级规格点击事件
            select_giftoption1:function(item,giftindex,index){
                this.giftSelect[giftindex][index - 1].option1=item.option1;
                this.giftSelect[giftindex][index - 1].option2="";
                this.giftSelect[giftindex][index - 1].price ="";
                this.giftSelect[giftindex][index - 1].sku = "";
                if(this.detail.giftGoodsSpecs[giftindex].giftOption2_list.length===0){
                    item.templist1= this.check_giftoption1_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                    for(var i in item.templist1){
                        if(item.templist1[i].name===this.giftSelect[giftindex][index - 1].specname && item.templist1[i].option1===this.giftSelect[giftindex][index - 1].option1){
                            this.giftSelect[giftindex][index - 1].price = item.templist1[i].price;
                            this.giftSelect[giftindex][index - 1].sku = item.templist1[i].id;
                        }
                    }
                }else{
                    var arr=[],giftOption2_list=[];
                    for(var i in this.giftGoodsSpec){
                        for(var j in this.giftGoodsSpec[i]){
                            if(this.giftSelect[giftindex][index - 1].option1===this.giftGoodsSpec[i][j].option1 && this.giftSelect[giftindex][index - 1].specname===this.giftGoodsSpec[i][j].name){
                                if (giftOption2_list.indexOf(this.giftGoodsSpec[i][j].option2) < 0) {
                                    arr.push(j);
                                    giftOption2_list.push(this.giftGoodsSpec[i][j].option2);
                                }
                            }
                        }
                    }
                    if(arr.length===1){
                        this.select_giftoption2(this.giftGoodsSpec[giftindex][arr[0]],giftindex,index);
                        arr=null;
                    }
                }
            },
            //赠品三级规格选中和禁用事件
            check_giftOption2_active:function(item,giftindex,index){
                item.templist1= this.check_giftoption2_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                if(item.templist1){
                    for(var i in item.templist1) {
                        if(this.giftSelect[giftindex][index-1].option1 === item.templist1[i].option1 && this.giftSelect[giftindex][index-1].specname === item.templist1[i].name&&this.giftSelect[giftindex][index-1].option2 === item.option2){
                            return true;
                        }
                    }
                }
            },
            check_giftOption2_disable:function(item,giftindex,index){
                item.templist1= this.check_giftoption2_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                if(item.templist1){
                    for(var i in item.templist1){
                        if(item.templist1[i].name===this.giftSelect[giftindex][index-1].specname&&item.templist1[i].option1===this.giftSelect[giftindex][index-1].option1&&item.templist1[i].option2===item.option2){
                            return false;
                        }
                    }
                    return true;
                }
            },
            //赠品三级规格点击事件
            select_giftoption2:function(item,giftindex,index){
                this.giftSelect[giftindex][index - 1].option2=item.option2;
                item.templist2= this.check_giftoption2_repeat(this.detail.giftGoods[giftindex].GoodsSpecs,giftindex,index);
                for(var i in item.templist2){
                    if(item.templist2[i].name===this.giftSelect[giftindex][index - 1].specname && item.templist2[i].option1===this.giftSelect[giftindex][index - 1].option1 && item.templist2[i].option2===this.giftSelect[giftindex][index - 1].option2){
                        this.giftSelect[giftindex][index - 1].price = item.templist2[i].price;
                        this.giftSelect[giftindex][index - 1].sku = item.templist2[i].id;
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
            //删除某一件
            close_spec: function () {
                this.prods.splice(this.prods.length - 1, 1);
                this.getProduct.splice(this.getProduct.length - 1, 1);
                this.calc_price_nocart();
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
                if(this.detail.giftGoodsIds&&this.giftLength){
                    for(var i in this.giftSelect){
                        var gifts=[];
                        for(var k in this.giftSelect[i]){
                            var prod = this.giftSelect[i][k];
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
                }
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
                    if (this.clientinfo.city === '城市' || this.clientinfo.city === 'Province' || this.clientinfo.city === 'จังหวัด' || this.clientinfo.city === '区域' || this.clientinfo.city === undefined || this.clientinfo.city === "") {
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
                        cartinfo: mergeCartinfo,
                        giftCartinfo:giftCartinfo,
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
                            })
                        }
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
            //评价特效
            evaluation_scroll(){
                let pjcon1 = $("#pjcon1");
                let pjcon2 = $("#pjcon2");
                if(pjcon2 === undefined){
                    return;
                }else if(pjcon2.length>0){
                    this.pj1 = pjcon2.offsetHeight;
                    this.pj2 -= 2;
                    pjcon1.css('marginTop',this.pj2+'px');
                    if(this.pj2 <= -this.pj1){
                        this.pj2= 0;
                        this.commentList.push(this.commentList[0]);
                        this.commentList.shift();
                        pjcon1.css('marginTop','0px');
                    }
                }
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
            //关闭订单信息
            close_orderinfo: function () {
                this.expressinfo = "";
                $('.find-btn').removeAttr('disabled').removeClass("disabled");
                this.orders = [];
            },
            go_back(){
                $('.success_modal').css('display','none');

            },
            scorll_order(){
                document.getElementById("order").scrollIntoView(true);
            },
            scorll_height(){
                $(document).scroll(function(){   //页面加载时，获取滚动条初始高度
                    var distance = $(document).scrollTop();  //获取滚动条初始高度的值 ：0
                    var introduceH=$('#introduce').height();
                    // var goodsH=$('.goods_reviews').height();
                    if(distance >introduceH) {  //当滚动条高度为0时
                        $('.pay').css('display','none');
                    } else {
                        $('.pay').css('display','block');
                    }
                });
            },
            //商品属性、动态添加class
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
            //商品属性、动态添加class
            Switch_package(index,giftcount,price) {
                this.Package_price=price;
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
                if(giftcount && this.giftSelect[0]){
                    this.giftLength=giftcount;
                    var giftlen=this.giftSelect[0].length;
                    var temp=giftcount-giftlen;
                    if(temp>0){
                        for(var i=0;i<parseInt(temp);i++){
                            for(var k in this.giftSelect){
                                this.giftSelect[k].push({
                                    id: this.giftSelect[k][0].id,
                                    sitename:this.giftSelect[k][0].sitename,
                                    specname: '',
                                    sku: '',
                                    price: 0,
                                    img: '',
                                    option1: '',
                                    option2: '',
                                    number: 1
                                });
                            }
                        }
                    }else if(temp<0){
                        var j=Math.abs(temp);
                        for(var k in this.giftSelect){
                            this.giftSelect[k].splice( this.giftSelect[k].length-j,j);
                        }
                    }else{
                        this.giftSelect;
                    }
                    //赠品默认选中一级规格
                    if(this.giftSelect[0].length){
                        for(var i in this.giftGoodsSpec){
                            for(var j in this.giftGoodsSpec[i]){
                                var giftspec=this.giftGoodsSpec[i][j];
                                if(giftspec.isdefault===1){
                                    for(var k=1;k<=this.giftLength;k++){
                                        this.select_giftspec(giftspec,i,k);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

