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
    showConfirm: function (info, time) {
        layer.open({
            content: '继续购物吗？'
            , btn: ['下单', '继续浏览']
            , yes: function (index) {
                // location.reload();
                layer.close(index);
                $('#buybox2').css('display', 'block');
                refresh_prod_ul()
            },
        });

    },
    showWin: function (content, height, title) {
        layer.open({
            type: 1,
            title: title ? title : '',
            anim: 'up',
            style: 'position:fixed; bottom:0; left:0; width: 100%; height:' + height + ';border:none; -webkit-animation-duration: .4s; animation-duration: .4s',
            content: $(content).html()
        });
    },
    closeAll: function () {
        layer.closeAll();
    }
};
function select_specitem(ele) {
    var specEle = $(ele);
    if(appData.selectProd.name === specEle.data("name"))//判断是否已经选择此主规格
        return;
    appData.selectProd.name = specEle.data("name");//把主规格名称赋值给已选规格对象中
    specEle.siblings('div').removeClass('active');//清除其他已选择的主规格
    specEle.addClass('active');//把当前点击的主规格选中
    var items = $('.option1>div');//获取子级规格1的列表 option1
    if(items.length >0){//如果有子级规格1
        items.removeClass('active');//清除已选择的子级规格1
        items.addClass('disable');//灰掉所有子级规格1
        for(var i in appData.goods.specs){//循环全部规格列表
            var spec =appData.goods.specs[i];
            // console.log(spec.name);
            // console.log(appData.selectProd.name);
            if(spec.name+''=== appData.selectProd.name+''){//判断主规格名
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
        var option2_li = $('.option2>div');//获取子级规格2的列表
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
function select_option1(ele) {
    var optionEle = $(ele);
    if($('.option1>div.active').text() === optionEle.data("name"))
        return;
    if(optionEle.hasClass('disable'))
        return;
    optionEle.siblings('div').removeClass('active');
    optionEle.addClass('active');
    appData.selectProd.option1 =optionEle.data("name");
    appData.selectProd.sku = optionEle.data("sku");
    var items = $('.option2>div');
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
function select_option2(ele) {
    var optionEle = $(ele);
    if($('.option2>div.active').text() === optionEle.data("name"))
        return;
    if(optionEle.hasClass('disable'))
        return;
    optionEle.siblings('div').removeClass('active');
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
function addtocart(hidemsg) {
    if (!appData.selectProd.sku || appData.selectProd.sku === '') {

        if (!appData.selectProd.name) {
            return tools.showMsg("请您选择商品的" + appData.option1);
        }
        if (!appData.selectProd.option1) {
            return tools.showMsg("请您选择商品的" + appData.option2);
        }
        if (!appData.selectProd.option2) {
            return tools.showMsg("请您选择商品的" + appData.option3);
        }
    }
    var item = null;
    $.each(appData.goods.specs, function (index, spec) {
        if (spec.id === appData.selectProd.sku) {
            item = spec;
            return false;
        }
    });
    if (!item) return false;
    if (hidemsg) {
        var goods = cart.getProduct({sku: appData.selectProd.sku});
        if (goods) {
            $('#buybox2').css('display', 'block');
            refresh_prod_ul();
            return;
        }
    }
    // appData.addnum = parseInt($('#addnum').val());
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
    if (hidemsg) {
        $('#buybox2').css('display', 'block');
        refresh_prod_ul();
    } else {
        $('#addnum').val(1);
        tools.showConfirm('已加入到购物车,请选择去下单还是继续浏览', {
            btn: ['继续浏览', '去下单']
        }, function () {
            $("html,body").removeClass("no-scroll");
            $("#spec").hide();
            tools.closeAll();
        }, function () {
            $('#buybox2').css('display', 'block');
            refresh_prod_ul();
        });
    }
}

function proNum(x) {
    var num = $('.product_num').val();

    if (x.innerText == '+') {
        num++;
        // console.log($('.product_num')[0].value);
        $('.product_num')[0].value = num;
    } else if (x.innerText == '-' && $('.product_num')[0].value > 1) {
        num--;
        $('.product_num')[0].value = num;
    }
}

function sub_prod(sku) {
    var oldnum = cart.getProductNumber({sku: sku});
    if (oldnum - 1 > 0) {
        cart.updateNumber(-1, {sku: sku});
    } else {
        cart.deleteProduct({sku: sku});
    }
    refresh_prod_ul();
}

function add_prod(sku) {
    cart.updateNumber(1, {sku: sku});
    refresh_prod_ul();
}

function del_prod(sku) {
    cart.deleteProduct({sku: sku});
    refresh_prod_ul();
}
checkStyle();
function checkStyle() {
    var a = $('.product_num').val() == 1 ? '#fff' : '#f1f1f1';
    $('.min_btn').css('background', a);
}

function proNumBlur(x) {
    // console.log(x.value);
    if (x.value < 0) {
        x.value = 1;
    }

}

function calc_price() {
    var ret = cart.getQuantity();
    var allnum = ret.totalNumber;
    var allprice = ret.totalAmount;
    var realprice = allprice;
    $('#allCount').children("span").text(allnum);
    $('#allprice').children("span").text(allprice);
    $('#realprice').children("span").text(realprice);
    appData.realprice = realprice;
}

function refresh_prod_ul() {
    var order_goodslist = $('#productView');
    order_goodslist.empty();
    for (var i in cart.getAllProduct()) {
        var prod = cart.getAllProduct()[i];
        console.log(prod);
        prod.option1 = prod.option1 ? prod.option1 : '';
        prod.option2 = prod.option2 ? prod.option2 : '';
        order_goodslist.append(
            '<div class="holderx">' +
            '<img class="orderPic" src="http://cdn.seezt.cc/uploadimages/'+prod.img+'-101" alt=""> ' +
            '<div class="productText"> ' +
            '<p class="orderTitle" style="margin-bottom: 10px;">' + prod.name + '</p><div class="del_btn" onclick="del_prod(' + prod.sku + ')">×</div>' +
            '<p class="spec" style="margin-bottom: 10px">' + prod.specname + " " + prod.option1 + " " + prod.option2 + '</p>' +
            '<div class="btnwrap"">' +
            '<p class="specprice" style="color: #F25252;">￥' + prod.price + '</p>' +
            '<br>' +
            '</div>' +
            '<div id="allcount">' +
            '<a onclick="sub_prod(' + prod.sku + ');checkStyle();" class="min_btn">-</a>' +
            '<input type="text"  class="product_num"   value="' + prod.number + '">' +
            '<a  onclick="add_prod(' + prod.sku + ');checkStyle();" class="add_btn">+</a>' +
            '</div>' +
            '<div class="clearBoth"></div>' +
            '</div>' +
            '</div>'
        );
    }
    calc_price();
    if (cart.getAllProduct().length === 0) {
        show_cartisempty();
    }
}
function mouteAll(){
    $('.buyBox').css('display','none');
    $('.buyBox2').css('display','none');
    $('.buyBox3').css('display','none');
    $('#mainIndex').css('display','block');
}
function show_cartisempty() {
    mouteAll();
}

// refresh_prod_ul();
