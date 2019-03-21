const toolkit = require("../comm/toolkit");
const redisProc = require('../redis/redis_proc');
const models = require('../../models/index');
module.exports = {
    check: async function (money, domain, realip) {
        try {
            const country = this.getCountryByMoney(money);
            let clock =await redisProc.get_config_cache('exportconfig');
            if (!clock) {
                let config = await models.ExportConfig.findOne();
                if(!config) return null;
                await redisProc.set_config_cache('exportconfig', JSON.stringify(config));
                clock = config;
            } else {
                const key = realip+"_"+country+"_"+domain;
                let ret = await redisProc.get_ipcloak_cache(key);
                if(ret){
                    return JSON.parse(ret).result;
                }
                clock = JSON.parse(clock);
            }
            let account=clock.clock_account;
            let password=clock.clock_password;
            let url=clock.clock_url;
            if(!account||!password||!url) return true;
            const auth = "Basic " + new Buffer(account+':'+password).toString('base64');
            let postData={
                'ip': realip,
                'country': country,
                'domain':domain
            };
            let header={
                "Content-Type":"application/x-www-form-urlencoded",
                "Authorization": auth,
                "Host": "www.ipcloakapi.com",
            };
            let data = await toolkit.post_adv(url, postData, header);
            if(!data.body) return true;
            data = JSON.parse(data.body);
            await redisProc.set_ipcloak_cache(realip+"_"+country+"_"+domain, JSON.stringify(data));
            return data.result;

        } catch (e) {
            return true;//出错强制跳转
        }
    },
    getCountryByMoney: function(money){
        switch(money){
            case "NT":
                return 'TW';
            case "HK":
                return 'HK';
            case "RM":
                return 'MY';
            case "Rp":
                return 'ID';
            case "฿":
                return 'TH';
            case "S$":
                return 'SG';
            case "RMB":
                return 'CN';
            case "円":
                return "JP";
        }
    }
};