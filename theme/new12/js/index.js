$(function(){
   $("#search").click(function(){
       $("#findOrder").show();
       $("#shadow").show();
   });
    $("#close_btn").click(function(){
        $("#findOrder").hide();
        $("#shadow").hide();
    });

});
function show_successwin(){
    layer.open({
        type: 1,
        title: false,
        skin: 'yourclass', //样式类名
        closeBtn: 0, //不显示关闭按钮
        anim: 2,
        shadeClose: true, //开启遮罩关闭
        content: $("#success").html()
    });
}
//单页一级规格缺货
init_nocart_oos();