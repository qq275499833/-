/*客服*/
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
function scrollBotton(){
    window.location.hash = "#shopKind";
}
function show_successwin(){
     $(".contentBody").addClass("hide");
     $("#successOrder").removeClass("hide");
}
function openDetail(){
    $("#allConmentPage").addClass('hide');

    $(".contentBody").removeClass("hide");
}

/*function decNumTest(){
    decNum();
    add_cart(1);
}*/
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
                    li='<li class="" style="position:relative;border-bottom:1px dashed #D0D6D6;padding-top:5px;padding-bottom:5px;"><div style="width: 98%;margin-left: 2%;"><div class=""><div>'+
                       /* '<span class="userImg">'+comment.image+'</span>'+*/
                        '<span class="userName" style="color:#BEBEBE;font-size:18px;">'+comment.name+'</span><div class="contentDate" style="float:right;font-size:18px;color:#BEBEBE;">'+comment.updated_at+'</div>'+
                        '<div><p class="contentComment" >'+comment.body+'</p></div></div>';
                       /* '<div  style="position:absolute;left:15%;top:0px;">';*/
                            if(comment.imgs){
                                var imgStr = comment.imgs.split(";");
                                for(var j=0;j<imgStr.length;j++){
                                    li+='<img src="'+appData.imgpath+imgStr[j]+'" alt="" style="width:60px;height:60px;">'
                                }
                            }

                    li2='<li class="" style="position:relative;border-bottom:1px dashed #D0D6D6;padding-top:10px;padding-bottom:10px;"><div style="width: 98%;margin-left: 2%;"><div class=""><div>'+
                        ' <span class="userName" style="color:#BEBEBE;font-size:18px;">'+comment.name+'</span><div class="contentDate" style="float:right;font-size:18px;color:#BEBEBE;">'+comment.updated_at+'</div>'+
                        '<div><p class="contentComment" >'+comment.body+'</p></div></div>';
                        if(comment.imgs){
                        var imgStr = comment.imgs.split(";");
                        for(var j=0;j<imgStr.length;j++){
                            li2+='<img src="'+appData.imgpath+imgStr[j]+'" alt="" style="width:60px;height:60px;">'
                        }
                    }
                    $("#rcslider").append(li);
                    $("#commentContainer").append(li2);
                }
                alllength = data.maxPage;
                showdata = data.page;
                total = data.total;
                callback();
            }

        }
    })

}
var callback = function(){
    $("#total").text('('+total+')');
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
/*打开评论页面*/
function openComment(){
    $(".contentBody").addClass("hide");
    $("#allConmentPage").removeClass("hide");
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
