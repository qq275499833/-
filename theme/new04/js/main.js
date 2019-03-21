function init_LocalSelect(lang) {
    var language = lang;
    if (appData.language === 'tw') {
        opt0 = ["國家/地區", "城市", "區縣"];
    } else if (appData.language === 'hk') {
        opt0 = ["國家/地區", "城市", "區縣"];
    } else if (appData.language === 'my') {
        opt0 = ["國家/地區", "城市", "区县"];
    } else if (appData.language === 'cn') {
        opt0 = ["國家/地區", "城市", "区县"];
    } else if (appData.language === 'sg') {
        opt0 = ["國家/地區", "城市", "区县"];
    } else if (appData.language === 'en') {
        opt0 = ["國家/地區", "province", "city"];
    }else if (appData.language === 'th') {
        opt0 = ["國家/地區", "province", "city"];
    }
    if (appData.money === 'RM') {
        language='my';
    }
    try{showarea('clientzipcode');preselect(language);}catch(ex){}
}
function init_swiper() {
    new Swiper ('.swiper-container', {
        loop: true,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    });
}
function init_cart() {
    cart.name = appData.sitedir;
    cart.getFromCache();
    cart.showTotalNum();
}
    //点击箭头关闭当前页面
    function arrows(){
            $('#myModal').css('display','none');
            $('#cartWin').css('display','none');
            $('.details').css('display','block');
    }
    //返回凑单
    function backDetails(){
            $('#myModal').css('display','none');
            $('#cartWin').css('display','none');
    }
    //返回订单页
    function backOrder(){
            $('.details').css('display','block');
            $('.success').css('display','none');
            $('#myModal').css('display','none');

    }
    //点击按钮关闭购物车
    function closeCart(){
            $('#myModal').css('display','none')
    }
