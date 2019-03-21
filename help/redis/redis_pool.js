let config = global.config;
const Redis = require("ioredis");
module.exports={
    init:function () {
        global.redisclient = {};
        global.redisclient['goods'] = this.getRedisClient("goods", "goods");
        global.redisclient['goods_content'] = this.getRedisClient("goods_content", "goods_content");
        global.redisclient['goods_id'] = this.getRedisClient("goods_id", "goods_id");
        global.redisclient['goods_content_id'] = this.getRedisClient("goods_content_id", "goods_content_id");
        global.redisclient['user_info'] = this.getRedisClient("user_info", "user_info");
        global.redisclient['home'] = this.getRedisClient("home", "home");
        global.redisclient['site'] = this.getRedisClient("site", "site");
        global.redisclient['sitehome'] = this.getRedisClient("sitehome", "sitehome");
        global.redisclient['sitecategory'] = this.getRedisClient("sitecategory", "sitecategory");
        global.redisclient['sitedetail'] = this.getRedisClient("sitedetail", "sitedetail");
        global.redisclient['sitepage'] = this.getRedisClient("sitepage", "sitepage");
        global.redisclient['userinfo'] = this.getRedisClient("userinfo", "userinfo");
        global.redisclient['config'] = this.getRedisClient("config", "config");
        global.redisclient['goodstheme'] = this.getRedisClient("goodstheme", "goodstheme");
        global.redisclient['ipcloak'] = this.getRedisClient("ipcloak", "ipcloak");
    },
    getRedisClient: function (name, prefix){
        return new Redis({
            host: config.redis[config.appid].host,
            port: config.redis[config.appid].port,
            max_clients: 30,
            family: 4,// 4 (IPv4) or 6 (IPv6)
            password: config.redis[config.appid].password,
            db: config.redis[config.appid].db,
            perform_checks: false,
            keyPrefix: prefix+"_"+config.appid+":",
            connectionName: config.appid+"_"+name,
            options:{prefix:prefix +'_'+config.appid+':',no_ready_check:true,password:config.redis[config.appid].password}
        });
    }
};