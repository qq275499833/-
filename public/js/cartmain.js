var ZXKF = {Cart:{},Data:{totalNumber:0,totalAmount:0,products:[]}};
ZXKF.Cart = function () {
    if (typeof ZXKF.Cart.single_instance === "undefined") {
        ZXKF.Cart.single_instance = this;
    }
    return ZXKF.Cart.single_instance;
};
ZXKF.Cart.prototype = {
    name:'seezt_cart',
    conditions:['sku'],
    //保存cart
    saveToCache: function () {
        localStorage.setItem(this.name, JSON.stringify(ZXKF.Data));
    },
    //获取cart
    getFromCache: function () {
        var cache = localStorage.getItem(this.name);
        if (cache !== null && cache !== "") {
            var data = JSON.parse(cache);
            if(data)ZXKF.Data=data;
        }
    },
    clearCart: function () {
        ZXKF.Data.totalNumber = 0;
        ZXKF.Data.totalAmount = 0;
        ZXKF.Data.products = [];
        this.saveToCache();
    },
    //显示数量
    showTotalNum: function () {
        var quant = cart.getQuantity();
        var carNum = $(".cartNum");
        carNum.text(quant.totalNumber);
        if (quant.totalNumber > 0){
            carNum.css("display", "inline-block");
        }
        else
            carNum.css("display", "none");
    },
    //添加商品
    addProduct: function (goods) {
        var exist_goodsthis = this.getProduct(goods);
        if (exist_goodsthis){
            exist_goodsthis.number += parseInt(goods.number);
            if(exist_goodsthis.giftgoods.length){
                for(var i in exist_goodsthis.giftgoods){
                    exist_goodsthis.giftgoods[i].number+=parseInt(goods.number);
                }
            }

        }else{
            ZXKF.Data.products.push(goods);
        }
        ZXKF.Data.totalNumber += parseInt(goods.number);
        ZXKF.Data.totalAmount += parseInt(goods.number) * parseFloat(goods.price);
        this.saveToCache();
        this.showTotalNum();
    },
    //获取购物车合计
    getQuantity: function () {
        return {
            totalNumber: ZXKF.Data.totalNumber,
            totalAmount: ZXKF.Data.totalAmount
        };
    },
    //获取购物车中的所有商品
    getAllProduct: function () {
        return ZXKF.Data.products;
    },
    //更新某个商品数量
    updateNumber: function (num, goods) {
        var goodsprod=goods.good;
        var temp=0;
        for (var i in ZXKF.Data.products) {
            if (ZXKF.Data.products[i].sku+''===goodsprod.sku+''){
                if(ZXKF.Data.products[i].giftgoods.length){
                    var arr=[];
                    for(var j in ZXKF.Data.products[i].giftgoods){
                        temp=ZXKF.Data.products[i].giftgoods.length;
                        for(var k in goodsprod.giftgoods){
                            if(ZXKF.Data.products[i].giftgoods[j].sku===goodsprod.giftgoods[k].sku){
                                arr.push(k);
                            }
                        }
                        if(arr.length===temp){
                            ZXKF.Data.totalNumber += parseInt(num);
                            ZXKF.Data.totalAmount += parseInt(num) * parseFloat(ZXKF.Data.products[i].price);
                            ZXKF.Data.products[i].number += parseInt(num);
                            for(var j in ZXKF.Data.products[i].giftgoods){
                                ZXKF.Data.products[i].giftgoods[j].number+= parseInt(num);
                            }
                            this.saveToCache();
                            this.showTotalNum();
                            break;
                        }
                    }
                }else{
                    ZXKF.Data.totalNumber += parseInt(num);
                    ZXKF.Data.totalAmount += parseInt(num) * parseFloat(ZXKF.Data.products[i].price);
                    ZXKF.Data.products[i].number += parseInt(num);
                    this.saveToCache();
                    this.showTotalNum();
                    break;
                }
            }
        }
    },
    //获取某个商品
    getProduct: function (goods) {
        var temp=0,arr=[];
        if(ZXKF.Data.products){
            for (var i in ZXKF.Data.products) {
                if (ZXKF.Data.products[i].sku+''===goods.sku+''){
                    if(ZXKF.Data.products[i].giftgoods.length){
                        for(var j in ZXKF.Data.products[i].giftgoods){
                            temp=ZXKF.Data.products[i].giftgoods.length;
                            for(var k in goods.giftgoods){
                                if(ZXKF.Data.products[i].giftgoods[j].sku===goods.giftgoods[k].sku){
                                    arr.push(k);
                                }
                            }
                            if(arr.length===temp){
                                return ZXKF.Data.products[i];
                            }
                        }
                    }else{
                        return ZXKF.Data.products[i];
                    }

                }
            }
        }
        return null;
    },
    //获取某个商品数量
    getProductNumber: function (goods) {
        var goodsprod=goods.good;
        var temp=0;
        for (var i in ZXKF.Data.products) {
            if (ZXKF.Data.products[i].sku+''===goodsprod.sku+''){
                if(ZXKF.Data.products[i].giftgoods.length){
                    var arr=[];
                    for(var j in ZXKF.Data.products[i].giftgoods){
                        temp=ZXKF.Data.products[i].giftgoods.length;
                        for(var k in goodsprod.giftgoods){
                            if(ZXKF.Data.products[i].giftgoods[j].sku===goodsprod.giftgoods[k].sku){
                                arr.push(k);
                            }
                        }
                        if(arr.length===temp){
                            return ZXKF.Data.products[i].number;
                        }
                    }
                }else{
                    return ZXKF.Data.products[i].number;
                }

            }
        }
        return null;
    },
    //是否存在某个商品
    existProduct: function (goods) {
        for (var i in ZXKF.Data.products) {
            if (ZXKF.Data.products[i].sku+''===goods.sku+'') return true;
        }
        return false;
    },
    //删除某个商品
    deleteProduct: function (goods) {
        var goodsprod=goods.good;
        var temp=0;
        for (var i in ZXKF.Data.products) {
            if (ZXKF.Data.products[i].sku+''===goodsprod.sku+'') {
                if(ZXKF.Data.products[i].giftgoods.length){
                    var arr=[];
                    for(var j in ZXKF.Data.products[i].giftgoods){
                        temp=ZXKF.Data.products[i].giftgoods.length;
                        for(var k in goodsprod.giftgoods){
                            if(ZXKF.Data.products[i].giftgoods[j].sku===goodsprod.giftgoods[k].sku){
                                arr.push(k);
                            }
                        }
                        if(arr.length===temp){
                            ZXKF.Data.totalNumber -= parseInt(ZXKF.Data.products[i].number);
                            ZXKF.Data.totalAmount -= parseInt(ZXKF.Data.products[i].number) * parseFloat(ZXKF.Data.products[i].price);
                            ZXKF.Data.products.splice(i, 1);
                            break;
                        }
                    }
                }else{
                    ZXKF.Data.totalNumber -= parseInt(ZXKF.Data.products[i].number);
                    ZXKF.Data.totalAmount -= parseInt(ZXKF.Data.products[i].number) * parseFloat(ZXKF.Data.products[i].price);
                    ZXKF.Data.products.splice(i, 1);
                    break;
                }


            }
        }
        this.saveToCache();
        this.showTotalNum();
    }
};
var cart = new ZXKF.Cart();