var tools = {
    showMsg:function (info, time) {
        if(typeof(layer.tab) === 'function') {
            layer.msg(info);
        }else{
            layer.open({
                content: info,
                skin: 'msg',
                time: time || 2
            });
        }
    },
    showError:function (info, time) {
        if(typeof(layer.tab) === 'function') {
            layer.msg("<span style='color:#f44;'>"+info+"</span>");
        }else{
            layer.open({
                content: "<span style='color:#f44;'>"+info+"</span>",
                skin: 'msg',
                time: time || 4
            });
        }
    },
    showLoading:function (info, time) {
        if(typeof(layer.tab) === 'function') {
            layer.load(2, {time:(time || 15) * 1000});
        }else{
            layer.open({
                type: 2,
                shadeClose: false,
                content: info||'加载中',
                time: time || 15
            });
        }
    },
    showWin:function(content) {

        $("body,html").scrollTop(0).addClass("no-scroll");
        $(content).show();
    },

    // 关闭弹窗
    closeWin:function(con){
        $("html,body").removeClass("no-scroll");
        $(con).hide();
    },
    closeAll:function () {
        layer.closeAll();
    }
};
function show_SpecWin(){
    tools.showWin("#specWin","450px");
    hide_CartWin();
    hide_SuccessWin();
}
function hide_SpecWin(){
    tools.closeWin("#specWin");
}
function show_CartWin(){
    refresh_prod_ul();
    tools.showWin("#cartWin",'100%');
    hide_SpecWin();
    hide_SuccessWin();


}
function hide_CartWin(){
    tools.closeWin("#cartWin");
}
function show_SuccessWin(){
    tools.showWin("#successWin",'100%');
    hide_SpecWin();
    hide_CartWin();
}
function hide_SuccessWin(){
    tools.closeWin("#successWin");
}
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
        }, 1000*8);
    }
}
//主规格选中事件
function select_specitem(ele) {
    var specEle = $(ele);
    if(appData.selectProd.name === specEle.data("name"))//判断是否已经选择此主规格
        return;
    appData.selectProd.name = specEle.data("name");//把主规格名称赋值给已选规格对象中
    specEle.siblings('button').removeClass('active');//清除其他已选择的主规格
    specEle.addClass('active');//把当前点击的主规格选中
    var items = $('.option1>button');//获取子级规格1的列表 option1
    if(items.length >0){//如果有子级规格1
        items.removeClass('active');//清除已选择的子级规格1
        items.addClass('disable');//灰掉所有子级规格1
        for(var i in appData.goods.specs){//循环全部规格列表
            var spec =appData.goods.specs[i];
            if(spec.name+'' === appData.selectProd.name+''){//判断主规格名
                $.each(items,function (index, span) {//循环所有子级规格1
                    if($(span).text()+'' === spec.option1+''){//判断寻找当前子级规格
                        var item = $(items[index]);
                        item.data('sku',spec.id);//加入sku到元素
                        item.data('price',spec.price);//加入价格到元素
                        item.removeClass('disable');//去掉disable
                    }
                });
            }
        }
        var option1_li = $(items.not('.disable'));
        if(option1_li.length===0){//如果有可用的子级规格1
            appData.selectProd.sku = specEle.data("sku");//把sku赋值到已选择规格对象中
            appData.selectProd.price = specEle.data("price");//把价格赋值到已选择规格对象中
            $('#goods_price').text(appData.money + ' ' + appData.selectProd.price);//把价格更新到网页div中
        }else{
            appData.selectProd.sku = '';
            appData.selectProd.option1 = '';
        }
        var option2_li = $('.option2>btn');//获取子级规格2的列表
        option2_li.removeClass('active');//清除已选择的子级规格2
        option2_li.addClass('disable');//灰掉所有子级规格2
    }else{//如果没有子级规格1
        appData.selectProd.sku = specEle.data("sku");//把sku赋值到已选择规格对象中
        appData.selectProd.price = specEle.data("price");//把价格赋值到已选择规格对象中
        $('#goods_price').text(appData.money + ' ' + appData.selectProd.price);//把价格更新到网页div中
    }
    appData.selectProd.img = specEle.data('img');//把img更新到网页div中
    $("#spec-goods").text(appData.selectProd.name+" "+appData.selectProd.option1+" "+appData.selectProd.option2);
    $("#selected-img").attr("src", 'http://cdn.seezt.cc/uploadimages/'+specEle.data('img'));
}
//二级规格选中事件
function select_option1(ele) {
    var optionEle = $(ele);
    if($('.option1>button.active').text() === optionEle.data("name"))
        return;
    if(optionEle.hasClass('disable'))
        return;
    optionEle.siblings('button').removeClass('active');
    optionEle.addClass('active');
    appData.selectProd.option1 =optionEle.data("name");
    appData.selectProd.sku = optionEle.data("sku");
    var items = $('.option2>button');
    if(items.length >0){
        items.removeClass('active');
        items.addClass('disable');
        for(var i in appData.goods.specs){
            var spec =appData.goods.specs[i];
            if(spec.name+'' === appData.selectProd.name+''&&
                spec.option1+'' === appData.selectProd.option1+''){
                $.each(items,function (index, span) {
                    if($(span).text()+'' === spec.option2+''){
                        var item = $(items[index]);
                        item.data('price',spec.price);
                        item.data('sku',spec.id);
                        item.removeClass('disable');
                    }
                });
            }
        }
        var option2_li = $(items.not('.disable'));
        if(option2_li.length===0){
            appData.selectProd.price = optionEle.data("price");
            appData.selectProd.sku = optionEle.data("sku");
            $('#goods_price').text(appData.money + appData.selectProd.price);
        }else{
            appData.selectProd.sku = '';
            appData.selectProd.option2 = '';
            $("#spec-goods").text(appData.selectProd.name+" "+appData.selectProd.option1+" "+appData.selectProd.option2);
        }
    }else{
        $.each(appData.goods.specs,function (index, spec) {
            if(spec.name === ''+appData.selectProd.name&&
                spec.option1 === ''+appData.selectProd.option1){
                appData.selectProd.price = spec.price;
                return false;
            }
        });
        $("#spec-goods").text(appData.selectProd.name+" "+appData.selectProd.option1+" "+appData.selectProd.option2);
        $('#goods_price').text(appData.money + appData.selectProd.price);
    }
}
//三级规格选中事件
function select_option2(ele) {
    var optionEle = $(ele);
    if($('.option2>button.active').text() === optionEle.data("name"))
        return;
    if(optionEle.hasClass('disable'))
        return;
    optionEle.siblings('button').removeClass('active');
    optionEle.addClass('active');
    appData.selectProd.option2 = optionEle.data("name");
    appData.selectProd.sku = optionEle.data("sku");
    $.each(appData.goods.specs,function (index, spec) {
        if(spec.name+'' === appData.selectProd.name+''&&
            spec.option1+'' === appData.selectProd.option1+''&&
            spec.option2+'' === appData.selectProd.option2+''){
            appData.selectProd.price = spec.price;
            return false;
        }
    });
    $("#spec-goods").text(appData.selectProd.name+" "+appData.selectProd.option1+" "+appData.selectProd.option2);
    $('#goods_price').text(appData.money + appData.selectProd.price);
}

