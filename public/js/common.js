//查询订单
function find_order() {
    var expressinfo = $('#expressinfo').val();
    if(!expressinfo){
        $("#find_result").empty();
        return tools.show_msg(findStr);
    }
    $('.find-btn').text('wait 10s');
    $('.find-btn').attr('disabled',"true").addClass("disabled");
    var time = 9;
    var id = setInterval(function () {
        $('.find-btn').text('wait ' + time +'s');
        time--;
        if(time === -1){
            $('.find-btn').removeAttr('disabled').removeClass("disabled");
            $('.find-btn').text(findbtnStr);
            clearInterval(id);
        }
    },1000);
    $.post(appData.apiserver+"/queryorder/", {
        expressinfo:expressinfo,
        url:window.location.href
    }, function(data) {
        tools.close_all();
        if(data.Error){
            tools.show_msg(data.Info[appData.language]);
        }else{
            $("#find_result").html('<li  style="position: relative;border-bottom: none;" onclick="close_orderinfo()"> <span class="closeBtn" style="top:-2px;"></span></li>');
            if(data.orders && data.orders.length){
                $.each(data.orders,function (key,order) {
                    if(order){
                        var goodsinfo = order.goodsinfo;
                        var li = '<li class="am-padding-xs am-text-sm"><div>'+ordertimeStr+' ：<span>'+order.ordertime+'</span></div><div>'+orderidStr+' ：<span>'+order.orderid+'</span> <span class="am-fr am-text-danger">'+ order.orderstate +'</span></div>'+
                            '<div>'+ordernameStr+' ：<span>'+order.clientname+' ('+order.clientphone+')</span></div><div>'+orderaddressStr+' ：<span>'+order.clientaddress+'</span></div><div class="am-padding-xs">';
                        for(var i in goodsinfo){
                            var goods = goodsinfo[i];
                            if(!goods) continue;
                            li+='<div>'+goods.name+' '+goods.specname+' '+goods.option1+' '+goods.option2+' X '+goods.number+'</div>';
                        }
                        li+='</div></li>';
                        $("#find_result").append(li);
                    }
                });
            }else{
                $("#find_result").append('<li>'+orderError+'</li>');
            }

        }
    })
}
function close_orderinfo(){
    $("#find_result").empty();
    $('#expressinfo').val('');
    $('.find-btn').removeAttr('disabled').removeClass("disabled");
}
//下单
var submiting = false;
function submit_order_nocart() {
    /*获取邮费*/
    if(submiting) return;
    if(appData.prods.length===0) return;
    var cartinfo = [];
    for(var i in appData.prods){
        if(i < $(".product_item").length){
            var prod = appData.prods[i];
            if(!prod.id||!prod.sku||prod.price===0){
                tools.show_msg(selectStr+(parseInt(i)+1));
                return;
            }
            //判断是否缺货
            for(var j in appData.goods.specs){
                var spec=appData.goods.specs[j];
                if(prod.sku===spec.id){
                    if(spec.inventory===0){
                        tools.show_msg(selectOos+(parseInt(i)+1)+selectOos1);
                        return;
                    }
                }
            }
            cartinfo.push({
                id: prod.id,
                sku: prod.sku,
                img: prod.img,
                sitedir: appData.sitedir,
                number: prod.number
            });
        }
    }
    var map = {}, mergeCartinfo = [];
    for(var i = 0; i < cartinfo.length; i++){
        var ai = cartinfo[i];
        if(!map[ai.sku]){
            mergeCartinfo.push({
                id: ai.id,
                sku: ai.sku,
                img: ai.img,
                sitedir: ai.sitedir,
                number:ai.number,
            });
            map[ai.sku] = ai;
        }else{
            for(var j = 0; j < mergeCartinfo.length; j++){
                var dj = mergeCartinfo[j];
                if(dj.sku === ai.sku){
                    dj.number+=ai.number;
                    break;
                }
            }
        }
    }
    var giftCartinfo={},giftcount;
    for(var i in appData.goods.manyoff){
       if(appData.goods.manyoff[i].salecount===appData.prods.length){
           giftcount=appData.goods.manyoff[i].giftcount;
       }
    }
    if(appData.giftGoodsIds&&giftcount){
        for(var i in appData.giftSelect){
            var gifts=[];
            for(var k in appData.giftSelect[i]){
                var prod = appData.giftSelect[i][k];
                if(!prod.id||!prod.sku){
                    tools.show_msg(selectGiftStr+(parseInt(i)+1));
                    return;
                }
                gifts.push({
                    id: prod.id,
                    sku: prod.sku,
                    img: prod.img,
                    sitedir: appData.sitedir,
                    number: prod.number
                });
            }
            var temp = {}, mergeGiftsinfo = [];
            for(var f = 0; f< gifts.length; f++){
                var a = gifts[f];
                if(!temp[a.sku]){
                    mergeGiftsinfo.push({
                        id: a.id,
                        sku: a.sku,
                        img: a.img,
                        sitedir: a.sitedir,
                        number:a.number,
                    });
                    temp[a.sku] = a;
                }else{
                    for(var j = 0; j < mergeGiftsinfo.length; j++){
                        var d = mergeGiftsinfo[j];
                        if(d.sku === a.sku){
                            d.number+=a.number;
                            break;
                        }
                    }
                }
            }
            giftCartinfo[i]=mergeGiftsinfo;
        }
    }
    // var TW_phone = /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[0-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/;
    // var TW_phone=/^(09\d{8})$|^([1-9]{1}[0-8]{1}\d+)$/;
    // var TW_phone=/^([0-9]+)$/;
    // var HK_phone = /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/;
    // var HK_phone=/^([0-9]+)$/;
    // var RM_phone = /^(\+?6?01){1}(([0145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/;
    // var RM_phone=  /^([0-9]+)$/;
    var name=/^\s*$/;
    var Email=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    var otherPhone = /^([0-9]+)$/;
    var clientinfo = {};
    clientinfo.clientname = $('#clientname').val();
    clientinfo.clientphone = $('#clientphone').val();
    clientinfo.clientaddress = $('#clientaddress').val();
    clientinfo.clientemail = $('#clientemail').val();
    clientinfo.clientzipcode = ($('#clientzipcode').children(":selected").val())?($('#clientzipcode').children(":selected").val()):($('#clientzipcode').val());
    // clientinfo.province = $('#province').children(":selected").val();
    clientinfo.city = $('#city').children(":selected").val();
    clientinfo.area = ($('#area').children(":selected").val())?($('#area').children(":selected").val()):($('#area').val());
    clientinfo.city = clientinfo.city?clientinfo.city.split('/')[0]:clientinfo.city;
    clientinfo.area = clientinfo.area?clientinfo.area.split('/')[0]:clientinfo.area;
    clientinfo.clientdispatchtime = $('#clientdispatchtime').children(":selected").val();
    clientinfo.clientotherinfo = $('#clientotherinfo').val();
    clientinfo.payment=$("input.radio:checked").val();
    if(appData.money==='NT'){
        if($("#payment2").is(":checked")||$("#payment3").is(":checked")){
            clientinfo.city=$("#city1").val();
            clientinfo.area=$("#area1").val();
            clientinfo.store=$("#store").val();
            if(!clientinfo.city||clientinfo.city === '城市'){
                $('#city1').focus();
                return tools.show_msg(cityStr);
            }
            if(!clientinfo.area||clientinfo.area === '區縣'){
                $('#area1').focus();
                return tools.show_msg(areaStr);
            }
            if(!clientinfo.store){
                $('#store').focus();
                return tools.show_msg(storeStr);
            }
            clientinfo.store_delivery=$("#payment_method input:checked").val();
        }
    }
    /*添加邮费*/
    clientinfo.remoteMoney = $("#pianyuan>div>span>u").html()?$("#pianyuan>div>span>u").html():0;
    if(!clientinfo.clientname||name.test(clientinfo.clientname)){
        $('#clientname').focus();
        return tools.show_msg(nameStr);
    }
    if(!clientinfo.clientphone||clientinfo.clientphone === ' ') {
        $('#clientphone').focus();
        return tools.show_msg(PhoneStr);
    }
    if(appData.money!=='￥'&&appData.money!=='S$'){
        if(clientinfo.city === '城市'||clientinfo.city === 'Province'||clientinfo.city === 'จังหวัด'||clientinfo.city === '区域'||clientinfo.city === undefined||clientinfo.city ==='都道府県を選択'){
            $('#city').focus();
            return tools.show_msg(cityStr);
        }
        if(clientinfo.area === '区县'||clientinfo.area === '區縣'||clientinfo.area === 'City'||clientinfo.area === 'เมือง'||clientinfo.area === '區'||clientinfo.area === undefined){
            $('#area').focus();
            return tools.show_msg(areaStr);
        }
    }else{
        clientinfo.province = "";
        clientinfo.city = "";
        clientinfo.area = "";
    }
    let ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    clientinfo.clientemail = clientinfo.clientemail.replace(new RegExp(ranges.join('|'), 'g'), '');
    clientinfo.clientaddress=clientinfo.clientaddress.replace(new RegExp(ranges.join('|'), 'g'), '');
    clientinfo.clientotherinfo=clientinfo.clientotherinfo.replace(new RegExp(ranges.join('|'), 'g'), '');
    if(!clientinfo.clientaddress||clientinfo.clientaddress === ' ') {
        $('#clientaddress').focus();
        return tools.show_msg(addressStr);
    }
    if(appData.money === 'S$'||appData.money === 'RM'||appData.money === '฿'){
        if(!clientinfo.clientzipcode||clientinfo.clientzipcode === ' '||!otherPhone.test(clientinfo.clientzipcode)) {
            $('#clientzipcode').focus();
            return tools.show_msg(postcodeStr);
        }
        if(appData.money === 'RM'&&clientinfo.clientzipcode.length!==5){
            $('#clientzipcode').focus();
            return tools.show_msg(postcodeStr);
        }
    }
    // if(clientinfo.clientemail&&!Email.test(clientinfo.clientemail)){
    //     $('#clientemail').focus();
    //     return tools.show_msg(emailStr);
    // }

    submiting=true;
    tools.show_loading(submitingStr, 30);
    $.ajax({
        type:"POST",
        url:appData.apiserver+'/createorder',
        contentType:"application/json",
        data: JSON.stringify({
            goodsinfo: {sitedir:appData.sitedir,redirect_sitedir:appData.redirect_sitedir,is_domain:appData.is_domain},
            cartinfo: mergeCartinfo,
            giftCartinfo:giftCartinfo,
            clientinfo: clientinfo,
            referrer:document.referrer?document.referrer:'直接进入',
            siteurl: window.location.href
        }),
        error:function (data) {
            tools.close_all();
            submiting=false;
            tools.show_msg(submiterrorStr);
            $('#submit_btn').attr('disabled',false);
        },
        success:function(data){
            tools.close_all();
            submiting=false;
            if(data.Error){
                tools.show_msg(data.Info[appData.language]);
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
                    else if(appData.money === '円')
                        currency = 'JPN';
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
                $('#city').val('');
                $('#area').val('');
                $("#pianyuan>div").html('');
                $("#remote").attr("checked",false);
                $('#orderid').text(data.orderInfo.orderid);
                $('#order_clientname').text(data.orderInfo.clientname);
                $('#order_clientaddress').text(data.orderInfo.clientaddress);
                $('#order_clientphone').text(data.orderInfo.orderphone);
                $('#orderprice').text(appData.money + '' + data.orderInfo.orderprice);
                show_successwin();
                // if(parseInt(clientinfo.payment)===1){
                //     $("#paypal-button").show();
                //     $("#continue").hide();
                //     $("#payment").show();
                //     $("#ordersuccess").hide();
                //     var orderPrice=data.orderInfo.orderprice;
                //     var currency = 'TWD';
                //     if (appData.money === 'RM')
                //         currency = 'MYR';
                //     else if (appData.money === 'HK')
                //         currency = 'HKD';
                //     else if (appData.money === 'S$')
                //         currency = 'SGD';
                //     else if (appData.money === '฿')
                //         currency = 'THB';
                //     var order_clientname=data.orderInfo.clientname;
                //     var order_clientphone=data.orderInfo.orderphone;
                //     var order_id=data.orderInfo.orderid;
                //     paypal.Button.render({
                //     // Configure environment
                //     env: 'production',
                //     client: {
                //         //sandbox: appData.clientId,
                //         production: appData.clientId
                //     },
                //     //Customize button (optional)
                //     locale: 'en_US',
                //     style: {
                //         size: 'small',
                //         color: 'gold',
                //         shape: 'pill',
                //     },
                //     // Set up a payment
                //     payment: function (data, actions) {
                //         return actions.payment.create({
                //             id: order_id,
                //             transactions: [{
                //                 amount: {
                //                     total: orderPrice,
                //                     currency:currency
                //                 },
                //                 item_list: {
                //                     shipping_address: {
                //                         recipient_name: order_clientname,//收件人
                //                         city: clientinfo.area,//城市
                //                         phone: order_clientphone,//电话
                //                         line1: clientinfo.clientaddress,
                //                         //line2: clientinfo.area,
                //                         country_code: appData.language.toUpperCase(),
                //                         postal_code: clientinfo.clientzipcode,
                //                         state: clientinfo.city,
                //                     }
                //                 }
                //             }],
                //         });
                //     },
                //     // Execute the payment
                //     onAuthorize: function (data, actions) {
                //         return actions.payment.execute().then(function () {
                //                 $.ajax({
                //                     type:"POST",
                //                     url:appData.apiserver+'/createOrderPaypal',
                //                     contentType:"application/json",
                //                     data:JSON.stringify({
                //                         orderid:order_id,
                //                         payid:data.payerID,
                //                         paymentid:data.paymentID,
                //                         paymenttoken:data.paymentToken,
                //                         returnurl:data.returnUrl,
                //                         orderidP:data.orderID
                //                     }),
                //                     error:function (info) {
                //                         tools.show_msg(info.Info[appData.language]);
                //                         return false;
                //                     },
                //                     success:function(info){
                //                         tools.show_msg(info.Info[appData.language]);
                //                         $("#paypal-button").hide();
                //                         $("#continue").show();
                //                         $("#payment").hide();
                //                         $("#paysuccess").show();
                //                     }
                //                 });
                //
                //             });
                //     }
                // }, '#paypal-button');
            // }
            }
        }
    });
}
function submit_order() {
    if(submiting) return;
    if(cart.getAllProduct().length ===0) return;
    var cartinfo = [],gifts=[],giftCartinfo={};
    var prods = cart.getAllProduct();
    for(var i in prods){
        var prod = prods[i];
        cartinfo.push({
            id: prod.id,
            sku: prod.sku,
            img: prod.img,
            sitedir: appData.sitedir,
            number: prod.number
        });
        if(appData.giftGoodsIds){
            for(var j in prod.giftgoods){
                var gift = prod.giftgoods[j];
                gifts.push({
                    id: gift.id,
                    sku: gift.sku,
                    img: gift.img,
                    sitedir: appData.sitedir,
                    number: gift.number
                });
            }
        }
    }
    if(gifts){
        for(var i in appData.giftGoodsIds){
            var giftsArr=[];
            for(var j in gifts){
                if(gifts[j].id===appData.giftGoodsIds[i].id){
                    giftsArr.push(gifts[j]);
                }
            }
            var temp = {}, mergeGiftsinfo = [];
            for(var f = 0; f< giftsArr.length; f++){
                var a = giftsArr[f];
                if(!temp[a.sku]){
                    mergeGiftsinfo.push({
                        id: a.id,
                        sku: a.sku,
                        img: a.img,
                        sitedir: a.sitedir,
                        number:a.number,
                    });
                    temp[a.sku] = a;
                }else{
                    for(var j = 0; j < mergeGiftsinfo.length; j++){
                        var d = mergeGiftsinfo[j];
                        if(d.sku === a.sku){
                            d.number+=a.number;
                            break;
                        }
                    }
                }
            }
            giftCartinfo[i]=mergeGiftsinfo;
        }
    }
    var name=/^\s*$/;
    var Email=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    var otherPhone = /^([0-9]+)$/;
    var clientinfo = {};
    clientinfo.clientname = $('#clientname').val();
    clientinfo.clientphone = $('#clientphone').val();
    clientinfo.clientaddress = $('#clientaddress').val();
    clientinfo.clientemail = $('#clientemail').val();
    clientinfo.clientzipcode = ($('#clientzipcode').children(":selected").val())?($('#clientzipcode').children(":selected").val()):($('#clientzipcode').val());
    // clientinfo.province = $('#province').children(":selected").val();
    clientinfo.city = $('#city').children(":selected").val();
    clientinfo.area = ($('#area').children(":selected").val())?($('#area').children(":selected").val()):($('#area').val());
    clientinfo.city = clientinfo.city?clientinfo.city.split('/')[0]:clientinfo.city;
    clientinfo.area = clientinfo.area?clientinfo.area.split('/')[0]:clientinfo.area;
    clientinfo.clientdispatchtime = $('#clientdispatchtime').children(":selected").val();
    clientinfo.clientotherinfo = $('#clientotherinfo').val();
    /*添加邮费*/
    clientinfo.remoteMoney = $("#pianyuan>div>span>u").html()?$("#pianyuan>div>span>u").html():0;
    if(!clientinfo.clientname||name.test(clientinfo.clientname)){
        $('#clientname').focus();
        return tools.show_msg(nameStr);
    }
    if(!clientinfo.clientphone||clientinfo.clientphone === ' ') {
        $('#clientphone').focus();
        return tools.show_msg(PhoneStr);
    }
    if(appData.money!=='￥'&&appData.money!=='S$'){
        if(clientinfo.city === '城市'||clientinfo.city === 'Province'||clientinfo.city === 'จังหวัด'||clientinfo.city === '区域'||clientinfo.city === undefined||clientinfo.city ==='都道府県を選択'){
            $('#city').focus();
            return tools.show_msg(cityStr);
        }
        if(clientinfo.area === '区县'||clientinfo.area === '區縣'||clientinfo.area === 'City'||clientinfo.area === 'เมือง'||clientinfo.area === '區'||clientinfo.area === undefined){
            $('#area').focus();
            return tools.show_msg(areaStr);
        }
    }else{
        clientinfo.province = "";
        clientinfo.city = "";
        clientinfo.area = "";
    }
    let ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    clientinfo.clientemail = clientinfo.clientemail.replace(new RegExp(ranges.join('|'), 'g'), '');
    clientinfo.clientaddress=clientinfo.clientaddress.replace(new RegExp(ranges.join('|'), 'g'), '');
    clientinfo.clientotherinfo=clientinfo.clientotherinfo.replace(new RegExp(ranges.join('|'), 'g'), '');
    if(!clientinfo.clientaddress||clientinfo.clientaddress === ' ') {
        $('#clientaddress').focus();
        return tools.show_msg(addressStr);
    }
    if(appData.money === 'S$'||appData.money === 'RM'||appData.money === '฿'){
        if(!clientinfo.clientzipcode||clientinfo.clientzipcode === ' '||!otherPhone.test(clientinfo.clientzipcode)) {
            $('#clientzipcode').focus();
            return tools.show_msg(postcodeStr);
        }
        if(appData.money === 'RM'&&clientinfo.clientzipcode.length!==5){
            $('#clientzipcode').focus();
            return tools.show_msg(postcodeStr);
        }
    }
    // if(clientinfo.clientemail&&!Email.test(clientinfo.clientemail)){
    //     $('#clientemail').focus();
    //     return tools.show_msg(emailStr);
    // }
    submiting=true;
    tools.show_loading(submitingStr, 30);
    $.ajax({
        type:"POST",
        url:appData.apiserver+'/createorder',
        contentType:"application/json",
        data: JSON.stringify({
            goodsinfo: {sitedir:appData.sitedir,redirect_sitedir:appData.redirect_sitedir,is_domain:appData.is_domain},
            cartinfo: cartinfo,
            giftCartinfo:giftCartinfo,
            clientinfo: clientinfo,
            referrer:document.referrer?document.referrer:'直接进入',
            siteurl: window.location.href
        }),
        error:function (data) {
            tools.close_all();
            submiting=false;
            tools.show_msg(submiterrorStr);
            $('#submit_btn').attr('disabled',false);
        },
        success:function(data) {
            tools.close_all();
            submiting = false;
            if (data.Error) {
                tools.show_msg(data.Info[appData.language]);
            }
            else {
                if (typeof fbq === "function") {
                    var currency = 'TWD';
                    if (appData.money === 'RM')
                        currency = 'MYR';
                    if (appData.money === 'HK')
                        currency = 'HKD';
                    else if (appData.money === 'S$')
                        currency = 'SGD';
                    else if (appData.money === '฿')
                        currency = 'THB';
                    fbq('track', 'Purchase', {
                        value: appData.realprice,
                        currency: currency
                    });
                }
                if (typeof run_sale_code === "function") {
                    run_sale_code();
                }
                $('#clientname').val('');
                $('#clientphone').val('');
                $('#clientaddress').val('');
                $('#clientemail').val('');
                $('#clientzipcode').val('');
                $('#city').val('');
                $('#area').val('');
                /*$("#pianyuan>div").html('');
                $("#remote").attr("checked",false);*/
                $('#orderid').text(data.orderInfo.orderid);
                $('#order_clientname').text(data.orderInfo.clientname);
                $('#order_clientaddress').text(data.orderInfo.clientaddress);
                $('#order_clientphone').text(data.orderInfo.orderphone);
                $('#orderprice').text(appData.money + '' + data.orderInfo.orderprice);
                show_successwin();
                clear_cart();
                cart.showTotalNum();
            }
        }
    });
}
//客服
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
//swiper
function init_swiper() {
    new Swiper ('.swiper-container', {
        autoHeight: true,
        loop: true,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    });
}
var mark = 1;
/*邮编改变时间*/
function changeCode(){
    var code = ($('#clientzipcode').children(":selected").val())?($('#clientzipcode').children(":selected").val()):($('#clientzipcode').val());
    if((appData.money === '฿')||(appData.money === 'RM')||(appData.money === 'S$')){
        var cityState1;
        if(appData.money === '฿'){
            cityState1 = 3;
        }else if(appData.money === 'RM'){
            cityState1 = 4;
        }else if(appData.money === 'S$'){
            cityState1 = 5;
        }
       if(code!==null){
           $.get(appData.apiserver+"/comment/remote1/" + code +"/" + cityState1).success(function(data){
               if(data.Error){

               }else{
                   if((data.cityMess.cityinfo === null)||(data.cityMess.cityinfo.isallow === '禁止')){
                       $("#pianyuan>div").html('');
                       $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                       $(".spec_Btns>a").css('opacity','1');
                       $("#d1").attr("onclick", "submit_order();");
                       $("div.submit>button").attr("onclick", "submit_order_nocart();");
                       $("div.submit>button").css('opacity','1');
                       /*提交*/
                       $("#tijiao").attr("onclick", "submit_order_nocart();");
                       $("#tijiao").css("opacity", "1");
                       $("#tijiao1").attr("onclick","submit_order_nocart();");
                       $("#tijiao1").css("opacity", "1");
                       $("#yunfei").html('');
                       $("#yunName").html('');
                       $("#yunMoney").html('');
                       //calc_price_nocart();
                       if($("#realprice").find("span").length>0){
                           $('#realprice').children("span").text(appData.money+''+appData.realprice);
                       }else{
                           $('#realprice').text(appData.money+''+appData.realprice);
                       }
                   }else if(data.cityMess.cityinfo.isArrive === 0){
                       $("div.spec_Btns>a").attr("href","javascript:return false;");
                       $(".spec_Btns>a").css('opacity','0.2');
                       $("#pianyuan>div").html('');//remoteMess
                       $("#pianyuan>div").append('<span style="color:#F86161">'+remoteMess1+'</span>');
                       $("#d1").attr("onclick", "");
                       $("div.submit>button").attr("onclick", "");
                       $("div.submit>button").css('opacity','0.2');
                       $("#tijiao").attr("onclick", "");
                       $("#tijiao").css("opacity", "0.2");
                       $("#tijiao1").attr("onclick","");
                       $("#tijiao1").css("opacity", "0.2");
                       $("#yunfei").html('');
                       $("#yunName").html('');
                       $("#yunMoney").html('');
                       if($("#realprice").find("span").length>0){
                           $('#realprice').children("span").text(appData.money+''+appData.realprice);
                       }else{
                           $('#realprice').text(appData.money+''+appData.realprice);
                       }
                      /* $('#realprice').children("span").text(appData.money+''+appData.realprice);
                       $('#realprice').text(appData.money+''+appData.realprice);*/
                       /*不提交*/
                   }else if(data.cityMess.cityinfo.isArrive === 1){
                       $("#pianyuan>div").html('');
                      // $("#pianyuan>div").append('<input type="checkbox" value="1" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color:#F86161">'+remoteMess2+'<span style="display:inline-block;>'+appData.money+'</span>'+'<u id="zz">'+data.cityMess.cityinfo.extrapay+'</u></span>');
                       $("#pianyuan>div").append('<input type="checkbox"  name="checkbox" checked="checked" value="checkbox" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color:#F86161">'+remoteMess2+'<span style="display:inline-block;">'+appData.money+'</span>'+'<u id="zz">'+data.cityMess.cityinfo.extrapay+'</u></span>');
                       $("div.spec_Btns>a").attr("href","javascript:return false;"); //
                       $(".spec_Btns>a").css('opacity','0.2');
                       $("#d1").attr("onclick", "");
                       $("div.submit>button").attr("onclick", "");
                       $("div.submit>button").css('opacity','0.2');
                       $("#tijiao").attr("onclick", "");
                       $("#tijiao").css("opacity", "0.2");
                       $("#tijiao1").attr("onclick","");
                       $("#tijiao1").css("opacity", "0.2");
                       $("#yunfei").append('<span>'+messMoney+'</span><span class="price">'+appData.money+data.cityMess.cityinfo.extrapay+'</span>');
                       //$("#yunfei").append('<span class="price">'+appData.money+data.cityMess.cityinfo.extrapay+'</span>');
                       $("#yunfei1").append('<span>'+data.cityMess.cityinfo.extrapay+'</span>');
                       $("#yunName").append('<span>'+messMoney+'</span>');
                       $("#yunMoney").append('<span>'+appData.money+data.cityMess.cityinfo.extrapay+'</span>');
                       //calc_price_nocart();
                      /* $('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                       $('#realprice').text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));*/
                       if($("#realprice").find("span").length>0){
                           $('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                       }else{
                           $("#realprice").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                       }
                       var checked = document.getElementById("remote");
                       if(checked.checked){
                           $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                           $(".spec_Btns>a").css('opacity','1');
                           $("#d1").attr("onclick", "submit_order();");
                           $("div.submit>button").attr("onclick", "submit_order_nocart()");
                           $("div.submit>button").css('opacity','1');
                           $("#tijiao").attr("onclick", "submit_order_nocart();");
                           $("#tijiao").css("opacity", "1");
                           $("#tijiao1").attr("onclick","submit_order_nocart()");
                           $("#tijiao1").css("opacity", "1");
                       }else{
                           $("div.spec_Btns>a").attr("href","javascript:return false;");
                           $(".spec_Btns>a").css('opacity','0.2');
                           $("#d1").attr("onclick", "");
                           $("div.submit>button").attr("onclick", "");
                           $("div.submit>button").css('opacity','0.2');
                           $("#tijiao").attr("onclick", "");
                           $("#tijiao").css("opacity", "0.2");
                           $("#tijiao1").attr("onclick","");
                           $("#tijiao1").css("opacity", "0.2");
                       }
                   }
               }
           })
       }
    }
}
//select
function select_change(ele,subid) {
    var id = $(ele).find("option:selected").data('id');
    //获取城市值
    if((appData.money === 'HK')||(appData.money === 'NT')||(appData.money === 'Rp')){//||(S$)
        var cityArea = $("#city").val();
        var cityTest =$("#area").val();
        var cityState;
        if(appData.money === 'HK'){
            cityState = 1;
        }else if(appData.money === 'NT'){
            cityState = 0;
        }else if(appData.money === 'Rp'){
            cityState = 2;
        }
        if(cityArea!== null){
            var all ='全部';

            $.get(appData.apiserver+"/comment/remote2/"+ cityState+'/' +cityArea+'/'+all).success(function(data3){
                if(data3.Error){

                }else{
                    if(data3.cityMess.cityinfo === null){
                        if(cityTest!== null){
                            $.get(appData.apiserver+"/comment/remote/" + cityTest +'/' + cityState+'/' +cityArea).success(function (data1) {
                                if (data1.Error) {
                                    /*  tools.show_msg(data1.Info[appData.language]);*/
                                } else {
                                    if((data1.cityMess.cityinfo === null)||(data1.cityMess.cityinfo.isallow === '禁止')){
                                        $("#pianyuan>div").html('');
                                        $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                                        $(".spec_Btns>a").css('opacity','1');
                                        $("#d1").attr("onclick", "submit_order();");
                                        $("div.submit>button").attr("onclick", "submit_order_nocart();");
                                        $("div.submit>button").css('opacity','1');
                                        $("#tijiao").attr("onclick", "submit_order_nocart();");
                                        $("#tijiao").css("opacity", "1");
                                        $("#tijiao1").attr("onclick","submit_order_nocart();");
                                        $("#tijiao1").css("opacity", "1");
                                        $("#yunfei").html('');
                                        $("#yunName").html('');
                                        $("#yunMoney").html('');
                                        //$('#realprice').children("span").text(appData.money+''+appData.realprice);
                                        //$('#realprice').text(appData.money+''+appData.realprice);
                                        if($("#realprice").find("span").length>0){
                                            $('#realprice').children("span").text(appData.money+''+appData.realprice);
                                        }else{
                                            $('#realprice').text(appData.money+''+appData.realprice);
                                        }
                                    }else if(data1.cityMess.cityinfo.isArrive === 0){
                                        $("div.spec_Btns>a").attr("href","javascript:return false;");
                                        $(".spec_Btns>a").css('opacity','0.2');
                                        $("#pianyuan>div").html('');
                                        $("#pianyuan>div").append('<span style="color: #F86161">'+remoteMess1+'</span>');
                                        $("#d1").attr("onclick", "");
                                        $("div.submit>button").attr("onclick", "");
                                        $("div.submit>button").css('opacity','0.2');
                                        $("#tijiao").attr("onclick", "");
                                        $("#tijiao").css("opacity", "0.2");
                                        $("#tijiao1").attr("onclick","");
                                        $("#tijiao1").css("opacity", "0.2");
                                        $("#yunfei").html('');
                                        $("#yunName").html('');
                                        $("#yunMoney").html('');
                                        //$('#realprice').text(appData.money+''+appData.realprice);
                                        //$('#realprice').children("span").text(appData.money+''+appData.realprice);
                                        if($("#realprice").find("span").length>0){
                                            $('#realprice').children("span").text(appData.money+''+appData.realprice);
                                        }else{
                                            $('#realprice').text(appData.money+''+appData.realprice);
                                        }
                                    }else if(data1.cityMess.cityinfo.isArrive === 1){
                                        $("#pianyuan>div").html('');
                                        //$("#pianyuan>div").append('<input type="checkbox" value="1" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color: #F86161;">'+remoteMess2+'<u>'+appData.money+data1.cityMess.cityinfo.extrapay+'</u></span>');
                                        $("#pianyuan>div").append('<input type="checkbox" name="checkbox" checked="checked" value="checkbox" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color:#F86161">'+remoteMess2+'<span style="display:inline-block;">'+appData.money+'</span>'+'<u id="zz">'+data1.cityMess.cityinfo.extrapay+'</u></span>');
                                        $("div.spec_Btns>a").attr("href","javascript:return false;");
                                        $(".spec_Btns>a").css('opacity','0.2');
                                        $("#d1").attr("onclick", "");
                                        $("div.submit>button").attr("onclick", "");
                                        $("div.submit>button").css('opacity','0.2');
                                        $("#tijiao").attr("onclick", "");
                                        $("#tijiao").css("opacity", "0.2");
                                        $("#tijiao1").attr("onclick","");
                                        $("#tijiao1").css("opacity", "0.2");
                                        $("#yunfei").append('<span>'+messMoney+'</span><span class="price">'+appData.money+data1.cityMess.cityinfo.extrapay+'</span>');
                                        $("#yunfei1").append('<span>'+data1.cityMess.cityinfo.extrapay+'</span>');
                                        $("#yunName").append('<span>'+messMoney+'</span>');
                                        $("#yunMoney").append('<span>'+appData.money+data1.cityMess.cityinfo.extrapay+'</span>');
                                        //$('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                                        //$('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                                        if($("#realprice").find("span").length>0){
                                            $('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                                        }else{
                                            $("#realprice").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                                        }
                                        /*监听*/
                                        var checked = document.getElementById("remote");
                                        if(checked.checked){
                                            $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                                            $(".spec_Btns>a").css('opacity','1');
                                            $("#d1").attr("onclick", "submit_order();");
                                            $("div.submit>button").attr("onclick", "submit_order_nocart()");
                                            $("div.submit>button").css('opacity','1');
                                            $("#tijiao").attr("onclick", "submit_order_nocart();");
                                            $("#tijiao").css("opacity", "1");
                                            $("#tijiao1").attr("onclick","submit_order_nocart()");
                                            $("#tijiao1").css("opacity", "1");
                                        }else{
                                            $("div.spec_Btns>a").attr("href","javascript:return false;");
                                            $(".spec_Btns>a").css('opacity','0.2');
                                            $("#d1").attr("onclick", "");
                                            $("div.submit>button").attr("onclick", "");
                                            $("div.submit>button").css('opacity','0.2');
                                            $("#tijiao").attr("onclick", "");
                                            $("#tijiao").css("opacity", "0.2");
                                            $("#tijiao1").attr("onclick","");
                                            $("#tijiao1").css("opacity", "0.2");
                                        }
                                    }

                                }
                            });
                        }
                    }else{
                        if(data3.cityMess.cityinfo.isallow === '禁止'){
                            $("#pianyuan>div").html('');
                            $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                            $(".spec_Btns>a").css('opacity','1');
                            $("#d1").attr("onclick", "submit_order();");
                            $("div.submit>button").attr("onclick", "submit_order_nocart();");
                            $("div.submit>button").css('opacity','1');
                            $("#tijiao").attr("onclick", "submit_order_nocart();");
                            $("#tijiao").css("opacity", "1");
                            $("#tijiao1").attr("onclick","submit_order_nocart();");
                            $("#tijiao1").css("opacity", "1");
                            $("#yunfei").html('');
                            $("#yunName").html('');
                            $("#yunMoney").html('');
                            //calc_price_nocart();
                            //$('#realprice').text(appData.money+''+appData.realprice);
                            //$('#realprice').children("span").text(appData.money+''+appData.realprice);
                            if($("#realprice").find("span").length>0){
                                $('#realprice').children("span").text(appData.money+''+appData.realprice);
                            }else{
                                $('#realprice').text(appData.money+''+appData.realprice);
                            }
                        }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 0)){
                            $("#yunfei").html('');
                            $("#yunName").html('');
                            $("#yunMoney").html('');
                            $("div.spec_Btns>a").attr("href","javascript:return false;");
                            $(".spec_Btns>a").css('opacity','0.2');
                            $("#pianyuan>div").html('');
                            $("#pianyuan>div").append('<span style="color: #F86161">'+remoteMess1+'</span>');
                            $("#d1").attr("onclick", "");
                            $("div.submit>button").attr("onclick", "");
                            $("div.submit>button").css('opacity','0.2');
                            $("#tijiao").attr("onclick", "");
                            $("#tijiao").css("opacity", "0.2");
                            $("#tijiao1").attr("onclick","");
                            $("#tijiao1").css("opacity", "0.2");
                            $("#yunfei").html('');
                            $("#yunName").html('');
                            $("#yunMoney").html('');
                            //$('#realprice').text(appData.money+''+appData.realprice);
                            //$('#realprice').children("span").text(appData.money+''+appData.realprice);
                            if($("#realprice").find("span").length>0){
                                $('#realprice').children("span").text(appData.money+''+appData.realprice);
                            }else{
                                $('#realprice').text(appData.money+''+appData.realprice);
                            }
                        }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 1)){
                            $("#yunfei").html('');
                            $("#yunName").html('');
                            $("#yunMoney").html('');
                            $("#pianyuan>div").html('');
                            //$("#pianyuan>div").append('<input type="checkbox" value="1" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color: #F86161;">'+remoteMess2+'<u>'+appData.money+data3.cityMess.cityinfo.extrapay+'</u></span>');
                            $("#pianyuan>div").append('<input type="checkbox"  name="checkbox" checked="checked" value="checkbox" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color:#F86161">'+remoteMess2+'<span style="display:inline-block;">'+appData.money+'</span>'+'<u id="zz">'+data3.cityMess.cityinfo.extrapay+'</u></span>');
                            $("div.spec_Btns>a").attr("href","javascript:return false;"); //
                            $(".spec_Btns>a").css('opacity','0.2');
                            $("#d1").attr("onclick", "");
                            $("div.submit>button").attr("onclick", "");
                            $("div.submit>button").css('opacity','0.2');
                            $("#tijiao").attr("onclick", "");
                            $("#tijiao").css("opacity", "0.2");
                            $("#tijiao1").attr("onclick","");
                            $("#tijiao1").css("opacity", "0.2");
                            $("#yunfei").append('<span>快递费</span><span class="price">'+appData.money+data3.cityMess.cityinfo.extrapay+'</span>');
                            //$("#yunfei").append('<span class="price">'+appData.money+data3.cityMess.cityinfo.extrapay+'</span>');
                            $("#kuaidi").val(data3.cityMess.cityinfo.extrapay);
                            $("#yunfei1").append('<span>'+data3.cityMess.cityinfo.extrapay+'</span>');
                            $("#yunName").append('<span>'+messMoney+'</span>');
                            $("#yunMoney").append('<span>'+appData.money+data3.cityMess.cityinfo.extrapay+'</span>');
                           // $('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                            //$('#realprice').text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                            if($("#realprice").find("span").length>0){
                                $('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                            }else{
                                $("#realprice").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                            }
                            var checked = document.getElementById("remote");
                            if(checked.checked){
                                $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                                $(".spec_Btns>a").css('opacity','1');
                                $("#d1").attr("onclick", "submit_order();");
                                $("div.submit>button").attr("onclick", "submit_order_nocart()");
                                $("div.submit>button").css('opacity','1');
                                $("#tijiao").attr("onclick", "submit_order_nocart();");
                                $("#tijiao").css("opacity", "1");
                                $("#tijiao1").attr("onclick","submit_order_nocart()");
                                $("#tijiao1").css("opacity", "1");
                            }else{
                                $("div.spec_Btns>a").attr("href","javascript:return false;");
                                $(".spec_Btns>a").css('opacity','0.2');
                                $("#d1").attr("onclick", "");
                                $("div.submit>button").attr("onclick", "");
                                $("div.submit>button").css('opacity','0.2');
                                $("#tijiao").attr("onclick", "");
                                $("#tijiao").css("opacity", "0.2");
                                $("#tijiao1").attr("onclick","");
                                $("#tijiao1").css("opacity", "0.2");
                            }
                        }
                    }
                }
            })
        }
    }else if((appData.money === '฿')||(appData.money === 'RM')||(appData.money === 'S$')){
        var cityArea = $("#city").val();
        var cityTest =$("#area").val();
        var cityState1;
        if(appData.money === '฿'){
            cityState1 = 3;
        }else if(appData.money === 'RM'){
            cityState1 = 4;
        }else if(appData.money === 'S$'){
            cityState1 = 5;
        }
        if(cityArea!== null){
            var all ='全部';
            $.get(appData.apiserver+"/comment/remote2/"+ cityState1+'/' +cityArea+'/'+all).success(function(data3){
                if(data3.Error){

                }else{
                    if(data3.cityMess.cityinfo === null){
                        if(cityTest!== null){
                            //根据地区查邮编为全部的，
                            var zip = '全部';
                            $.get(appData.apiserver+"/comment/remote3/"+ cityState1+'/' +cityArea+'/'+zip+'/'+cityTest).success(function(data4){
                                if(data4.Error){

                                }else{
                                    if(data4.cityMess.cityinfo === null){
                                        //this.changeCode();//去掉change事件
                                        $("#pianyuan>div").html('');
                                        $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                                        $(".spec_Btns>a").css('opacity','1');
                                        $("#d1").attr("onclick", "submit_order();");
                                        $("div.submit>button").attr("onclick", "submit_order_nocart();");
                                        $("div.submit>button").css('opacity','1');
                                        $("#tijiao").attr("onclick", "submit_order_nocart();");
                                        $("#tijiao").css("opacity", "1");
                                        $("#tijiao1").attr("onclick","submit_order_nocart();");
                                        $("#tijiao1").css("opacity", "1");
                                        $("#yunfei").html('');
                                        $("#yunName").html('');
                                        $("#yunMoney").html('');
                                        mark = 1;
                                       // $('#realprice').children("span").text(appData.money+''+appData.realprice);
                                       // $('#realprice').text(appData.money+''+appData.realprice);
                                        if($("#realprice").find("span").length>0){
                                            $('#realprice').children("span").text(appData.money+''+appData.realprice);
                                        }else{
                                            $('#realprice').text(appData.money+''+appData.realprice);
                                        }
                                    }else{
                                        mark = 0;
                                        if(data4.cityMess.cityinfo.isallow === '禁止'){
                                            $("#pianyuan>div").html('');
                                            $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                                            $(".spec_Btns>a").css('opacity','1');
                                            $("#d1").attr("onclick", "submit_order();");
                                            $("div.submit>button").attr("onclick", "submit_order_nocart();");
                                            $("div.submit>button").css('opacity','1');
                                            $("#tijiao").attr("onclick", "submit_order_nocart();");
                                            $("#tijiao").css("opacity", "1");
                                            $("#tijiao1").attr("onclick","submit_order_nocart();");
                                            $("#tijiao1").css("opacity", "1");
                                            $("#yunfei").html('');
                                            $("#yunName").html('');
                                            $("#yunMoney").html('');
                                            //$('#realprice').text(appData.money+''+appData.realprice);
                                           // $('#realprice').children("span").text(appData.money+''+appData.realprice);
                                            if($("#realprice").find("span").length>0){
                                                $('#realprice').children("span").text(appData.money+''+appData.realprice);
                                            }else{
                                                $('#realprice').text(appData.money+''+appData.realprice);
                                            }
                                        }else if((data4.cityMess.cityinfo.isallow === '允许')&&(data4.cityMess.cityinfo.isArrive === 0)){
                                            $("#yunfei").html('');
                                            $("#yunName").html('');
                                            $("#yunMoney").html('');
                                            $("div.spec_Btns>a").attr("href","javascript:return false;");
                                            $(".spec_Btns>a").css('opacity','0.2');
                                            $("#pianyuan>div").html('');
                                            $("#pianyuan>div").append('<span style="color: #F86161">'+remoteMess1+'</span>');
                                            $("#d1").attr("onclick", "");
                                            $("div.submit>button").attr("onclick", "");
                                            $("div.submit>button").css('opacity','0.2');
                                            $("#tijiao").attr("onclick", "");
                                            $("#tijiao").css("opacity", "0.2");
                                            $("#tijiao1").attr("onclick","");
                                            $("#tijiao1").css("opacity", "0.2");
                                           $("#yunfei").html('');
                                            $("#yunName").html('');
                                            $("#yunMoney").html('');
                                           // calc_price_nocart();
                                            //$('#realprice').text(appData.money+''+appData.realprice);
                                            //$('#realprice').children("span").text(appData.money+''+appData.realprice);
                                            if($("#realprice").find("span").length>0){
                                                $('#realprice').children("span").text(appData.money+''+appData.realprice);
                                            }else{
                                                $('#realprice').text(appData.money+''+appData.realprice);
                                            }
                                        }else if((data4.cityMess.cityinfo.isallow === '允许')&&(data4.cityMess.cityinfo.isArrive === 1)){
                                            $("#yunfei").html('');
                                            $("#yunName").html('');
                                            $("#yunMoney").html('');
                                            $("#pianyuan>div").html('');
                                            //$("#pianyuan>div").append('<input type="checkbox" value="1" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color: #F86161;">'+remoteMess2+'<u>'+appData.money+data4.cityMess.cityinfo.extrapay+'</u></span>');
                                            $("#pianyuan>div").append('<input type="checkbox"  name="checkbox" checked="checked" value="checkbox" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color:#F86161">'+remoteMess2+'<span style="display:inline-block;">'+appData.money+'</span>'+'<u id="zz">'+data4.cityMess.cityinfo.extrapay+'</u></span>');
                                            $("div.spec_Btns>a").attr("href","javascript:return false;"); //
                                            $(".spec_Btns>a").css('opacity','0.2');
                                            $("#d1").attr("onclick", "");
                                            $("div.submit>button").attr("onclick", "");
                                            $("div.submit>button").css('opacity','0.2');
                                            $("#tijiao").attr("onclick", "");
                                            $("#tijiao").css("opacity", "0.2");
                                            $("#tijiao1").attr("onclick","");
                                            $("#tijiao1").css("opacity", "0.2");
                                            $("#yunfei").append('<span>快递费</span><span class="price">'+appData.money+data4.cityMess.cityinfo.extrapay+'</span>');
                                            //$("#yunfei").append('<span class="price">'+appData.money+data4.cityMess.cityinfo.extrapay+'</span>');
                                            $("#yunfei1").append('<span>'+data4.cityMess.cityinfo.extrapay+'</span>');
                                           // $("#kuaidi").val(data4.cityMess.cityinfo.extrapay);
                                            $("#yunName").append('<span>'+messMoney+'</span>');
                                            $("#yunMoney").append('<span>'+appData.money+data4.cityMess.cityinfo.extrapay+'</span>');
                                           //calc_price_nocart();
                                            //$('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                                            //$('#realprice').text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                                            if($("#realprice").find("span").length>0){
                                                $('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                                            }else{
                                                $("#realprice").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                                            }
                                            var checked = document.getElementById("remote");
                                            if(checked.checked){
                                                $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                                                $(".spec_Btns>a").css('opacity','1');
                                                $("#d1").attr("onclick", "submit_order();");
                                                $("div.submit>button").attr("onclick", "submit_order_nocart()");
                                                $("div.submit>button").css('opacity','1');
                                                $("#tijiao").attr("onclick", "submit_order_nocart();");
                                                $("#tijiao").css("opacity", "1");
                                                $("#tijiao1").attr("onclick","submit_order_nocart()");
                                                $("#tijiao1").css("opacity", "1");
                                            }else{
                                                $("div.spec_Btns>a").attr("href","javascript:return false;");
                                                $(".spec_Btns>a").css('opacity','0.2');
                                                $("#d1").attr("onclick", "");
                                                $("div.submit>button").attr("onclick", "");
                                                $("div.submit>button").css('opacity','0.2');
                                                $("#tijiao").attr("onclick", "");
                                                $("#tijiao").css("opacity", "0.2");
                                                $("#tijiao1").attr("onclick","");
                                                $("#tijiao1").css("opacity", "0.2");
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }else{
                        mark = 0;
                        if(data3.cityMess.cityinfo.isallow === '禁止'){
                            $("#pianyuan>div").html('');
                            $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                            $(".spec_Btns>a").css('opacity','1');
                            $("#d1").attr("onclick", "submit_order();");
                            $("div.submit>button").attr("onclick", "submit_order_nocart();");
                            $("div.submit>button").css('opacity','1');
                            $("#tijiao").attr("onclick", "submit_order_nocart();");
                            $("#tijiao").css("opacity", "1");
                            $("#tijiao1").attr("onclick","submit_order_nocart();");
                            $("#tijiao1").css("opacity", "1");
                            $("#yunfei").html('');
                            $("#yunName").html('');
                            $("#yunMoney").html('');
                            //calc_price_nocart();
                            //$('#realprice').text(appData.money+''+appData.realprice);
                            //$('#realprice').children("span").text(appData.money+''+appData.realprice);
                            if($("#realprice").find("span").length>0){
                                $('#realprice').children("span").text(appData.money+''+appData.realprice);
                            }else{
                                $('#realprice').text(appData.money+''+appData.realprice);
                            }
                        }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 0)){
                            $("#yunfei").html('');
                            $("#yunName").html('');
                            $("#yunMoney").html('');
                            $("div.spec_Btns>a").attr("href","javascript:return false;");
                            $(".spec_Btns>a").css('opacity','0.2');
                            $("#pianyuan>div").html('');
                            $("#pianyuan>div").append('<span style="color: #F86161">'+remoteMess1+'</span>');
                            $("#d1").attr("onclick", "");
                            $("div.submit>button").attr("onclick", "");
                            $("div.submit>button").css('opacity','0.2');
                            $("#tijiao").attr("onclick", "");
                            $("#tijiao").css("opacity", "0.2");
                            $("#tijiao1").attr("onclick","");
                            $("#tijiao1").css("opacity", "0.2");
                            $("#yunfei").html('');
                            $("#yunName").html('');
                            $("#yunMoney").html('');
                           // calc_price_nocart();
                            //$('#realprice').children("span").text(appData.money+''+appData.realprice);
                            //$('#realprice').text(appData.money+''+appData.realprice);
                            if($("#realprice").find("span").length>0){
                                $('#realprice').children("span").text(appData.money+''+appData.realprice);
                            }else{
                                $('#realprice').text(appData.money+''+appData.realprice);
                            }
                        }else if((data3.cityMess.cityinfo.isallow === '允许')&&(data3.cityMess.cityinfo.isArrive === 1)){
                            $("#yunfei").html('');
                            $("#yunName").html('');
                            $("#yunMoney").html('');
                            $("#pianyuan>div").html('');
                           // $("#pianyuan>div").append('<input type="checkbox" value="1" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color: #F86161;">'+remoteMess2+'<u>'+appData.money+data3.cityMess.cityinfo.extrapay+'</u></span>');
                            $("#pianyuan>div").append('<input type="checkbox"  name="checkbox" checked="checked" value="checkbox" id="remote" onclick="getValue();" data-am-ucheck style="-webkit-appearance: checkbox;"><span style="color:#F86161">'+remoteMess2+'<span style="display:inline-block;">'+appData.money+'</span>'+'<u id="zz">'+data3.cityMess.cityinfo.extrapay+'</u></span>');
                            $("div.spec_Btns>a").attr("href","javascript:return false;"); //
                            $(".spec_Btns>a").css('opacity','0.2');
                            $("#d1").attr("onclick", "");
                            $("div.submit>button").attr("onclick", "");
                            $("div.submit>button").css('opacity','0.2');
                            $("#tijiao").attr("onclick", "");
                            $("#tijiao").css("opacity", "0.2");
                            $("#tijiao1").attr("onclick","");
                            $("#tijiao1").css("opacity", "0.2");
                            $("#yunfei").append('<span>快递费</span><span class="price">'+appData.money+data3.cityMess.cityinfo.extrapay+'</span>');
                            //$("#yunfei").append('<span class="price">'+appData.money+data3.cityMess.cityinfo.extrapay+'</span>');
                            //$("#kuaidi").val(data3.cityMess.cityinfo.extrapay);
                            $("#yunfei1").append('<span>'+data3.cityMess.cityinfo.extrapay+'</span>');
                            $("#yunName").append('<span>'+messMoney+'</span>');
                            $("#yunMoney").append('<span>'+appData.money+data3.cityMess.cityinfo.extrapay+'</span>');
                            //calc_price_nocart();
                            //$('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                            //$('#realprice').text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                            if($("#realprice").find("span").length>0){
                                $('#realprice').children("span").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                            }else{
                                $("#realprice").text(appData.money+''+(appData.realprice+parseInt($("#zz").text())));
                            }
                            var checked = document.getElementById("remote");
                            if(checked.checked){
                                $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
                                $(".spec_Btns>a").css('opacity','1');
                                $("#d1").attr("onclick", "submit_order();");
                                $("div.submit>button").attr("onclick", "submit_order_nocart()");
                                $("div.submit>button").css('opacity','1');
                                $("#tijiao").attr("onclick", "submit_order_nocart();");
                                $("#tijiao").css("opacity", "1");
                                $("#tijiao1").attr("onclick","submit_order_nocart()");
                                $("#tijiao1").css("opacity", "1");
                            }else{
                                $("div.spec_Btns>a").attr("href","javascript:return false;");
                                $(".spec_Btns>a").css('opacity','0.2');
                                $("#d1").attr("onclick", "");
                                $("div.submit>button").attr("onclick", "");
                                $("div.submit>button").css('opacity','0.2');
                                $("#tijiao").attr("onclick", "");
                                $("#tijiao").css("opacity", "0.2");
                                $("#tijiao1").attr("onclick","");
                                $("#tijiao1").css("opacity", "0.2");
                            }
                        }
                    }
                }
            })
        }
    }

    init_Select(appData.money,id,subid);
}
function getValue(){
    var checked = document.getElementById("remote");
    if(checked.checked){
        $("div.spec_Btns>a").attr("href","javascript:submit_order_nocart();");
        $(".spec_Btns>a").css('opacity','1');
        $("#d1").attr("onclick", "submit_order();");
        $("div.submit>button").attr("onclick", "submit_order_nocart()");
        $("div.submit>button").css('opacity','1');
        $("#tijiao").attr("onclick", "submit_order_nocart();");
        $("#tijiao").css("opacity", "1");
        $("#tijiao1").attr("onclick","submit_order_nocart()");
        $("#tijiao1").css("opacity", "1");
    }else{
        $("div.spec_Btns>a").attr("href","javascript:return false;");
        $(".spec_Btns>a").css('opacity','0.2');
        $("#d1").attr("onclick", "");
        $("div.submit>button").attr("onclick", "");
        $("div.submit>button").css('opacity','0.2');
        $("#tijiao").attr("onclick", "");
        $("#tijiao").css("opacity", "0.2");
        $("#tijiao1").attr("onclick","");
        $("#tijiao1").css("opacity", "0.2");
    }
}
function init_Select(code,id,ele) {
        $("#hdfk").show();
        $("#scqh").hide();
        $('#clientaddress').val('').removeAttr("disabled");
        $(ele).empty();
        $('#clientzipcode').empty();
        $.getJSON('/api/getSubAddressList?countryCode='+code+'&addressId='+id,function (data) {
            $.each(data,function (index,item) {
                if(!ele){
                    //if(item.displayName){
                    $('#clientzipcode').append('<option value="'+item.displayName+'">'+item.displayName+'</option>');
                    //}
                }else{
                    $(ele).append('<option value="'+item.name+'" data-id="'+item.id+'">'+item.name+'</option>');
                }
            });
        });
}
//立即购买滚动
function go_buy() {
  document.getElementById("buy").scrollIntoView(true);
}
function check_top(){
    var ele_top = $('.spec_Btns').offset().top;
    var top = (window.innerHeight ? window.innerHeight : $(window).height()) + $(window).scrollTop();
    if(top >= ele_top){
        $('.cart-box-fixed').hide();
    }else{
        $('.cart-box-fixed').show();
    }
}


//tools
var tools = {
    show_msg:function (info, time) {
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
    show_loading:function (info, time) {
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
    show_win:function(content) {
        $(content).show();
    },
    close_win:function(con){
        $(con).hide();
    },
    close_all:function () {
        layer.closeAll();
    }
};
//提交评论
function add_comment() {
    var TW_phone = /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[0-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/;
    var HK_phone = /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/;
    var RM_phone= /^([0-9-]+)$/;
    var otherPhone = /^([0-9-]+)$/;
    var a = $("#comment_phone").val(),e = $("#comment_body").val();
    if(appData.money === 'HK'){
        if(!a||!HK_phone.test(a)) {
            $('#comment_phone').focus();
            return tools.show_msg(PhoneStr);
        }
    }else if(appData.money === 'NT'){
        if(!a||!TW_phone.test(a)) {
            $('#comment_phone').focus();
            return tools.show_msg(PhoneStr);
        }
    }else if(appData.money === 'RM'){
        if(!a||!RM_phone.test(a)) {
            $('#comment_phone').focus();
            return tools.show_msg(PhoneStr);
        }
    }else{
        if(!a||a === ' '||!otherPhone.test(a)) {
            $('#comment_phone').focus();
            return tools.show_msg(PhoneStr);
        }
    }
    var t = $(".comment_btn").text();
    $(".comment_btn").attr("disabled", "disabled"),
        $(".comment_btn").html(submitComment),
        setTimeout(function() {
            $(".comment_btn").html(t),
                $(".comment_btn").attr("disabled", !1)
        }, 200),
        $.post("/comment", {
            goodsid: appData.goods.id,
            phone: a,
            body: e,
            sitedir: appData.sitedir,
            referrer:document.referrer?document.referrer:'直接进入',
        }, function(a) {
            tools.show_msg(a.Info[appData.language]),
            a.Error || ($("#comment_phone").val(""),
                $("#comment_body").val("")),
                $(".comment_btn").html(t),
                $(".comment_btn").attr("disabled", !1)
        })
}
//台湾商超取货
function pay_shop(shop,type){
    $("#scqh").show();
    $("#hdfk").hide();
    $("#city1").empty();
    $('#area1').empty();
    $('#store').empty();
    $('#clientaddress').val('').removeAttr("disabled");
    $.ajax({
        type:"POST",
        url:appData.apiserver+'/twStore/'+shop,
        contentType:"application/json",
        data: JSON.stringify({
            type:type,
        }),
        error:function (data) {
            tools.show_msg(submiterrorStr);
        },
        success:function(data) {
            $.each(data,function (index,item) {
                $("#city1").append('<option value="'+item.cityName+'" data-id="'+item.cityId+'">'+item.cityName+'</option>');
            });
        }
    });
}
var storeList=[];
function select_area(type){
    if($("#payment2").is(":checked")){
        shop="shop711";
    }else{
        shop="family"
    }
    if(type==="getTown") {
        $('#area1').empty();
        $("#store").empty();
        $('#clientaddress').val('').removeAttr("disabled");
    }else{
        $("#store").empty();
        $('#clientaddress').val('').removeAttr("disabled");
    }
    $.ajax({
        type:"POST",
        url:appData.apiserver+'/twStore/'+shop,
        contentType:"application/json",
        data: JSON.stringify({
            type:type,
            city:$("#city1").val(),
            area:$("#area1").val(),
        }),
        error:function (data) {
            tools.show_msg(submiterrorStr);
        },
        success:function(data) {
            if(type==="getTown"){
                $.each(data,function (index,item) {
                    $("#area1").append('<option value="'+item.TownName+'" data-id="'+item.TownID+'">'+item.TownName+'</option>');
                });
            }else{
                storeList=data;
                $("#store").append('<option value="">请选择店铺</option>');
                if($("#payment2").is(":checked")){
                    $.each(data,function (index,item) {
                        $("#store").append('<option value="'+item.Address+'" data-id="'+item.POIID+'">'+item.POIName+'——'+item.Address+'</option>');
                    });
                }else{
                    $.each(data,function (index,item) {
                        $("#store").append('<option value="'+item.NAME+'" data-id="'+item.SERID+'">'+item.NAME+'</option>');
                    });
                }

            }

        }
    });

}
function select_store(){
    var store=$("#store").val();
    if(!store)$('#clientaddress').val('').removeAttr("disabled");

    if($("#payment2").is(":checked")){
        for(var item of storeList){
            if(item.Address===store){
                var address=item.Address+'。店名：'+item.POIName+'。店号：'+item.POIID+'。电话：'+item.Telno+'。';
                $("#clientaddress").val(address).attr("disabled",true);
            }
        }
    }else{
        for(var item of storeList){
            if(item.NAME===store){
                var address=item.addr+'。店名：'+item.NAME+'。店号：'+item.SERID+'。电话：'+item.TEL+'。';
                $("#clientaddress").val(address).attr("disabled",true);
            }
        }
    }
}
if(window.location.href.indexOf('buy')===-1&&window.location.href.indexOf('ordersearch')===-1){
    localStorage.setItem('url',window.location.href);
}

