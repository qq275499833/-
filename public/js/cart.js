function init_cart() {
    cart.name = appData.sitedir;
    cart.getFromCache();
    cart.showTotalNum();
}
function decNum(){
    appData.addnum>1?appData.addnum-=1:appData.addnum = 1;
    $('#addnum').val(appData.addnum);
}
function addNum(){
    appData.addnum+=1;
    $('#addnum').val(appData.addnum);

}
function add_cart(hidemsg) {
    if(!appData.selectProd.sku||appData.selectProd.sku===''){
        if(!appData.selectProd.name){
            return tools.show_msg(selectStr+appData.option1);
        }
        if(!appData.selectProd.option1){
            return tools.show_msg(selectStr+appData.option2);
        }
        if(!appData.selectProd.option2){
            return tools.show_msg(selectStr+appData.option3);
        }
    }
    for(var j in appData.goods.specs){
        var spec=appData.goods.specs[j];
        if(appData.selectProd.sku===spec.id){
            if(spec.inventory===0){
                tools.show_msg(selectOos);
                return;
            }
        }
    }
    var giftArray = [];
    //    赠品加入购物车
    for(var i=0;i<appData.giftSelect.length;i++){
        for(var j=0;j<appData.giftSelect[i].length;j++){
            var giftprod=appData.giftSelect[i][j];
            if(!giftprod.id||!giftprod.sku){
                tools.show_msg(selectGiftStr+(parseInt(i)+1));
                return;
            }
            giftArray.push({
                contantGoods: appData.selectProd.sku,
                id:appData.giftSelect[i][j].id,
                img:appData.giftSelect[i][j].img,
                number:appData.addnum,
                option1:appData.giftSelect[i][j].option1,
                option2:appData.giftSelect[i][j].option2,
                price:appData.giftSelect[i][j].price,
                sku:appData.giftSelect[i][j].sku,
                specname:appData.giftSelect[i][j].specname,
                name:appData.giftSelect[i][j].name

            })
        }
    }
    var item = null;
    $.each(appData.goods.specs,function (index, spec) {
        if(spec.id === appData.selectProd.sku){
            item = spec;
            return false;
        }
    });
    if(!item) return false;
    if(hidemsg){
        var goods = cart.getProduct({sku: appData.selectProd.sku,giftgoods:giftArray});
        if(goods){
            show_cartwin();
            return;
        }
    }
    appData.addnum = parseInt($('#addnum').val())?parseInt($('#addnum').val()):parseInt($('#addnum').text());
    if (typeof fbq === "function") {
        fbq('track', 'AddToCart');
    }
    cart.addProduct({
        id: appData.goods.id,
        sourceid: appData.goods.sourceid,
        userkey: appData.goods.userkey,
        name: appData.goods.name,
        specname: item.name,
        sku: appData.selectProd.sku,
        price: item.price,
        img: appData.selectProd.img,
        option1: item.option1,
        option2: item.option2,
        number: appData.addnum,
        giftgoods:giftArray
    });
    $("#selected_spec").html(item.name+" "+item.option1+" "+item.option2);
    if(hidemsg){
        show_Cart();
    }else{
        $('#addnum').val(1);
        layer.open({
            title:false,
            content: confirmContent
            ,btn: [ btn1,btn2]
            ,yes: function(index){
                show_Cart();
                layer.close(index);
            }
        });
    }
}
function clear_cart() {
    cart.clearCart();
    refresh_prod_ul();
}
function show_Cart() {
    if(cart.getAllProduct().length>0){
        show_cartwin();
    }
}
function sub_prod(good) {
    var oldnum = cart.getProductNumber({good:good});
    if (oldnum -1 > 0) {
        cart.updateNumber(-1, {good:good});
    } else {
        cart.deleteProduct({good:good});
    }
    refresh_prod_ul();
}
function add_prod(good) {
    cart.updateNumber(1, {good:good});
    refresh_prod_ul();
}
function del_prod(good) {
    cart.deleteProduct({good:good});
    refresh_prod_ul();
}