//添加购物车
function addtocart(hidemsg) {
    if(!appData.selectProd.sku||appData.selectProd.sku===''){
        if(!appData.selectProd.name){
            return tools.showMsg(selectStr+appData.option1);
        }
        if(!appData.selectProd.option1){
            return tools.showMsg(selectStr+appData.option2);
        }
        if(!appData.selectProd.option2){
            return tools.showMsg(selectStr+appData.option3);
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
            show_CartWin();
            $('#cartWin').css('z-index','2000').css('background','#fff');
            return;
        }
    }
    //数量加减
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
        number: appData.addnum
    });
    if(hidemsg){//如果hidemsg为true，跳转至结算页面
        show_Cart();
    }else{//否则提示是否去结算，如继续浏览则什么都不做
        $('#addnum').val(1);
        appData.addnum = parseInt($('#addnum').val());
        layer.open({
            content: confirmContent
            ,btn: [ btn1,btn2]
            ,yes: function(index){
                show_Cart();
                layer.close(index);
            }
        });
    }
}
//购物车页面显示
function show_Cart() {
    if(cart.getAllProduct().length>0){
        show_CartWin();
        $('#cartWin').css('z-index','2000').css('background','#fff');
    }

}
//购物车为空，展示详情页
function show_cartisempty(){
    hide_CartWin();
    hide_SpecWin();
}
//购物车商品数量减
function sub_prod(sku) {
    var oldnum = cart.getProductNumber({sku:sku});
    if (oldnum - 1 > 0) {
        cart.updateNumber(-1, {sku:sku});
    } else {
        cart.deleteProduct({sku:sku});
    }
    refresh_prod_ul();
}
//购物车商品数量加
function add_prod(sku) {
    cart.updateNumber(1, {sku:sku});
    refresh_prod_ul();
}
//删除购物车某个商品
function del_prod(sku) {
    cart.deleteProduct({sku:sku});
    refresh_prod_ul();
}
//计算价格
function calc_price() {
    var ret  = cart.getQuantity();
    var allnum = ret.totalNumber;
    var allprice = ret.totalAmount;
    var realprice = allprice;
    $('#allCount').children("span").text(allnum);
    $('#allprice').children("span").text( allprice);
    $('#realprice').children("span").text( realprice);
    appData.realprice = realprice;
}
//购物车列表循环
function refresh_prod_ul() {
    var cart_list_body=$("#cart_list_body");
    if(cart_list_body.length>0){
        cart_list_body.empty();
        for (var i in cart.getAllProduct()) {
            var prod = cart.getAllProduct()[i];
          //  console.log(prod);
            prod.option1 = prod.option1 ? prod.option1 : '';
            prod.option2 = prod.option2 ? prod.option2 : '';
            cart_list_body.append(
                '<div class="goods">'+
                '<div class="close" onclick="del_prod('+prod.sku+')"></div>'+
                '<div class="pic"><img src="'+ appData.imgpath +prod.img +'"></div>' +
                '<div class="goods-info"><div class="goods-info-t"><h6>'+prod.name+' '+prod.specname+'</h6>' +
                '<p><span class="sel-color">'+prod.option1+' '+prod.option2+'</span></p>' +
                '<p id="specPrice"><span class="goods-info-price">'+appData.money + prod.price+'</span></p>' +
                '<div class="shop-num"><div class="fr"><button class="minus" onclick="sub_prod('+prod.sku+')">-</button>'+
                '<input type="" name="num" value="'+prod.number+'">'+
                '<button class="plus" onclick="add_prod('+prod.sku+')">+</button></div></div></div></div></div>'
            );
        }
    }

    calc_price();
    if(cart.getAllProduct().length===0){
        show_cartisempty();
    }
}
//清空购物车
function clear_cart() {
    cart.clearCart();
    refresh_prod_ul();
}
var submiting = false;
//订单列表
function order_list(){
    var order_goodslist = $('#order_goodslist');
    order_goodslist.empty();
    for (var i in cart.getAllProduct()) {
        var prod = cart.getAllProduct()[i];
        console.log(prod);
        prod.option1 = prod.option1 ? prod.option1 : '';
        prod.option2 = prod.option2 ? prod.option2 : '';
        order_goodslist.append(
            ' <div class="order-detail" ><div class="specImg lf">' +
            '<img  src="' + appData.imgpath + prod.img + '" alt="">\n' +
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
//购物车提交结算
function submit_order() {
    if(submiting) return;
    if(cart.getAllProduct().length ===0) return;
    var TW_phone = /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[0-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/;
    var hk_phone = /^([5|6|9])\d{7}$/;
    var Email=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    var goodsinfo = [];
    var prods = cart.getAllProduct();
    //获取所购买商品的主要信息列表
    for(var i in prods){
        var prod = prods[i];
        goodsinfo.push({
            id: prod.id,
            sku: prod.sku,
            img: prod.img,
            sitedir: appData.sitedir,
            number: prod.number
        });
    }
    var clientinfo = {};
    clientinfo.clientname = $('#clientname').val();
    clientinfo.clientphone = $('#clientphone').val();
    clientinfo.clientaddress = $('#clientaddress').val();
    clientinfo.clientemail = $('#clientemail').val();
    clientinfo.clientzipcode = $('#clientzipcode').val();
    clientinfo.province = $('#province').children(":selected").val();
    clientinfo.city = $('#city').children(":selected").val();
    clientinfo.area = $('#area').children(":selected").val();
    clientinfo.clientdispatchtime = $('#clientdispatchtime').children(":selected").val();
    clientinfo.clientotherinfo = $('#clientotherinfo').val();
    //表单验证
    if(!clientinfo.clientname||clientinfo.clientname === ' '){
        $('#clientname').focus();
        return tools.showMsg(nameStr);
    }
    if(appData.money === 'HK'){
        if(!clientinfo.clientphone||!hk_phone.test(clientinfo.clientphone)) {
            $('#clientphone').focus();
            return tools.showMsg(PhoneStr);
        }
    }else if(appData.money === 'NT'){
        if(!clientinfo.clientphone||!TW_phone.test(clientinfo.clientphone)) {
            $('#clientphone').focus();
            return tools.showMsg(PhoneStr);
        }
    }else{
        if(!clientinfo.clientphone||clientinfo.clientphone === ' ') {
            $('#clientphone').focus();
            return tools.showMsg(PhoneStr);
        }
    }
    if(appData.money!=='￥'&&appData.money!=='S$'&&appData.money!=='฿'){
        if(clientinfo.city === '城市'||clientinfo.city === 'city'){
            $('#city').focus();
            return tools.showMsg(cityStr);
        }
        if(clientinfo.area === '區縣'||clientinfo.area === 'area'){
            $('#area').focus();
            return tools.showMsg(areaStr);
        }
    }else{
        clientinfo.province = "";
        clientinfo.city = "";
        clientinfo.area = "";
    }
    if(!clientinfo.clientaddress||clientinfo.clientaddress === ' ') {
        $('#clientaddress').focus();
        return tools.showMsg(addressStr);
    }
    if(appData.money === 'S$'||appData.money === 'RM'){
        if(!clientinfo.clientzipcode||clientinfo.clientzipcode === ' ') {
            $('#clientzipcode').focus();
            return tools.showMsg(postcodeStr);
        }
    }
    if(clientinfo.clientemail&&!Email.test(clientinfo.clientemail)){
        $('#clientemail').focus();
        return tools.showMsg(emailStr);
    }
    submiting=true;
    tools.showLoading(submitingStr, 30);
        $.ajax({
            type:"POST",
            url:'/createorder',
            contentType:"application/json",
            data: JSON.stringify({
                goodsinfo: {sitedir:appData.sitedir},
                cartinfo: goodsinfo,
                clientinfo: clientinfo,
                referrer:document.referrer?document.referrer:'直接进入',
                siteurl: window.location.href
            }),
            error:function (data) {
                tools.closeAll();
                submiting=false;
                tools.showMsg(submiterrorStr);
                $('#submit_btn').attr('disabled',false);
            },
            success:function(data){
                tools.closeAll();
                submiting=false;
                if(data.Error){
                    tools.showMsg(submiterrorStr);
                }
                else{
                    if(typeof fbq === "function"){
                        var currency = 'TWD';
                        if(appData.money === 'RM')
                            currency = 'MYR';
                        if(appData.money === 'HK')
                            currency = 'HKD';
                        else if(appData.money === 'S$')
                            currency = 'SGD';
                        else if(appData.money === '฿')
                            currency = 'THB';
                        fbq('track', 'Purchase',{
                            value: appData.realprice,
                            currency: currency
                        });
                    }
                    if(typeof run_sale_code === "function"){
                        run_sale_code();
                    }
                    $('#clientname').val('');
                    $('#clientphone').val('');
                    $('#clientaddress').val('');
                    $('#clientemail').val('');
                    $('#clientzipcode').val('');
                    $('#city').val(opt0[1]);
                    $('#area').val(opt0[2]);
                    $('#orderid').text(data.orderInfo.orderid);
                    $('#order_clientname').text(data.orderInfo.clientname);
                    $('#order_clientaddress').text(data.orderInfo.clientaddress);
                    $('#orderprice').text(appData.money + '' + data.orderInfo.orderprice);
                    order_list();
                    clear_cart();
                    cart.showTotalNum();
                    $('#cartWin').css('display','none');
                    $('#myModal').css('display','none');
                    $('.success').css({'display':'block','z-index':'3000','background':'#fff'});

                }
            }
        });

}
