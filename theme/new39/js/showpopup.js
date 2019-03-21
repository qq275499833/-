
//    點擊立即搶購顯示另一個頁面
function main_footer() {
    $('.page').css('display','none');
    $('.rush').css('display','block')
}
window.onload=function () {
    //退换货部分显示隐藏效果
    $('.bk').click(function () {
        $('.page').css('display','block');
        $('.rush').css('display','none')
    });
};

//弹层
function show_specwin(){
    tools.show_win("#specWin","450px");
    hide_cartwin();
    hide_successwin();
}
function hide_specwin(){
    tools.close_win("#specWin");
}
function show_cartwin(){
    refresh_prod_ul();
    tools.show_win("#cartWin",'100%');
    hide_specwin();
    hide_successwin();
}
function hide_cartwin(){
    tools.close_win("#cartWin");
}

function show_successwin(){
    tools.show_win("#successWin",'100%');
    hide_specwin();
    hide_cartwin();
    $('.success_modal').css('display','block');

}
function hide_successwin(){
    tools.close_win("#successWin");
}
function show_cartisempty(){
    hide_cartwin();
    hide_specwin();
    $("#empty").show();
    $("#price").hide();
}
