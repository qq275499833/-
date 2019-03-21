

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
        data: {
            mark:1,
            check:0,
            extrapay:'',
            flag2:3,
            flag1:1,
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
            giftGoodsSpec:data.detail.giftGoodsSpecsStr?JSON.parse(data.detail.giftGoodsSpecsStr):"",
            priceoff: data.detail.priceoff ? JSON.parse(data.detail.priceoff) : "",
            moneyprice: 0,
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
            giftLength:0,
            giftSelect:[],
            area:{},
            city:{}
        },
        created: function () {
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
            }else{
                //判断起卖件数是否有赠品
                for(var i in this.manyoff){
                    var item=this.manyoff[i];
                    if(item.salecount===1&&this.detail.gifts){
                        this.giftLength=item.giftcount;
                        if(this.giftLength){
                            var temp=this.giftLength-(this.giftSelect[0].length);
                            if(temp>0) {
                                for (var j = 0; j < parseInt(temp); j++) {
                                    for (var k in this.giftSelect) {
                                        this.giftSelect[k].push({
                                            id: this.giftSelect[k][0].id,
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
                            }
                            break;
                        }
                    }
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
            //赠品默认选中一级规格
            for(var i in this.giftGoodsSpec){
                for(var j in this.giftGoodsSpec[i]){
                    var giftspec=this.giftGoodsSpec[i][j];
                    if(giftspec.isdefault===1){
                        this.select_giftspec(giftspec,i,1);
                    }
                }
            }
        },
        methods: {

        }
    });
}