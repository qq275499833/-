module.exports = {
    start:function () {
        setInterval(function () {
            let d = new Date();
            let h=d.getHours();
            let m=d.getMinutes();
            if(h===0&&m===0){
                global.Today_views = 0;
                global.Today_users = 0;
                global.Today_query_orders = 0;
                global.Today_orders = 0;
                global.ClientIpInfo = {};
                global.ClientDomainInfo = {};
            }
        },60 * 1000);
    }
};