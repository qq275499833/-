
$(function(){
    //点击相关按钮弹出参数选项
    $(".buy_now").click(function () {
        $(".black_overlay").addClass("show");
        $(".goodsInfo").addClass("show");
    });
    $(".seleattr i").click(function () {
        $(".black_overlay").addClass("show");
        $(".goodsInfo").addClass("show");
    });
    $(".close_goodsInfo_icon").click(function () {
        $(".goodsInfo").removeClass("show");
        $(".black_overlay").removeClass("show");
    });

    // 立即购买的位置
    function checkEleTop(){
        var top = (window.innerHeight ? window.innerHeight : $(window).height()) + $(window).scrollTop();
        if(top >= 1000){
            $(".topBuy").hide();
            $('.btnbox2').show();
        }else{
            $(".topBuy").show();
            $('.btnbox2').hide();
        }
    }
    window.onscroll = function () {
        checkEleTop();
    };

    // 点击检查状态进行弹出
    $(".checkState").click(function () {
        $(".black_overlay").addClass("show");
        $(".state_show").addClass("show");
    });
    //关闭检查状态弹窗
    $(".close_state_info").click(function () {
        $(".state_show").removeClass("show");
        $(".black_overlay").removeClass("show");
        $("#expressinfo").val("");
        $("#find_result").html("");
    });

    // 确认订单之后
    /*$(".goAddress").click(function(){
        submit_order_nocart();
    });*/

    //关闭订单成功提示
    $(".close_orderInfo_icon").click(function () {
        $(".successAndRecommend").removeClass("show");
        $(".black_overlay").removeClass("show");
        location.reload();
    });


});

function show_successwin(){
    $(".black_overlay").addClass("show");
    $(".goodsInfo").removeClass("show");
    $(".successAndRecommend").addClass("show");
}
function hide_successwin(){
    $(".black_overlay").removeClass("show");
    $(".goodsInfo").removeClass("show");
    $(".successAndRecommend").removeClass("show");
}
//单页一级规格缺货
init_nocart_oos();


