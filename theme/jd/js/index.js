//---------------------购物车赠品功能开始--------------------------
//1.初始化赠品数组
function refresh_prod_ul() {
    /*将赠品赋值*/
    var cart_list_body=$("#goods_list");
    if(cart_list_body.length>0){
        cart_list_body.empty();
        for (var i in cart.getAllProduct()) {
            var prod = cart.getAllProduct()[i];
            for(var j in appData.goods.specs){
                var spec=appData.goods.specs[j];
                if(prod.sku+''===spec.id+''){
                    prod.option1=spec.option1;
                    prod.option2=spec.option2;
                    prod.specname=spec.name;
                    prod.img=spec.img;
                    prod.price=spec.price;
                }
            }
            prod.option1 = prod.option1 ? prod.option1 : '';
            prod.option2 = prod.option2 ? prod.option2 : '';
            var div= '<div class="goods">';
            if(prod.img){
                div+='<div class="goods_name"><img src="'+appData.imgpath+prod.img+'-101"></div>';
            }
            div+='<div class="goods_spec"><div>'+prod.name+'</div><div><span>'+prod.specname+' '+prod.option1+' '+prod.option2+'</span></div>'+
                '<div class="am-text-danger">'+appData.money + prod.price+'</div></div>'+
                '<a href="javascript:void(0);" onclick="del_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')" class="del_btn">'+deleteStr+'</a>'+
                '<div class="goods_count"><a href="javascript:void(0);" onclick="sub_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')">-</a>'+
                '<span class="prod_num">'+prod.number+'</span>'+
                '<a href="javascript:void(0);" onclick="add_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')">+</a></div></div>';
             //添加赠品显示
            for(var n in prod.giftgoods){
               var giftprod=prod.giftgoods[n];
                var divgift = '<div class="goods">';
                if(giftprod.img){
                    divgift+='<div class="goods_name" style="float:left;"><img src="'+appData.imgpath+giftprod.img+'-101"></div>';
                }
                divgift+='<div class="goods_spec"><div>'+giftprod.name+'</div><div><span>'+giftprod.specname+' '+giftprod.option1+' '+giftprod.option2+'</span></div>'+
                    '<div class="am-text-danger">×'+giftprod.number+'</div></div>'+
                    '<div class="goods_count">'+
                    '<span class="prod_num">'+giftStr+'</span>'+
                    '</div></div>';
                div += divgift;
            }
            //添加赠品显示结束
            cart_list_body.append(div);
        }
    }
    calc_price();
    if(cart.getAllProduct().length===0){
        show_cartisempty();
    }
}
//---------------------购物车赠品功能结束--------------------------
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
    }else {
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
//购物车一级规格缺货
init_oos();

