//评论功能
var alllength,showdata;
function comments(id,page){
    $.get(appData.apiserver+"/querycomments/" + id+'?page='+page).success(function (data) {
        if(data.Error){
            //tools.show_msg(data.Info[appData.language]);
            $("#commentContainer1").hide();
        }else{
            $("#commentContainer").empty();
            if(data.comments.length){
                var li;
                for(var i in data.comments){
                    var comment=data.comments[i];
                    comment.updated_at=formatDate(new Date());
                    li='<li style="overflow:hidden;"><div style="width: 98%;margin-left: 2%;"><div style="width:70%;float:left;"><div>'+
                        ' <span class="comment_spec">'+comment.name+'</span></div>'+
                        '<div><p class="content">'+comment.body+'</p></div><div class="comment_imgs">';
                    if(comment.imgs){
                        var imgs=comment.imgs.split(";");
                        for(var k=0;k<imgs.length;k++){
                            li+='<img src="'+appData.imgpath+imgs[k]+'" alt="">'
                        }
                    }

                    li+='</div><div class="comment_spec">'+comment.updated_at+'</div></div><div style="float: right;width:30%;">';
                    for(var j=0;j<comment.star;j++){
                        li+='<span class="comment_star"></span>'
                    }
                    li+='</div></div></li>';
                    $("#commentContainer").append(li);
                }
                alllength = data.maxPage;
                showdata = data.page;
                callback();
            }

        }
    })

};
var callback = function(){
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

$("div.check").click(function(){
    $(this).find("input.radio").attr("checked","checked");
    $(this).siblings("div").find("input.radio").removeAttr("checked");
});
var dis=parseInt($("#discount").html())+'%';
$("#discount").html(dis);
//单页一级规格缺货
init_nocart_oos();