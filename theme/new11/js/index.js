function refresh_prod_ul() {
    var cart_list_body=$("#cart_content");
    if(cart_list_body.length>0){
        $("#empty").hide();
        $("#price").show();
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
            var div= '<div class="cart-row" data-line="0"><div class="grid"><div class="grid-item large--seven-twelfths"><div class="grid">';
            if(prod.img){
                div+='<div class="grid-item one-third large--one-quarter"><a href="#" class="cart-image"><img title="'+prod.name+'" src="'+appData.imgpath+prod.img+'-101"></a></div>'
            }
           div+= '<div class="grid-item two-thirds large--three-quarters"><a href="#">'+prod.name+'</a><br><small>'+prod.specname+'</small><br><small>'+prod.option1+'</small><br><small>'+prod.option2+'</small></div></div></div>'+
            '<div class="grid-item large--five-twelfths medium--two-thirds push--medium--one-third"><div class="grid"><div class="grid-item one-half medium-down--one-third text-right">'+
            '<div class="ajaxifyCart--qty"><span class="dprice" style="display:none;">'+appData.money + prod.price+'</span>' +
            '<input name="updates[]" class="ajaxifyCart--num" value="'+prod.number+'" type="tel">'+
            '<span class="ajaxifyCart--qty-adjuster ajaxifyCart--add" dateadd="0" data-line="0" onclick="add_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')">+</span>'+
            '<span class="ajaxifyCart--qty-adjuster ajaxifyCart--minus" datesub="0" data-line="0" onclick="sub_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')">-</span></div></div>'+
            '<div class="grid-item one-third medium-down--one-third medium-down--text-left text-right"><span class="h2">' +
            '<small aria-hidden="true"><span class="money">'+appData.money+'<span class="money_price">'+ prod.price+'</span></span></small>'+
            '<span class="visually-hidden"><span class="money">'+appData.money+'<span class="money_price">'+ prod.price+'</span></span></span>'+
            '</span></div><div class="grid-item one-sixth medium-down--one-third text-right"><a href="javascript:;" data-line="1" data-id="0" onclick="del_prod('+JSON.stringify(prod).replace(/"/g, '&quot;')+')" class="icon-fallback-text btn-secondary remove ajaxifyCart--remove">'+
            '<span class="icon icon-x" aria-hidden="true"></span><span class="fallback-text">×</span></a></div></div></div></div></div>';
            //添加赠品显示
            if(prod.giftgoods) {
                for (var n in prod.giftgoods) {
                    var giftprod = prod.giftgoods[n];
                    var divgift= '<div class="cart-row" data-line="0"><div class="grid"><div class="grid-item large--seven-twelfths"><div class="grid">';
                    if(prod.img){
                        divgift+='<div class="grid-item one-third large--one-quarter"><a href="#" class="cart-image"><img  src="'+appData.imgpath+giftprod.img+'-101"></a></div>'
                    }
                    divgift+= '<div class="grid-item two-thirds large--three-quarters"><a href="#">'+giftprod.name+'</a><br><small>'+prod.specname+'</small><br><small>'+giftprod.option1+'</small><br><small>'+giftprod.option2+'</small></div></div></div>'+
                        '<div class="grid-item large--five-twelfths medium--two-thirds push--medium--one-third"><div class="grid">' +
                        '<div class="grid-item one-half medium-down--one-third text-right">'+
                        '<div class="ajaxifyCart--qty"><span class="dprice" style="display:none;">'+appData.money + giftprod.price+'</span>' +
                        '<input name="updates[]" class="ajaxifyCart--num" value="'+giftprod.number+'" type="tel" disabled>'+
                        '</div></div>' +
                        '<div class="grid-item one-third medium-down--one-third medium-down--text-left text-right">'+giftStr+'</div>'+
                        '</div></div></div></div>';
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
        var tr= '<tr class="product" data-product-id="9659096193" data-variant-id="35367613121" data-product-type="Beauty">';
        if(prod.img){
            tr+='<td class="product__image"><div class="product-thumbnail"><div class="product-thumbnail__wrapper">' +
                '<img alt="' + prod.name + '" class="product-thumbnail__image" src="' + appData.imgpath + prod.img + '">' +
                '</div><span class="product-thumbnail__quantity" aria-hidden="true">'+prod.number +'</span></div></td>';
        }
        tr+= '<td class="product__description">' +
            '<span class="product__description__name order-summary__emphasis">' + prod.name + '</span><span class="product__description__variant order-summary__small-text"></span></td><td class="product__quantity visually-hidden">'+prod.number +'</td>' +
            '<td class="product__price"><span class="order-summary__emphasis">'+ appData.money+prod.price + '</span></td></tr>';
        //添加赠品显示
        if(prod.giftgoods) {
            for (var n in prod.giftgoods) {
                var giftprod = prod.giftgoods[n];
                var gifttr= '<tr class="product" data-product-id="9659096193" data-variant-id="35367613121" data-product-type="Beauty">';
                if(prod.img){
                    gifttr+='<td class="product__image"><div class="product-thumbnail"><div class="product-thumbnail__wrapper">' +
                        '<img alt="' + prod.name + '" class="product-thumbnail__image" src="' + appData.imgpath + giftprod.img + '">' +
                        '</div><span class="product-thumbnail__quantity" aria-hidden="true">'+giftprod.number +'</span></div></td>';
                }
                gifttr+= '<td class="product__description">' +
                    '<span class="product__description__name order-summary__emphasis">' + giftprod.name + '</span><span class="product__description__variant order-summary__small-text"></span></td><td class="product__quantity visually-hidden">'+giftprod.number +'</td>' +
                    '<td class="product__price"><span class="order-summary__emphasis">'+giftStr+'</span></td></tr>';
                tr+=gifttr;
            }
        }
        order_goodslist.append(tr);
    }
    calc_price();
}

function swiper() {
    var galleryTop = new Swiper('.gallery-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 10,
        autoHeight: true
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true,

    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;
}

$('#data-order-summary').click(function () {
    if($(this).hasClass('bbhide')){

        $(this).removeClass(' order-summary-toggle--hide');
        $(this).removeClass(' bbhide');
        $(this).addClass(' order-summary-toggle--show');
        $(this).addClass(' aashow');
        $('.order-summary').removeClass('order-summary--is-expanded');
        $('.order-summary').addClass('order-summary--is-collapsed');
        return;
    }
    if($(this).hasClass('aashow')){

        $(this).removeClass(' order-summary-toggle--show');
        $(this).removeClass(' aashow');
        $(this).addClass(' order-summary-toggle--hide');
        $(this).addClass(' bbhide');
        $('.order-summary').removeClass('order-summary--is-collapsed');
        $('.order-summary').addClass('order-summary--is-expanded');
        return;
    }
});
function gotoCheckout(){
    window.location.href = "/buy/" + appData.sitedir;
}
function show_successwin(){
    $("#order_goodslist").attr("id","");
    $("#summary").hide();
    $("#address").hide();
    $("#success").show();
}
$("#mobile_menu").click(function(){
    $("body").toggleClass("show-nav");
});
//购物车一级规格缺货
init_oos();