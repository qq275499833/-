        //有购物车
        function select_specitem(ele) {
            var specEle = $(ele);
            if (appData.selectProd.name === specEle.data("name"))
                return;
            appData.selectProd.name = specEle.data("name");
            specEle.siblings('.opt1').removeClass('active');
            specEle.addClass('active');
            var items = $('#product-spec .option1>.opt2');
            if (items.length > 0) {
                items.removeClass('active');
                items.addClass('disable');
                for(var i=0;i<items.length;i++){
                    items.eq(i).text(items.eq(i).data("name"));
                    items.eq(i).removeClass("oos");
                }
                for (var i in appData.goods.specs) {
                    var spec = appData.goods.specs[i];
                    if (spec.name + '' === appData.selectProd.name + '') {
                        $.each(items, function (index, span) {
                            if ($(span).data('name') + '' === spec.option1 + '') {
                                var item = $(items[index]);
                                item.data('sku', spec.id);
                                item.data('price', spec.price);
                                item.removeClass('disable');
                                if($('#spec_option2>.opt3').length===0){
                                    if(spec.inventory===0){
                                        item.addClass("disable").addClass("oos");
                                        item.text(item.data("name")+oos);
                                        item.removeAttr("onclick");
                                    }else{
                                        item.removeClass("disable").removeClass("oos");
                                        item.text(item.data("name"));
                                        item.attr("onclick","select_option1(this)");
                                    }
                                }
                            }
                        });
                    }
                }
                var option1_li = $(items.not('.disable'));
                if (option1_li.length === 0) {
                    appData.selectProd.sku = specEle.data("sku");
                    appData.selectProd.price = specEle.data("price");
                    $('#goods_price').text(appData.money + ' ' + appData.selectProd.price);
                } else if (option1_li.length === 1) {
                    appData.selectProd.sku = '';
                    appData.selectProd.option1 = '';
                    appData.selectProd.img = specEle.data('img');
                    $("#spec-goods").text(appData.selectProd.name + " " + appData.selectProd.option1 + " " + appData.selectProd.option2);
                    if(specEle.data('img')){
                        $("#selected-img").attr("src", appData.imgpath + specEle.data('img'));
                    }
                    option1_li.click();
                    return false;
                } else {
                    appData.selectProd.sku = '';
                    appData.selectProd.option1 = '';
                }
                var option2_li = $('#product-spec .option2>.opt3');
                option2_li.removeClass('active');
                option2_li.addClass('disable');
                for(var i=0;i<option2_li.length;i++){
                    option2_li.eq(i).text(option2_li.eq(i).data("name"));
                    option2_li.eq(i).removeClass("oos");
                }
            } else {
                appData.selectProd.sku = specEle.data("sku");
                appData.selectProd.price = specEle.data("price");
                $('#goods_price').text(appData.money + ' ' + appData.selectProd.price);
            }
            appData.selectProd.img = specEle.data('img');
            $("#spec-goods").text(appData.selectProd.name + " " + appData.selectProd.option1 + " " + appData.selectProd.option2);
            if(specEle.data('img')) {
                $("#selected-img").attr("src", appData.imgpath + specEle.data('img'));
            }
        }
        function select_option1(ele) {
            var optionEle = $(ele);
            if ($('.option1>.active').text() === optionEle.data("name"))
                return;
            if (optionEle.hasClass('disable'))
                return;
            optionEle.siblings('.opt2').removeClass('active');
            optionEle.addClass('active');
            appData.selectProd.option1 = optionEle.data("name");
            appData.selectProd.sku = optionEle.data("sku");
            var items = $('#product-spec .option2>.opt3');
            if (items.length > 0) {
                items.removeClass('active');
                items.addClass('disable');
                for(var i=0;i<items.length;i++){
                    items.eq(i).text(items.eq(i).data("name"));
                    items.eq(i).removeClass("oos");
                }
                for (var i in appData.goods.specs) {
                    var spec = appData.goods.specs[i];
                    if (spec.name + '' === appData.selectProd.name + '' &&
                        spec.option1 + '' === appData.selectProd.option1 + '') {
                        $.each(items, function (index, span) {
                            if ($(span).data('name') + '' === spec.option2 + '') {
                                var item = $(items[index]);
                                item.data('price', spec.price);
                                item.data('sku', spec.id);
                                item.removeClass('disable');
                                if(spec.inventory===0){
                                    item.addClass("disable").addClass("oos");
                                    item.text(item.data("name")+oos);
                                    item.removeAttr("onclick");
                                }else{
                                    item.removeClass("disable").removeClass("oos");
                                    item.text(item.data("name"));
                                    item.attr("onclick","select_option2(this)");
                                }

                            }
                        });
                    }
                }
                var option2_li = $(items.not('.disable'));
                if (option2_li.length === 0) {
                    appData.selectProd.price = optionEle.data("price");
                    appData.selectProd.sku = optionEle.data("sku");
                    $('#goods_price').text(appData.money + appData.selectProd.price);
                } else if (option2_li.length === 1) {
                    appData.selectProd.sku = '';
                    appData.selectProd.option2 = '';
                    $("#spec-goods").text(appData.selectProd.name + " " + appData.selectProd.option1 + " " + appData.selectProd.option2);
                    option2_li.click();
                    return false;
                } else {
                    appData.selectProd.sku = '';
                    appData.selectProd.option2 = '';
                    $("#spec-goods").text(appData.selectProd.name + " " + appData.selectProd.option1 + " " + appData.selectProd.option2);
                }
            } else {
                $.each(appData.goods.specs, function (index, spec) {
                    if (spec.name + '' === '' + appData.selectProd.name &&
                        spec.option1 + '' === '' + appData.selectProd.option1) {
                        appData.selectProd.price = spec.price;
                        return false;
                    }
                });
                $("#spec-goods").text(appData.selectProd.name + " " + appData.selectProd.option1 + " " + appData.selectProd.option2);
                $('#goods_price').text(appData.money + appData.selectProd.price);
            }
        }
        function select_option2(ele) {
            var optionEle = $(ele);
            if ($('.option2>.active').text() === optionEle.data("name"))
                return;
            if (optionEle.hasClass('disable'))
                return;
            optionEle.siblings('.opt3').removeClass('active');
            optionEle.addClass('active');
            appData.selectProd.option2 = optionEle.data("name");
            appData.selectProd.sku = optionEle.data("sku");
            $.each(appData.goods.specs, function (index, spec) {
                if (spec.name + '' === appData.selectProd.name + '' &&
                    spec.option1 + '' === appData.selectProd.option1 + '' &&
                    spec.option2 + '' === appData.selectProd.option2 + '') {
                    appData.selectProd.price = spec.price;
                    return false;
                }
            });
            $("#spec-goods").text(appData.selectProd.name + " " + appData.selectProd.option1 + " " + appData.selectProd.option2);
            $('#goods_price').text(appData.money + appData.selectProd.price);
        }
        function calc_price() {
            var ret = cart.getQuantity();
            appData.prods = cart.getAllProduct();
            var allnum = ret.totalNumber;
            var allprice = 0;
            var manyoff_price = 0;
            var realprice = 0;
            var saleoff_price = 0;
            var moneyprice=0;
            for (var i in appData.prods) {
                var prod = appData.prods[i];
                allprice += prod.price * prod.number;
            }
            for (var j in appData.goods.manyoff_new) {
                var item = appData.goods.manyoff_new[j];
                for (var k = 1; k <= allnum; k++) {
                    if (item.salecount === parseInt(k) && prod.price > 0) {
                        manyoff_price += item.price;
                    }
                }
            }
            realprice = allprice - manyoff_price;
            for (var i in appData.goods.manyoff) {
                if (appData.goods.manyoff[i].salecount === ret.totalNumber) {
                    if (appData.goods.manyoff[i].price > 0) {
                        realprice = appData.goods.manyoff[i].price;
                    }
                }
            }
            for (var j in appData.goods.saleoff) {
                var item = appData.goods.saleoff[j];
                if (ret.totalNumber >= item.salecount) {
                    saleoff_price = item.offprice;
                }
            }
            realprice = realprice - saleoff_price;
            // 价格满减
            if(appData.goods.priceoff.length>0){
                appData.goods.priceoff=appData.goods.priceoff.sort(compare('totalmoney'));
                var i=com_index(appData.goods.priceoff,realprice);
                if(i>=0){
                    moneyprice=appData.goods.priceoff[i].saleprice;
                }else if(i===undefined){
                    moneyprice=appData.goods.priceoff[appData.goods.priceoff.length-1].saleprice;
                }
                realprice=realprice-moneyprice;
            }
            if (manyoff_price > 0) {
                $("#many_discount").show();
                $('#manyoff').text(appData.money + " -" + manyoff_price);
            } else {
                $("#many_discount").hide();
            }
            if (saleoff_price > 0)
                $('#saleoffprice_div').show();
            else
                $('#saleoffprice_div').hide();
            if(moneyprice>0){
                $("#moneyprice").show();
                $("#price_money").text(appData.money + "-" + moneyprice);
            }else{
                $("#moneyprice").hide();
            }
            $('#allCount').children("span").text(allnum);
            $('#allprice').children("span").text(appData.money + " " + allprice);
            $('#saleoffprice').children("span").text(appData.money + " - " + saleoff_price);
            appData.haha = realprice;
            $('#realprice').children("span").text(appData.money + " " + realprice);
            if($("#zz").text() ===''){
                $('#realprice').children("span").text(appData.money + " " + (realprice));
            }else{
                $('#realprice').children("span").text(appData.money + " " + (realprice+ parseInt($("#zz").text())));
            }
            appData.realprice = realprice;
        }
        //无购物车商品
        function select_specitem_nocart(ele, index) {
            var specEle = $(ele);
            if (appData.prods[index - 1].specname === specEle.data("name"))
                return;
            appData.prods[index - 1].specname = specEle.data("name");
            appData.prods[index - 1].img = specEle.data("img");
            specEle.siblings('.opt1').removeClass('active');
            specEle.addClass('active');
            var items = $('#spec_option1_' + index + '>.opt2');
            if (items.length > 0) {
                items.removeClass('active');
                items.addClass('disable');
                for(var i=0;i<items.length;i++){
                    items.eq(i).text(items.eq(i).data("name"));
                    items.eq(i).removeClass("oos");
                }
                for (var i in appData.goods.specs) {
                    var spec = appData.goods.specs[i];
                    if (spec.name + '' === appData.prods[index - 1].specname + '') {
                        $.each(items, function (J, span) {
                            if ($(span).data("name") + '' === spec.option1 + '') {
                                var item = $(items[J]);
                                item.data('price', spec.price);
                                item.data('sku', spec.id);
                                item.removeClass('disable');
                                if($('#spec_option2_' + index + '>.opt3').length===0){
                                    if(spec.inventory===0){
                                        item.addClass("disable").addClass("oos");
                                        item.text(item.data("name")+oos);
                                        item.removeAttr("onclick");
                                    }else{
                                        item.removeClass("disable").removeClass("oos");
                                        item.text(item.data("name"));
                                        item.attr("onclick","select_option1_nocart(this," + index + ")");
                                    }
                                }

                            }
                        });
                    }
                }
                var option1_li = $(items.not('.disable'));
                if (option1_li.length === 0) {
                    appData.prods[index - 1].sku = specEle.data("sku");
                    appData.prods[index - 1].price = specEle.data("price");
                    calc_price_nocart();
                } else if (option1_li.length === 1) {
                    appData.prods[index - 1].sku = '';
                    appData.prods[index - 1].option1 = '';
                    option1_li.click();
                    return false;
                } else {
                    appData.prods[index - 1].sku = '';
                    appData.prods[index - 1].option1 = '';
                }
                var option2_li = $('#spec_option2_' + index + '>.opt3');
                option2_li.removeClass('active');
                option2_li.addClass('disable');
                for(var i=0;i<option2_li.length;i++){
                    option2_li.eq(i).text(option2_li.eq(i).data("name"));
                    option2_li.eq(i).removeClass("oos");
                }

            } else {
                appData.prods[index - 1].sku = specEle.data("sku");
                appData.prods[index - 1].price = specEle.data("price");
                calc_price_nocart();
            }
            appData.selectProd.img = specEle.data('img');
        }

        function select_option1_nocart(ele, index) {
            var optionEle = $(ele);
            if (appData.prods[index - 1].option1 === optionEle.data("name"))
                return;
            if (optionEle.hasClass('disable'))
                return;
            optionEle.siblings(".opt2").removeClass('active');
            optionEle.addClass('active');
            appData.prods[index - 1].option1 = optionEle.data("name");
            appData.prods[index - 1].sku = optionEle.data("sku");
            var items = $('#spec_option2_' + index + '>.opt3');
            if (items.length > 0) {
                for(var i=0;i<items.length;i++){
                    items.eq(i).text(items.eq(i).data("name"));
                    items.eq(i).removeClass("oos");
                }
                items.removeClass('active');
                items.addClass('disable');
                for (var i in appData.goods.specs) {
                    var spec = appData.goods.specs[i];
                    if (spec.name + '' === appData.prods[index - 1].specname + '' &&
                        spec.option1 + '' === appData.prods[index - 1].option1 + '') {
                        $.each(items, function (J, span) {
                            if ($(span).data("name") + '' === spec.option2 + '') {
                                var item = $(items[J]);
                                item.data('price', spec.price);
                                item.data('sku', spec.id);
                                item.removeClass('disable');
                                if (spec.inventory === 0) {
                                    item.addClass("disable").addClass("oos");
                                    item.text(item.data("name")+oos);
                                    item.removeAttr("onclick");
                                }else{
                                    item.removeClass("disable").removeClass("oos");
                                    item.text(item.data("name"));
                                    item.attr("onclick","select_option2_nocart(this," + index + ")");
                                }

                            }
                        });
                    }
                }
                var option2_li = $(items.not('.disable'));
                if (option2_li.length === 0) {
                    appData.prods[index - 1].price = optionEle.data("price");
                    appData.prods[index - 1].sku = optionEle.data("sku");
                    calc_price_nocart();
                } else if (option2_li.length === 1) {
                    appData.prods[index - 1].sku = '';
                    appData.prods[index - 1].option2 = '';
                    option2_li.click();
                    return false;
                } else {
                    appData.prods[index - 1].sku = '';
                    appData.prods[index - 1].option2 = '';
                }
            } else {
                $.each(appData.goods.specs, function (i, spec) {
                    if (spec.name + '' === '' + appData.prods[index - 1].specname &&
                        spec.option1 + '' === '' + appData.prods[index - 1].option1) {
                        appData.prods[index - 1].price = spec.price;
                        calc_price_nocart();
                        return false;
                    }
                });
            }
        }
        function select_option2_nocart(ele, index) {
            var optionEle = $(ele);
            if (appData.prods[index - 1].option2 === optionEle.data("name"))
                return;
            if (optionEle.hasClass('disable'))
                return;
            optionEle.siblings('.opt3').removeClass('active');
            optionEle.addClass('active');
            appData.prods[index - 1].option2 = optionEle.data("name");
            appData.prods[index - 1].sku = optionEle.data("sku");
            $.each(appData.goods.specs, function (i, spec) {
                if (spec.name + '' === appData.prods[index - 1].specname + '' &&
                    spec.option1 + '' === appData.prods[index - 1].option1 + '' &&
                    spec.option2 + '' === appData.prods[index - 1].option2 + '') {
                    appData.prods[index - 1].price = spec.price;
                    calc_price_nocart();
                    return false;
                }
            });
        }
        function calc_price_nocart() {
            var allprice = 0;
            var manyoff_price = 0;
            var offprice = 0;
            var moneyprice=0;
            var realprice = 0;
            for (var i in appData.prods) {
                var prod = appData.prods[i];
                allprice += prod.price;
                for (var j in appData.goods.manyoff_new) {
                    var item = appData.goods.manyoff_new[j];
                    if (item.salecount === parseInt(i) + 1 && prod.price > 0) {
                        manyoff_price += item.price;
                    }
                }
            }
            realprice = allprice - manyoff_price;
            for (var i in appData.goods.manyoff) {
                if (appData.goods.manyoff[i].salecount === appData.prods.length) {
                    if (appData.goods.manyoff[i].price > 0) {
                        realprice = appData.goods.manyoff[i].price;
                    }
                }
            }
            //满减优惠
            if (appData.goods.saleoff.length > 0) {
                for (var i in appData.goods.saleoff) {
                    var r = appData.goods.saleoff[i];
                    if (appData.prods.length >= r.salecount) {
                        offprice = r.offprice;
                    }
                }
            }
            realprice = realprice - offprice;
            // 价格满减
            if(appData.goods.priceoff&&appData.goods.priceoff.length>0){
                appData.goods.priceoff=appData.goods.priceoff.sort(compare('totalmoney'));
                var i=com_index(appData.goods.priceoff,realprice);
                if(i>=0){
                    moneyprice=appData.goods.priceoff[i].saleprice;
                }else if(i===undefined){
                    moneyprice=appData.goods.priceoff[appData.goods.priceoff.length-1].saleprice;
                }
                realprice=realprice-moneyprice;
            }
            $('#allprice').text(appData.money + " " + allprice);
            $('#allprice1').text(appData.money + " " + allprice);
            //console.log(moneyprice);
            if (manyoff_price > 0) {
                $("#many_discount").show();
                $('#manyoff').text(appData.money + " -" + manyoff_price);
            } else {
                $("#many_discount").hide();
            }
            if (offprice > 0) {
                $("#price_off").show();
                $("#offprice").text(appData.money + "-" + offprice);
            } else {
                $("#price_off").hide();
            }
            if(moneyprice>0){
                $("#moneyprice").show();
                $("#price_money").text(appData.money + "-" + moneyprice);
            }else{
                $("#moneyprice").hide();
            }
            if (appData.goods.manyoff.length  && (allprice - realprice) > 0) {
                $("#discount_money").show();
                $("#discount").text(appData.money + " " + (allprice - realprice));
            } else {
                $("#discount_money").hide();
            }
            if($("#zz").text() ===''){
                $('#realprice').text(appData.money + " " + (realprice));
            }else{
                $('#realprice').text(appData.money + " " + (realprice+ parseInt($("#zz").text())));
            }
            $('#realprice1').text(appData.money + " " + realprice);
            appData.realprice = realprice;
        }
        function compare(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        }
        function com_index(arr,num){
            for(var i=0;i<arr.length;i++){
                if(arr[i].totalmoney>num){
                    return i-1;
                }
            }
        }
        function calc_salecount() {
            for (var i = 0; i < parseInt(appData.goods.manyoff_new[0].salecount); i++) {
                if (i === 0) {
                    add_goodsinfo();
                } else {
                    add_goodsinfo();
                    add_spec(true);
                }
            }
        }
        function add_goodsinfo() {
            appData.prods.push({
                id: appData.goods.id,
                sourceid: appData.goods.sourceid,
                userkey: appData.goods.userkey,
                name: appData.goods.name,
                specname: '',
                sku: '',
                price: 0,
                img: '',
                option1: '',
                option2: '',
                number: 1
            });

        }
        var html = $(".product_item") ? $(".product_item").html() : "";
        //添加规格
        function add_spec(hideclose) {
            if (hideclose) {
                $("#product-spec").append(" <div class='item product_item'>" + html + "</div>");
            } else {
                $("#product-spec").append(" <div class='item product_item'><div class='close rt' onclick='close_spec(this);close_giftspec();'><img src='http://static.seezt.cc/theme/jd/images/icon/15.png'></div>" + html + "</div>");
            }
            update_class();

        }
        //删除规格
        function close_spec(ele) {
            var ele = $(ele);
            ele.parent("div.product_item").prop("outerHTML", "");
            appData.prods.splice(appData.prods.length - 1, 1);
            update_class();
            calc_price_nocart();
        }
    //更新id
        function update_class() {
            var product_item = $(".product_item");
            var length = parseInt(product_item.length);
            appData.index = length;
            product_item.eq(length - 1).find(".spec_Title span").text(appData.index);
            product_item.eq(length - 1).find(".user-name").attr("id", "spec_names_" + appData.index);
            product_item.eq(length - 1).find(".option1").attr("id", "spec_option1_" + appData.index);
            product_item.eq(length - 1).find(".option2").attr("id", "spec_option2_" + appData.index);
            product_item.eq(length - 1).find(".user-name>.opt1").attr("onclick", "select_specitem_nocart(this," + appData.index + ")");
            product_item.eq(length - 1).find(".option1>.opt2").attr("onclick", "select_option1_nocart(this," + appData.index + ")");
            product_item.eq(length - 1).find(".option2>.opt3").attr("onclick", "select_option2_nocart(this," + appData.index + ")");
            if(appData.goods.count_info&&appData.goods.count_info.length>1){
                for (var i in appData.goods.count_info) {
                    if (parseInt(appData.goods.count_info[i].count) === appData.index) {
                        product_item.eq(length - 1).find(".spec_Title i").text(appData.goods.count_info[i].name);
                    }
                }
            }

        }
        function add_one(){
            add_spec();
            add_goodsinfo();
            //默认选中一级规格
            var product_item = $(".product_item");
            var length = parseInt(product_item.length);
            var isdefault = 0;
            for (var i in appData.goods.specs) {
                var spec = appData.goods.specs[i];
                if($("#spec_option1_1").length===0) {
                    if (spec.inventory === 0) {
                        var sku = spec.id;
                        var items = product_item.eq(length - 1).find(".opt1");
                        $.each(items, function (index, span) {
                            if ($(span).data("id") === sku) {
                                $(this).addClass("disable").addClass("oos");
                                $(this).children("span").css("color", "red").text($(span).data("name") + oos);
                                $(this).removeAttr("onclick");
                            }
                        })
                    }
                }
                if (spec.isdefault) {
                    isdefault = spec.isdefault;
                    var sku = spec.id;
                    var items = product_item.eq(length - 1).find(".opt1");
                    $.each(items, function (index, span) {
                        if ($(span).data("id") === sku) {
                            $(this).click();
                            return false;
                        }
                    })
                }
            }
            enterIndex();
        }
        //无购物车只有一级规格时判断缺货
        function init_nocart_oos(){
            for (var i in appData.goods.specs) {
                var spec = appData.goods.specs[i];
                if($("#spec_option1_1").length===0) {
                    if (spec.inventory === 0) {
                        var sku = spec.id;
                        var items = $(".opt1");
                        $.each(items, function (index, span) {
                            if ($(span).data("id") === sku) {
                                $(this).addClass("disable").addClass("oos");
                                $(this).children("span").css("color", "red").text($(span).data("name") +oos);
                                $(this).removeAttr("onclick");
                            }
                        })
                    }
                }
            }
        }
        //购物车只有一级规格时判断缺货
        function init_oos(){
            for (var i in appData.goods.specs) {
                var spec = appData.goods.specs[i];
                if($("#spec_option1").length===0) {
                    if (spec.inventory === 0) {
                        var sku = spec.id;
                        var items = $(".opt1");
                        $.each(items, function (index, span) {
                            if ($(span).data("id") === sku) {
                                $(this).addClass("disable").addClass("oos");
                                $(this).children("span").css("color", "red").text($(span).data("name") + oos);
                                $(this).removeAttr("onclick");
                            }
                        })
                    }
                }
            }
        }
        if (appData.goods.manyoff_new.length) {
            calc_salecount();
        } else {
            add_goodsinfo();
        }
        //-----------------------------无购物车赠品功能-----------------------------
        //start 赠品功能
        //1.创建赠品数组
        appData.giftSelect=[];
        if(appData.giftGoodsIds){
            for (var i=0;i< appData.giftGoodsIds.length;i++){
                var gift=[{
                    id: appData.giftGoodsIds[i].id,
                    specname: '',
                    sku: '',
                    price: 0,
                    img: '',
                    option1: '',
                    option2: '',
                    number: 1,
                    name:appData.giftGoodsIds[i].name
                }];
                appData.giftSelect[i]=gift;
            }
        }
        //2.初始化页面
        var gifts_item=$(".gifts_item");
        if(appData.giftGoodsIds){
            for (var i in appData.giftGoodsIds){
                gifts_item.eq(i).find(".user-name>.opt1").attr("onclick", "select_giftspec(this,"+i+",1)");
                gifts_item.eq(i).find(".option1>.opt2").attr("onclick", "select_giftoption1(this,"+i+",1)");
                gifts_item.eq(i).find(".option2>.opt3").attr("onclick", "select_giftoption2(this,"+i+",1)");
            }
            defaultSelected();
        }
        var gifthtml1=$("#gifts").html();
        if($(".product_item").length){
            enterIndex();
        }
        function enterIndex(){
            var goodslengthOne = $(".product_item").length;
            for(var i=0;i<appData.goods.manyoff.length;i++){
                if(appData.goods.manyoff[i].salecount === goodslengthOne){
                    if((appData.goods.manyoff[i].giftcount>0)&&(appData.goods.manyoff[i].giftcount)&&(appData.giftSelect.length)){
                        //获取赠品的个数
                        $("#giftArea").show();
                        $("#gifts").show();
                        var temp=appData.goods.manyoff[i].giftcount-appData.giftSelect[0].length;
                        if(temp>0){
                            for(var j=0;j<temp;j++){
                                $("#gifts").append(gifthtml1);
                                updateGift_class();
                            }
                        }else{
                            var j=Math.abs(temp);
                            var a=$("div.gifts");
                            a.splice(a.length-j,j);
                            $("#gifts").html(a);

                        }
                        for(var k in appData.giftSelect){
                            if(appData.giftSelect[k].length<appData.goods.manyoff[i].giftcount){
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
                            }else if(appData.giftSelect[k].length>appData.goods.manyoff[i].giftcount){
                                appData.giftSelect[k].splice(appData.giftSelect[k].length-1,appData.giftSelect[k].length-appData.goods.manyoff[i].giftcount);
                            }else{
                                appData.giftSelect[k] =  appData.giftSelect[k];
                            }
                        }
                        defaultSelected();
                        break;
                    }else{
                        $("#gifts").hide();
                        $("#giftArea").hide();
                    }
                }else{
                    $("#gifts").hide();
                    $("#giftArea").hide();
                }
            }
        }
        //3.商品数量增加时，更新赠品个数addone()
        //删除一个商品
        function close_giftspec() {
            enterIndex();
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
        //赠品三级规格点击事件
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
        //-----------------------------end 无购物车赠品功能-------------------------------------
        $(function () {
            //默认选中一级规格
            var isdefault = 0;
            for (var i in appData.goods.specs) {
                var spec = appData.goods.specs[i];
                if (spec.isdefault) {
                    isdefault = spec.isdefault;
                    var sku = spec.id;
                    var items = $("#product-spec .opt1");
                    $.each(items, function (index, span) {
                        if ($(span).data("id") === sku) {
                            $(this).click();
                            return false;
                        }
                    })
                }
            }
            if(appData.goods.count_info&&appData.goods.count_info[0]){
                $(".product_item").eq(0).find(".spec_Title i").text(appData.goods.count_info[0].name)
            }
        });
