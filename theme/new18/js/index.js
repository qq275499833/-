//弹出规格选择
/*function showChooseKind(){
    $("#page-choose").addClass("show");
}*/
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
$(".kf_list1").hide();
var show_kflist_timer1;
var kf_isshow1= false;
function show_kflist1() {
    if(kf_isshow1) {
        $(".kf_list1").hide();
        kf_isshow1 = false;
        clearTimeout(show_kflist_timer1);
    }
    else{
        $('.kf_list1').show();
        kf_isshow1 = true;
        show_kflist_timer1 = setTimeout(function () {
            $('.kf_list1').hide();
        }, 10000);
    }
}
if(appData.goods.manyoff.length>0){
    var pop=$("#pop").empty();
    for(var i in appData.goods.manyoff){
        var item=appData.goods.manyoff[i];
        pop.append('<span class="pop_border" onclick="sel_count('+item.salecount+',this)">'+item.name+'</span>');
    }
}
function sel_count(k,ele){
    $(ele).addClass("active").siblings().removeClass("active");
    var len=appData.prods.length;
    var length=k-len;
    if(length>=0){
        for(var i=0;i<parseInt(length);i++){
            /*add_goodsinfo();
            add_spec(true);*/
            add_one();
        }
    }else{
        var j=Math.abs(length);
        var a=$("div.product_item");
        a.splice(a.length-j,j);
        $("#product-spec").html(a);
        appData.prods.splice( appData.prods.length-j,j);
        calc_price_nocart();
    }

}
function showChooseKind(){
    $(".contentMain").addClass("hide");
    $("#page-choose").removeClass("hide");
    $(".pop_border:first").click();
}
function openAllConment(){
    $(".contentMain").addClass("hide");
    $("#allConmentPage").removeClass("hide");
    $("#allConmentPageTop").removeClass("hide");
    /*$("#myselfConment").removeClass("hide");*/
    /*$('#commentContainer2').text($('#commentContainer1').text());*/
}
function openDetail(){
    $(".contentMain").removeClass("hide");
    $("#allConmentPage").addClass("hide");
    $("#myselfConment").addClass("hide");
}
function serviceCustomer(){
    $("#customerService").removeClass("hide");
    $("#customerService").addClass("show");
}
function hideChooseKind(){
    $(".contentMain").removeClass("hide");
    $("#page-choose").removeClass("show");
    $("#page-choose").addClass("hide");
    $("#guding").removeClass("hide");
    console.log(appData.prods);
}
function hideChooseSearch(){
    $(".contentMain").removeClass("hide");
    $("#searchOrderOne").removeClass("show");
    $("#searchOrderOne").addClass("hide");
    $("#guding").removeClass("hide");
}
function hideChooseCon(){
    $("#page-choose").removeClass("hide");
    $("#buyPage").removeClass("show");
    $("#buyPage").addClass("hide");
}
function chooseName(){
    $("#section1").removeClass("hide");
    $("#section2").addClass("hide");
}
function chooseNameT(){
    $("#section1").addClass("hide");
    $("#section2").removeClass("hide");
}
function go_buy(){
    if(appData.prods.length===0) return;
    var cartinfo = [];
    for(var i in appData.prods){
        if(i < $(".product_item").length){
            var prod = appData.prods[i];
            if(!prod.id||!prod.sku||prod.price===0){
                tools.show_msg(selectStr+(parseInt(i)+1));
                return;
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
    $("#page-choose").removeClass("show");
    $('#realprice2').text($('#realprice1').text());
    $('#discount1').text($('#discount').text());
    $("#page-choose").addClass("hide");
    $("#buyPage").removeClass("hide");
    $("#guding").addClass("hide");

}
function confirmOrder(){
    $("#orderSuccess").removeClass("hide");
    $("#buyPage").addClass("hide");
}
function searchOrder(){
    $("#searchOrderOne").removeClass("hide");
    $(".contentMain").addClass("hide");
}
function searchOrdered(){
    //$("#searchSuccOrder").removeClass("hide");
    $("#orderSuccess").addClass("hide");
    $("#searchOrderOne").removeClass("hide");
}
function show_successwin(){
    $("#orderSuccess").removeClass("hide");
    $("#buyPage").addClass("hide");
    $('#order_clientname1').text($('#order_clientname').text());
    $('#orderid1').text($('#orderid').text());
    $('#order_clientaddress1').text( $('#order_clientaddress').text());
    $('#orderprice1').text($('#orderprice').text());
    $('#realprice1').text($('#realprice').text());

    $('#allprice1').text($('#allprice').text());

}
function closeSearchPage(){
    $("#searchOrderOne").addClass("hide");
    $(".contentMain").removeClass("hide");
}

//评论功能
var alllength,showdata,total;
function comments(id,page){
    $.get(appData.apiserver+"/querycomments/" + id+'?page='+page).success(function (data) {
        if(data.Error){
            //tools.show_msg(data.Info[appData.language]);
            $("#commentContainer1").hide();
        }else{
            $("#rcslider").empty();
            if(data.comments.length){
                var li;
                var li2;
                var listar;
                $("#commentContainer").text('');
                for(var i in data.comments){
                    var comment=data.comments[i];
                   /* comment.updated_at=comment.updated_at.split("T")[0];*/
                    comment.updated_at = formatDate(new Date());
                    li='<li class="" style="position:relative;"><div style="width: 98%;margin-left: 2%;"><div class=""><div>'+
                        ' <span class="userName">'+comment.name+'</span><span rel="5" class="startStyle" id="addStar"></span>'+
                        '<div><p class="contentComment">'+comment.body+'</p></div><div style="overflow:hidden;">';
                    if(comment.imgs){
                        var imgStr = comment.imgs.split(";");
                        for(var k=0;k<imgStr.length;k++){
                            li+='<div style="margin-left:2%;float:left;"><img src="'+appData.imgpath+imgStr[k]+'" alt="" style="width:60px;height:60px;margin-right:5px;display:inline-block;"></div>'
                        }
                    }
                        li+='</div><div class="contentDate">'+comment.updated_at+'</div></div>'+
                        '<div  style="position:absolute;left:15%;top:0px;">';
                    for(var j=0;j<comment.star;j++){
                        li+='<span class="red" style="width:20px;height:25px;"></span>'
                    };
                    li2='<li class="conmentLi" style="position:relative;"><div style="width: 98%;margin-left: 2%;"><div class=""><span class="conmentSpan">'+comment.name+'</span></div></div>'+
                        '<div class="commentText">'+comment.body+'</div><div style="overflow:hidden;">';
                        if(comment.imgs){
                        var imgStr = comment.imgs.split(";");
                        for(var k=0;k<imgStr.length;k++){
                            li2+='<div style="margin-left:2%;float:left;"><img src="'+appData.imgpath+imgStr[k]+'" alt="" style="width:60px;height:60px;margin-right:5px;display:inline-block;"></div>'
                        }
                    }
                     li2+='</div><div style="padding-left:11px;">'+comment.updated_at+'</div>'+
                        '<div  style="position:absolute;right:0px;top:0px;">';
                    for(var j=0;j<comment.star;j++){
                        li2+='<span class="red1" style="width:20px;height:25px;"></span>'
                    };
                    $("#rcslider").append(li);
                    $("#commentContainer").append(li2);
                }
                alllength = data.maxPage;
                showdata = data.page;
                total = data.total;
                /* var showdata1 = data.page;*/
                callback();
            }

        }
    })

};
var callback = function(){
    $('#total').text(total);
    $('#p1').pagination({
        totalData:alllength,
        showData:1,//Number(showdata),
        current:Number(showdata),
        keepShowPN:false,
        jump: false,
        coping: false,
        callback: function (api) {
            console.log(api.getCurrent());
            var text = api.getCurrent();
            comments(appData.goods.id,text);
        }
    });
};
function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}

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
            a.Error || ($("#comment_phone").val(""),$("#comment_name").val(""),
                $("#comment_body").val("")),
                $(".comment_btn").html(t),
                $(".comment_btn").attr("disabled", !1)
        })
}
