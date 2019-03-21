$(".kf_list").hide();
var show_kflist_timer;
var kf_isshow= false;
function show_kflist() {
    if(kf_isshow) {
        $(".kf_list").hide();
        kf_isshow = false;
        clearTimeout(show_kflist_timer);
    }
    else{
        $('.kf_list').show();
        kf_isshow = true;
        show_kflist_timer = setTimeout(function () {
            $('.kf_list').hide();
        }, 10000);
    }
}
function add_cartOpen(){
    $("#cartWin").removeClass("hide");
    $("#detailPage").addClass("hide");
    add_cart(1);
}
function searchOrder(){
   $("#successWin").addClass("hide");
   $("#searchBox").removeClass("hide");
   $("#successWin").css('display','none');
}
function gobankDetail(){
    $("#searchBox").addClass("hide");
    /*$("#detailPage").addClass("");*/
}
function backUpPage(){
    $("#cartWin").addClass("hide");
    $("#cartWin").css('display','none');
    $("#detailPage").removeClass("hide");
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
    var item = null;
    $.each(appData.goods.specs,function (index, spec) {
        if(spec.id === appData.selectProd.sku){
            item = spec;
            return false;
        }
    });
    if(!item) return false;
    if(hidemsg){
        var goods = cart.getProduct({sku: appData.selectProd.sku});
        if(goods){
            show_cartwin();
            return;
        }
    }
    appData.addnum = parseInt($('#addnum').val())?parseInt($('#addnum').val()):parseInt($('#addnum').text());
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
        number: appData.addnum
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
                //show_Cart();
                show_cartwin1();
                layer.close(index);
            }
        });
    }
}
function  show_cartwin1(){
    add_cart(1);
    $(".wrap").addClass("hide");
    $("#confirmOrderPage").removeClass("hide");
    refresh_prod_ul();
}
function openPcConfirmPage(){
    add_cart();

    /*add_cart(1);*/
    /*$(".wrap").addClass("hide");
    $("#confirmOrderPage").removeClass("hide");
    refresh_prod_ul();*/


}
function show_successwin(){
    /*pc*/
    $("#orderSuccess").removeClass("hide");
    $("#confirmOrderPage").addClass("hide");
    /*手机端*/
    $("#confirmOrderPage").addClass("hide");
    /*$("#orderSuccess").removeClass("hide");*/
    $("#successWin").removeClass("hide");
    $("#successWin").css("display","block");
    $("#successWin").css("left","0");

}
function gobackDetail(){
    $("#confirmOrderPage").addClass("hide");
    $(".wrap").removeClass("hide");
    $("#specWin").css("display","block");
    $("#addnum").val(appData.addnum);
}
function searchOpen(){
    $(".wrap").addClass("hide");
    $("#confirmOrderPage").addClass("hide");
    $("#orderSuccess").addClass("hide");
    $(".result_show").removeClass("hide");
}
function goDetail(){
    $(".result_show").addClass("hide");
    $(".wrap").removeClass("hide");
    $("#searchBox").addClass("hide");
}
function opendetailPhone(){
    $("#successWin").addClass("hide");
    $(".wrap").removeClass("hide");
}
$(".kf_list").hide();
var show_kflist_timer;
var kf_isshow= false;
function show_kflist() {
    if(kf_isshow) {
        $(".kf_list").hide();
        kf_isshow = false;
        clearTimeout(show_kflist_timer);
    }
    else{
        $('.kf_list').show();
        kf_isshow = true;
        show_kflist_timer = setTimeout(function () {
            $('.kf_list').hide();
        }, 10000);
    }
}
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
            cart_list_body.append('<div class="" style="overflow:hidden;margin-bottom:10px;">' +
                '<div class="confirmImg"><img src="'+appData.imgpath+prod.img+'-101" style="width:100%;height:100%;border-radius: 2px;vertical-align: top;"></div>'+
                '<div class="confirmImgMess"><span>'+prod.specname+' '+prod.option1+' '+prod.option2+'</span>' +
                '<div style="text-align: right;">'+
                '<div class="specNum" style="width:70px;float:right;"><img src="http://static.seezt.cc/theme/jd/images/icon/14.png" onclick="sub_prod('+prod.sku+')" style="width:20px;float:left;"><span class="prod_num" style="float:left;width:20px;">'+prod.number+'</span>' +
                '<img src="http://static.seezt.cc/theme/jd/images/icon/13.png" onclick="add_prod('+prod.sku+')" style="width:20px;"></div>' +
                '<div style="position:relative;top:36px;left:66px;" class="edit" onclick="del_prod('+prod.sku+')">'+deleteStr+'</div></div><div class="clearfix"></div></div>'


            );

            /*
            * <div class="tab-detail">
              <p id="goods_price">{{detail.money}} <span>{{detail.price}}</span></p>
                 <div class="num fr">
                                            <div onclick="decNum()" class="less fl">-</div>
                                            <input class="num_text fl" type="text" value="1" name="num" id="addnum1">
                                            <div onclick="addNum()" class="more fl">+</div>
                                        </div>
                                    </div>

                                     /*'<div class="specNum"><img src="http://static.seezt.cc/theme/jd/images/icon/14.png" onclick="sub_prod('+prod.sku+')"><span class="prod_num">'+prod.number+'</span>' +
                '<img src="http://static.seezt.cc/theme/jd/images/icon/13.png" onclick="add_prod('+prod.sku+')"></div>' +
                '<div class="edit" onclick="del_prod('+prod.sku+')">'+deleteStr+'</div></div><div class="clearfix"></div></div>'*/
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
            ' <p class="specGoodName">' + prod.name + '</p>' +
            '<p class="specGood">' +
            '<span>'+ prod.specname + prod.option1 +prod.option2 + '</span></p></div></div>' +
            ' <div class="rt numAdd">' +
            '<div class="specNum orderNum">' +
            '×'+prod.number +
            '</div>' +
            ' <div class="edit orderPrice" >'+ appData.money+prod.price + '</div>' +
            '</div></div>');
    }
}


var countdown =appData.countdown;
function GetRTime() {
    var EndTime = new Date(Date.parse(countdown.replace(/-/g,"/")));
    EndTime.setDate(EndTime.getDate());
    var NowTime = new Date();
    var t = EndTime.getTime() - NowTime.getTime();
    if(t<=0){
        $("#timer").hide();
        clearInterval(setInterval(GetRTime));

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
if(countdown){
    $("#timer").show();
    setInterval(GetRTime, 1000);
}


$(function () {
    $("#spec-goods2").text($("#spec-goods").text())
});