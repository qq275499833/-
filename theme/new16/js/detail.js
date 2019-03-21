
function refresh_prod_ul() {
    var cart_list_body=$("#cart_list_body");
    if(cart_list_body.length>0){
        cart_list_body.empty();
        for (var i in cart.getAllProduct()) {
            var prod = cart.getAllProduct()[i];
            for(var j in appData.goods.specs){
                var spec=appData.goods.specs[j];
                if(prod.sku===(spec.sku?spec.sku:spec.id)){
                    prod.option1=spec.option1;
                    prod.option2=spec.option2;
                    prod.specname=spec.name;
                    prod.img=spec.img;
                    prod.price=spec.price;
                }
            }
            prod.option1 = prod.option1 ? prod.option1 : '';
            prod.option2 = prod.option2 ? prod.option2 : '';
            var div='<div class="good-specDetail">';
            if(prod.img){
                div+='<div class="specImg fl"><img src="'+appData.imgpath+prod.img+'-101"></div>';
            }
           div+='<div class="specName fl"><div class="fl"><p class="specGoodName">'+prod.name+'</p><p class="specGood"><span>'+prod.specname+' '+prod.option1+' '+prod.option2+'</span></p>' +
               '<p class="specPrice">'+appData.money + prod.price+'</p></div></div><div class="fr numAdd">' +
               '<div class="specNum"><img src="http://static.seezt.cc/theme/jd/images/icon/14.png" onclick="sub_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')"><span class="prod_num">'+prod.number+'</span>' +
               '<img src="http://static.seezt.cc/theme/jd/images/icon/13.png" onclick="add_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')"></div>' +
               '<div class="edit" onclick="del_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')">'+deleteStr+'</div></div><div class="clearfix"></div></div>';
            //添加赠品显示
            if(prod.giftgoods){
                for(var n in prod.giftgoods){
                    var giftprod=prod.giftgoods[n];
                    var divgift = '<div class="good-specDetail">';
                    if(giftprod.img){
                        divgift+='<div class="specImg fl"><img src="'+appData.imgpath+giftprod.img+'-101"></div>';
                    }
                    divgift+='<div class="specName fl"><p class="fl"><p class="specGoodName">'+giftprod.name+'</p><p class="specGood"><span>'+
                        +giftprod.specname+' '+giftprod.option1+' '+giftprod.option2+'</span></p>' +
                        '<p class="specPrice">×'+giftprod.number+'</p></div><div class="fr numAdd"><div class="specNum"><span class="prod_num">'+giftStr+'</span>' +
                        '</div></div><div class="clearfix"></div></div>'

                    div += divgift;
                }
            }
            cart_list_body.append(div);
        }
    }
    calc_price();
    if(cart.getAllProduct().length===0){
        show_cartisempty();
    }
}
function order_list(){
    var order_goodslist = $('#order_goodslist');
    order_goodslist.empty();
    for (var i in cart.getAllProduct()) {
        var prod = cart.getAllProduct()[i];
        prod.option1 = prod.option1 ? prod.option1 : '';
        prod.option2 = prod.option2 ? prod.option2 : '';
        order_goodslist.append(' <div class="order-detail" ><div class="specImg lf">' +
            '<img  src="' + appData.imgpath + prod.img + '" alt="">' +
            '</div>' +
            '<div class="specName lf">' +
            '<div class="lf">' +
            '<p class="specGoodName">' + prod.name + '</p>' +
            '<p class="specGood">' +
            '<span>'+ prod.specname + prod.option1 +prod.option2 + '</span></p></div></div>' +
            '<div class="rt numAdd">' +
            '<div class="specNum orderNum">' +
            '×'+prod.number +
            '</div>' +
            ' <div class="edit orderPrice" >'+ appData.money+prod.price + '</div>' +
            '</div></div>');
    }
}

var countdown =appData.countdown;
if(countdown){
    $("#countdown").show();
    var int=setInterval(GetRTime, 1000);
}
function GetRTime() {
    var EndTime = new Date(Date.parse(countdown.replace(/-/g,"/")));
    EndTime.setDate(EndTime.getDate());
    var NowTime = new Date();
    var t = EndTime.getTime() - NowTime.getTime();
    if(t<=0){
        $("#countdown").hide();
        int=window.clearInterval(int);
    }else{
        var d = 0;
        var h = 0;
        var m = 0;
        var s = 0;
        if (t >= 0) {
            d = Math.floor(t / 1000 / 60 / 60 / 24);
            h = Math.floor(t / 1000 / 60 / 60 % 24);
            m = Math.floor(t / 1000 / 60 % 60);
            s = Math.floor(t / 1000 % 60);
        }
        $('#timeHour').text(h);
        $('#timeMin').text(m);
        $('#timeSec').text(s);
        $('#day').text(d);
    }

}
$(function () {
    $("#spec-goods2").text($("#spec-goods").text())
});
//购物车一级规格缺货
init_oos();