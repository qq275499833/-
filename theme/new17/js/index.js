if(appData.goods.manyoff.length>0){
    var pop=$("#pop").empty();
    for(var i in appData.goods.manyoff){
        var item=appData.goods.manyoff[i];
        pop.append('<span class="pop_border" onclick="sel_count('+item.salecount+',this)">'+item.name+'</span>');
    }
}
function sel_count(k,ele){
    $(ele).addClass("active").siblings().removeClass("active");
    var len=appData.prods.length;
    var length=k-len;
    if(length>0){
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
    }else if(length===0){
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
    }else{
        var j=Math.abs(length);
        var a=$("div.product_item");
        a.splice(a.length-j,j);
        $("#product-spec").html(a);
        appData.prods.splice( appData.prods.length-j,j);
        calc_price_nocart();
    }

}
//单页一级规格缺货
// init_nocart_oos();
