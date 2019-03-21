let zip = require('../zip');
let redisCache = require('./redis_cache');
module.exports = {
    set_sitepage_cache:async (key, data)=>{
        return await redisCache.set_cache('sitepage', key, data);
    },
    get_sitepage_cache:async(key)=>{
        return  await redisCache.get_cache('sitepage', key);
    },
    set_home_cache:async (key, data)=>{
        return await redisCache.set_cache('home', key, data);
    },
    get_home_cache:async (key)=>{
        return await redisCache.get_cache('home', key);
    },
    get_goods_cache: async function (key) {
        return await redisCache.get_cache('goods', key);
    },
    get_goods_content_cache: async function (key) {
        return await redisCache.get_cache('goods_content', key);
    },
    set_goods_id_cache:async (key, data)=>{
        if(data) {
            data = JSON.stringify(data);
            data = await zip.deflate(data);
        }
        return await redisCache.set_cache('goods_id', key, data);
    },
    get_goods_id_cache: async (key)=>{
        let data = await redisCache.get_buffer_cache('goods_id', key);
        if(data&&data.length>0) {
            data = await zip.unzip(data);
            data = JSON.parse(data);
        }
        return data
    },
    set_goods_content_id_cache:async (key, data)=>{
        if(data) {
            data = JSON.stringify(data);
            data = await zip.deflate(data);
        }
        return await redisCache.set_cache('goods_content_id', key, data);
    },
    get_goods_content_id_cache: async (key)=>{
        let data = await redisCache.get_buffer_cache('goods_content_id', key);
        if(data&&data.length>0) {
            data = await zip.unzip(data);
            data = JSON.parse(data);
        }
        return data
    },
    set_userinfo_cache:async (key, data)=>{
        if(data) {
            data = JSON.stringify(data);
        }
        return await redisCache.set_cache('userinfo', key, data);
    },
    get_userinfo_cache: async (key)=>{
        let data=await redisCache.get_cache('userinfo', key);
        if(data&&data.length>0) {
            data = JSON.parse(data);
        }
        return data
    },
    set_config_cache:async (key, data)=>{
        return await redisCache.set_cache('config', key, data);
    },
    get_config_cache: async (key)=>{
        return await redisCache.get_cache('config', key);
    },
    set_goodstheme_cache:async (key, data)=>{
        return await redisCache.set_cache('goodstheme', key, data);
    },
    get_goodstheme_cache: async (key)=>{
        return await redisCache.get_cache('goodstheme', key);
    },
    set_ipcloak_cache:async (key, data)=>{
        return await redisCache.set_cache('ipcloak', key, data);
    },
    get_ipcloak_cache: async (key)=>{
        return await redisCache.get_cache('ipcloak', key);
    }
};
