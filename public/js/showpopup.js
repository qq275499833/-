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