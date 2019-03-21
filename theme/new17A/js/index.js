appData.giftSelect={};
if(appData.giftGoodsIds){
    for (var i=0;i< appData.giftGoodsIds.length;i++){
        var giftid=appData.giftGoodsIds[i].id;
        var gift=[{
            id: giftid,
            specname: '',
            sku: '',
            price: 0,
            img: '',
            option1: '',
            option2: '',
            number: 1
        }];
        appData.giftSelect[i]=gift;
    }
}
if(appData.goods.manyoff.length>0){
    var pop=$("#pop").empty();
    for(var i in appData.goods.manyoff){
        var item=appData.goods.manyoff[i];
        pop.append('<span class="pop_border" onclick="sel_count('+item.salecount+','+item.giftcount+',this)">'+item.name+'</span>');
    }
}

function sel_count(k,giftcount,ele){
    $(ele).addClass("active").siblings().removeClass("active");
    var len=appData.prods.length;
    var length=k-len;
    if(length>=0){
        for(var i=0;i<parseInt(length);i++){
            add_goodsinfo();
            add_spec(true);
            //一级规格判断缺货
            init_nocart_oos();
            //默认选中一级规格
            var product_item = $(".product_item");
            var length1 = parseInt(product_item.length);
            var isdefault = 0;
            for (var k in appData.goods.specs) {
                var spec = appData.goods.specs[k];
                if (spec.isdefault) {
                    isdefault = spec.isdefault;
                    var sku = spec.id;
                    var items = product_item.eq(length1 - 1).find(".opt1");
                    $.each(items, function (index, span) {
                        if ($(span).data("id") === sku) {
                            $(this).click();
                            return false;
                        }
                    })
                }
            }
        }
    }else{
        var j=Math.abs(length);
        var a=$("div.product_item");
        a.splice(a.length-j,j);
        $("#product-spec").html(a);
        appData.prods.splice( appData.prods.length-j,j);
        calc_price_nocart();
    }
    if(giftcount && appData.giftSelect[0]){
        var giftlen=appData.giftSelect[0].length;
        $("#gifts").show();
        var temp=giftcount-giftlen;
        if(temp>0){
            for(var i=0;i<parseInt(temp);i++){
                for(var k in appData.giftSelect){
                    appData.giftSelect[k].push({
                        id: appData.giftSelect[k][0].id,
                        specname: '',
                        sku: '',
                        price: 0,
                        img: '',
                        option1: '',
                        option2: '',
                        number: 1
                    });
                }
                add_giftsSpec(true);

            }
        }else{
            var j=Math.abs(temp);
            var a=$("div.gifts");
            a.splice(a.length-j,j);
            $("#gifts").html(a);
            for(var k in appData.giftSelect){
                appData.giftSelect[k].splice( appData.giftSelect[k].length-j,j);
            }
            updateGift_class();
        }
    }else{
        $("#gifts").hide();
    }
}
var gifthtml=$("#gifts").html();
var gifts_item=$(".gifts_item");
if(appData.giftGoodsIds){
    for (var i in appData.giftGoodsIds){
        gifts_item.eq(i).find(".user-name>.opt1").attr("onclick", "select_giftspec(this,"+i+",1)");
        gifts_item.eq(i).find(".option1>.opt2").attr("onclick", "select_giftoption1(this,"+i+",1)");
        gifts_item.eq(i).find(".option2>.opt3").attr("onclick", "select_giftoption2(this,"+i+",1)");
    }
    defaultSelected();
}
//添加规格
function add_giftsSpec(hideclose) {
    if (hideclose) {
        $("#gifts").append(gifthtml);
    }
    updateGift_class();
    defaultSelected();
}
//更新id
function updateGift_class() {
    var product_item = $(".gifts");
    var length = parseInt(product_item.length);
    appData.index = length;
    product_item.eq(length - 1).find(".spec_Title span").text(appData.index);
    for (var i in appData.giftGoodsIds){
        product_item.eq(length - 1).children().eq(i).find(".user-name").attr("id", "gift_names_"+i+"_"+appData.index);
        product_item.eq(length - 1).children().eq(i).find(".option1").attr("id", "gift_option1_"+i+"_"+appData.index);
        product_item.eq(length - 1).children().eq(i).find(".option2").attr("id", "gift_option2_"+i+"_"+appData.index);
        product_item.eq(length - 1).children().eq(i).find(".user-name>.opt1").attr("onclick", "select_giftspec(this,"+i+"," + appData.index + ")");
        product_item.eq(length - 1).children().eq(i).find(".option1>.opt2").attr("onclick", "select_giftoption1(this,"+i+"," + appData.index + ")");
        product_item.eq(length - 1).children().eq(i).find(".option2>.opt3").attr("onclick", "select_giftoption2(this,"+i+"," + appData.index + ")");
    }
}
//赠品一级规格点击事件
function select_giftspec(ele,giftindex, index) {
    var specEle = $(ele);
    if (appData.giftSelect[giftindex][index-1].specname === specEle.data("name"))
        return;
    appData.giftSelect[giftindex][index - 1].specname = specEle.data("name");
    appData.giftSelect[giftindex][index - 1].img = specEle.data("img");
    specEle.siblings('.opt1').removeClass('active');
    specEle.addClass('active');
    var items = $('#gift_option1_'+giftindex+'_' + index + '>.opt2');
    if (items.length > 0) {
        items.removeClass('active');
        items.addClass('disable');
        for (var i in appData.gifts[giftindex]) {
            var spec = appData.gifts[giftindex][i];
            if (spec.name + '' === appData.giftSelect[giftindex][index - 1].specname + '') {
                $.each(items, function (J, span) {
                    if ($(span).data("name") + '' === spec.option1 + '') {
                        var item = $(items[J]);
                        item.data('price', spec.price);
                        item.data('sku', spec.id);
                        item.removeClass('disable');
                    }
                });
            }
        }
        var option1_li = $(items.not('.disable'));
        if (option1_li.length === 0) {
            appData.giftSelect[giftindex][index - 1].sku = specEle.data("sku");
            appData.giftSelect[giftindex][index - 1].price = specEle.data("price");
        } else if (option1_li.length === 1) {
            appData.giftSelect[giftindex][index - 1].sku = '';
            appData.giftSelect[giftindex][index - 1].option1 = '';
            option1_li.click();
            return false;
        } else {
            appData.giftSelect[giftindex][index - 1].sku = '';
            appData.giftSelect[giftindex][index - 1].option1 = '';
        }
        var option2_li = $('#gift_option2_'+giftindex+'_' + index + '>.opt3');
        option2_li.removeClass('active');
        option2_li.addClass('disable');
    } else {
        appData.giftSelect[giftindex][index - 1].sku = specEle.data("sku");
        appData.giftSelect[giftindex][index - 1].price = specEle.data("price");
    }
}
//赠品二级规格点击事件
function select_giftoption1(ele,giftindex, index) {
    var optionEle = $(ele);
    if (appData.giftSelect[giftindex][index - 1].option1 === optionEle.data("name"))
        return;
    if (optionEle.hasClass('disable'))
        return;
    optionEle.siblings(".opt2").removeClass('active');
    optionEle.addClass('active');
    appData.giftSelect[giftindex][index - 1].option1 = optionEle.data("name");
    appData.giftSelect[giftindex][index - 1].sku = optionEle.data("sku");
    var items = $('#gift_option2_'+giftindex+'_' + index + '>.opt3');
    if (items.length > 0) {
        items.removeClass('active');
        items.addClass('disable');
        for (var i in appData.gifts[giftindex]) {
            var spec =appData.gifts[giftindex][i];
            if (spec.name + '' === appData.giftSelect[giftindex][index - 1].specname + '' &&
                spec.option1 + '' === appData.giftSelect[giftindex][index - 1].option1 + '') {
                $.each(items, function (J, span) {
                    if ($(span).data("name") + '' === spec.option2 + '') {
                        var item = $(items[J]);
                        item.data('price', spec.price);
                        item.data('sku', spec.id);
                        item.removeClass('disable');
                    }
                });
            }
        }
        var option2_li = $(items.not('.disable'));
        if (option2_li.length === 0) {
            appData.giftSelect[giftindex][index - 1].price = optionEle.data("price");
            appData.giftSelect[giftindex][index - 1].sku = optionEle.data("sku");
        } else if (option2_li.length === 1) {
            appData.giftSelect[giftindex][index - 1].sku = '';
            appData.giftSelect[giftindex][index - 1].option2 = '';
            option2_li.click();
            return false;
        } else {
            appData.giftSelect[giftindex][index - 1].sku = '';
            appData.giftSelect[giftindex][index - 1].option2 = '';
        }
    } else {
        $.each(appData.gifts, function (i, spec) {
            if (spec.name + '' === '' + appData.giftSelect[giftindex][index - 1].specname &&
                spec.option1 + '' === '' + appData.giftSelect[giftindex][index - 1].option1) {
                appData.giftSelect[giftindex][index - 1].price = spec.price;
                return false;
            }
        });
    }
}

