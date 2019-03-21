const XTemplate = require('xtemplate');
XTemplate.addCommand('lang', function (scopes, option) {
    let str = option.params[0];
    let language = option.params[1];
    try {
        let newstr = global.Lang[str][language];
        return newstr?newstr:str;
    }catch (err){}
    return str;
});
XTemplate.addCommand('JSONparse',function (scopes, option) {
    return JSON.parse(option.params[0]);
});
XTemplate.addCommand('getOrderState',function (scopes, option) {
    if(option.params[0]==="new")
        return "未确认";
    if(option.params[0]==="waitsend")
        return "待发货";
    if(option.params[0]==="picking")
        return "配货中";
    if(option.params[0]==="sending")
        return "送货中";
    if(option.params[0]==="end")
        return "已完成";
    if(option.params[0]==="return")
        return "已退货";
});