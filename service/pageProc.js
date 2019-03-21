const redisProc = require('../help/redis/redis_proc');
const models = require('../models/index');
module.exports = {
    getPageInfo: async function (id,username,type,language) {
        if(id!==""&&id!=='0'){
            let page_data = await redisProc.get_sitepage_cache('page_'+id);
            if(!page_data){
                let pageinfo = await models.Page.findOne({
                    where: {id: id}
                });
                if (!pageinfo) return null;
                await redisProc.set_sitepage_cache('page_'+id, JSON.stringify(pageinfo));
                page_data = pageinfo;
            }else{
                page_data = JSON.parse(page_data);
            }
            return page_data;
        }else{
            let pageinfo = await models.Page.findOne({
                where: {
                    username: username,
                    classtype: type,
                    language: language,
                    isdefault:'是'
                }
            });
            if(!pageinfo) return null;
            let page_data = await redisProc.get_sitepage_cache('page_'+pageinfo.id);
            if(!page_data){
                await redisProc.get_sitepage_cache('page_'+pageinfo.id, JSON.stringify(pageinfo));
                page_data = pageinfo;
            }else{
                page_data = JSON.parse(page_data);
            }
            return page_data;
        }


    }
};