function select_giftoption2(ele,giftindex, index) {
    var optionEle = $(ele);
    if (appData.giftSelect[giftindex][index - 1].option2 === optionEle.data("name"))
        return;
    if (optionEle.hasClass('disable'))
        return;
    optionEle.siblings('.opt3').removeClass('active');
    optionEle.addClass('active');
    appData.giftSelect[giftindex][index - 1].option2 = optionEle.data("name");
    appData.giftSelect[giftindex][index - 1].sku = optionEle.data("sku");
    $.each(appData.gifts[giftindex], function (i, spec) {
        if (spec.name + '' === appData.giftSelect[giftindex][index - 1].specname + '' &&
            spec.option1 + '' === appData.giftSelect[giftindex][index - 1].option1 + '' &&
            spec.option2 + '' === appData.giftSelect[giftindex][index - 1].option2 + '') {
            appData.giftSelect[giftindex][index - 1].price = spec.price;
            return false;
        }
    });
}
function defaultSelected(){
    //默认选中一级规格
    var gifts = $(".gifts");
    var length = parseInt(gifts.length);
    var isdefault = 0;
    for (var i in appData.gifts) {
        for(var j in appData.gifts[i]){
            var spec = appData.gifts[i][j];
            if (spec.isdefault) {
                isdefault = spec.isdefault;
                var sku = spec.id;
                var items = gifts.eq(length - 1).children().eq(i).find(".opt1");
                $.each(items, function (index, span) {
                    if ($(span).data("id") === sku) {
                        $(this).click();
                        return false;
                    }
                })
            }
        }
    }
}
//单页一级规格缺货
init_nocart_oos();