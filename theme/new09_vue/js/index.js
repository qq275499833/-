function show_successwin(){
    layer.open({
        type: 1,
        title: false,
        closeBtn: 2,
        shadeClose: true,
        skin: 'yourclass',
        content: $("#success").html()
    });
}
//购买信息滚动
$.get(appData.apiserver+"/getpurchaseinfo/" +appData.language).success(function(data){
    setTimeout(function() {
        $('#marqueeContainer').empty();
        var li="";
        for(var i in data){
            li+='<li><div style="background-image: url('+ data[i].img + ')">'+data[i].info+'</div></li>'
        }
        $("#marqueeContainer").append(li);
        setInterval(function(){doscroll()}, 2000);
    }, 0);
});
var doscroll = function(){
    var parent = $('#marqueeContainer');
    var first = parent.find('li:first');
    var height = parseInt(first.height())+30;
    first.animate({
        marginTop: -height + 'px'
        }, 1000, function() {
        first.css('marginTop', 0).appendTo(parent);
    });
};
//单页一级规格缺货
init_nocart_oos();
