function show_successwin(){
    layer.open({
        type: 1,
        title: false,
        closeBtn: 2,
        shadeClose: true,
        skin: 'yourclass',
        content: $("#successWin").html()
    });
}

//单页一级规格缺货
init_nocart_oos();