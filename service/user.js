const models = require("../models/index");
const redisProc = require("../help/redis/redis_proc");
module.exports = {
    getUser: async function (username) {
        //获取缓存
        let data = await redisProc.get_userinfo_cache(username);
        if (data&&data.username) {
            //命中缓存
            return data;
        } else {
            //更新缓存
            let data = await this.getUserFromDB(username);
            if (data&&data.username) {
                redisProc.set_userinfo_cache(username, data);
            }
            return data;
        }
    },
    getUserFromDB: async function(username) {
        //获取从数据库
        let user = await models.User.findOne({
            where: {
                username: username,
            },
            attributes:{exclude:["id","password","created_at","updated_at"]}
        });
        if (!user) return null;
        return user;

    }
};