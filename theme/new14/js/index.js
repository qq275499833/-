
function order_list(){
    var order_goodslist = $('#order_goodslist');
    order_goodslist.empty();
    for (var i in appData.prods) {
        var prod = appData.prods[i];
        prod.option1 = prod.option1 ? prod.option1 : '';
        prod.option2 = prod.option2 ? prod.option2 : '';
        order_goodslist.append(
            '<div class="row"><div class="col-md-2" style="margin-top: 20px;"><img class="prod_img" src="' + appData.imgpath + prod.img + '" style="width: 100px; height: 100px;"></div>'+
            '<div class="col-md-4 col-sm-12 mobile-screen-md" style="margin-top: 20px;"><span class="mobile-screen-lg" style="font-size: 16px; color: #666666;margin-left: 14px;"  title="' + prod.name +'">' + prod.name + '</span>'+
            '<br><span style="margin-top: 10px; margin-left: 14px;" >'+prod.option1+'</span><br><span style="margin-top: 10px; margin-left: 14px;" >'+prod.option2+'</span></div>'+
            '<div class="col-md-3 col-sm-12 mobile-screen-orderNum mobile-screen-ordinary-text" style="margin-top: 20px; font-size: 16px; color: #666666;" id="number">'+ appData.money+prod.price + '*1</div>'+
            '<div class="col-md-3 col-sm-12" style="margin-top: 20px;"><span class="mobile-screen-ordinary-text" style="font-size: 16px; color: #666666;">'+priceStr+'</span>'+
            '<span style="font-size: 18px; color: #e23939;">'+ appData.money+prod.price+'</span></div></div><hr style="FILTER: alpha(opacity=100,finishopacity=0,style=2)" width="100%" color="#987cb9" size="10">'
        );
    }

}
function show_successwin(){
    // order_list();
    $("#detail").hide();
    $("#success").show();
}
var countdown =appData.countdown;
if(countdown){
    $("#note").show();
    var int=setInterval(GetRTime, 1000);
}
function GetRTime() {
    var EndTime = new Date(Date.parse(countdown.replace(/-/g,"/")));
    EndTime.setDate(EndTime.getDate());
    var NowTime = new Date();
    var t = EndTime.getTime() - NowTime.getTime();
    if(t<=0){
        $("#note").hide();
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

//评论功能
function comments(id){
    $.get(appData.apiserver+"/querycomments/" + id).success(function (data) {
        if(data.Error){
            //tools.show_msg(data.Info[appData.language]);
            $("#commentContainer1").hide();
        }else{
            $("#commentContainer").empty();
            if(data.comments.length){
                var li;
                for(var i in data.comments){
                    var comment=data.comments[i];
                    comment.updated_at=comment.updated_at.split("T")[0];
                    li='<li class="proComment"><div style="width: 98%;margin-left: 2%;"><div class="col-sm-8 col-xs-8"><div>'+
                        ' <span class="userName">'+comment.name+'</span></div>'+
                        '<div><p class="content">'+comment.body+'</p></div><div class="contentDate">'+comment.updated_at+'</div></div>'+
                        '<div class="col-sm-3 col-xs-3" style="float: right;  margin-right: 30px;">';
                    for(var j=0;j<comment.star;j++){
                        li+='<img class="start"  src="/images/star.png">'
                    }
                    li+='</div><hr style="FILTER: alpha(opacity=100,finishopacity=0,style=2)" width="100%" color="#987cb9" SIZE="10"></div></li>';
                    $("#commentContainer").append(li);
                }


            }
            setTimeout(function(){
                var table = document.getElementById("commentContainer");
                var timer = null;
                table.scrollTop = 0;
                table.innerHTML += table.innerHTML;
                function play() {
                    clearInterval(timer);
                    timer = setInterval(function() {
                        table.scrollTop++;
                        if (table.scrollTop >= table.scrollHeight / 2) {
                            table.scrollTop = 0;
                        }
                    }, 100);
                }
                setTimeout(play, 1000);
                table.onmouseover = function() {
                    clearInterval(timer)
                };
                table.onmouseout = play;
            },0)

        }
    })

}
//单页一级规格缺货
init_nocart_oos();