$(function(){
    $("#top").click(function() {
        $("html,body").animate({scrollTop:0}, 500);
    });
});


function addtocart(hidemsg, pro) {
    var dataDom = $(pro.parentNode.parentNode);
    appData.selectProd.name = dataDom.data("name");
    appData.selectProd.sku = dataDom.data("id");
    appData.selectProd.price = dataDom.data("price");
    appData.selectProd.img=dataDom.data("img");
    var item = null;
    $.each(appData.goods.specs, function (index, spec) {
        if (spec.id === appData.selectProd.sku) {
            item = spec;
            return false;
        }
    });
    if (!item) return false;
    var goods = cart.getProduct({sku: appData.selectProd.sku});
    if (goods) {
        show_cartwin();
        return;
    } else {
        appData.addnum = parseInt($('#addnum').val());
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
            number: 1,
            giftgoods:[]
        });
    }
    show_Cart();
}
function refresh_prod_ul() {
    var cart_list_body = $("#cart-items");
    if (cart_list_body.length > 0) {
        cart_list_body.empty();
        if(initCart()){
            for (var i in initCart().products) {
                var prod = initCart().products[i];
                cart_list_body.append(
                    '<tr>' +
                    '<td id="prodname"><div><span>' + prod.name +'['+prod.specname+'] </span></div></td>' +
                    '<td class="text-center">' + appData.money + prod.price + '</td>' +
                    '<td class="text-right padding-right-20">' + prod.number + '</td>' +
                    '<td class="text-center">' + prod.price * prod.number + '</td>' +
                    '<td class="text-center padding-right-20">' +
                    '<span onclick="del_prod(' +JSON.stringify(prod).replace(/"/g, '&quot;')+ ')" class="delBtn text-center">' +
                    '<span class="glyphicon glyphicon-trash"></span> ' +
                    '</span>' +
                    '</td>' +
                    '</tr>'
                );
            }
        }

    }
    calc_price();
}

function show_cartwin(){
    refresh_prod_ul();
}
function show_successwin(){
    closeAll();
    $('.sec3').removeClass('disappear');

}
var intDiff = parseInt(500000); //倒计时总秒数量

function timer(intDiff) {
    window.setInterval(function () {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0, //时间默认值
            msecond = 0;
        if (intDiff > 0) {
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            msecond = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        if (msecond <= 9) msecond = '0' + msecond;

        $('.days').html(day);
        $('.hours').html(hour);
        $('.minutes').html(minute);
        $('.seconds').html(second);
        intDiff--;
    }, 1000);
}

$(function () {
    timer(intDiff);
});

function closeAll() {
    $('.sec1').addClass('disappear');
    $('.sec2').addClass('disappear');
    $('.sec3').addClass('disappear');
}
function initCart(){
    var cartInfo = JSON.parse(localStorage.getItem(appData.sitedir));
    return cartInfo;
}
function go_cart() {
    document.getElementById("cart").scrollIntoView(true);
    $(".buyPart").css("margin-top","90px");
}