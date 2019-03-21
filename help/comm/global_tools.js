const models = require("../../models/index");
const redis_proc = require("../../help/redis/redis_proc");
global.loadAll = async function(){
    const pipeline = global.redisclient["config"].pipeline();
    const data = await pipeline.
    get("PTConfig").
    get("CDNConfig").
    get("ApikeyConfig").
    get("HLConfig").
    exec();
    let newData = data.map((e)=>(e[1]?JSON.parse(e[1]):[]));
    return {
        PTConfig: newData[0],
        CDNConfig: newData[1],
        ApikeyConfig: newData[2],
        HLConfig: newData[3],
    };
};
global.PTConfig = async function (isdb) {
    if(isdb){
        return await models.PTConfig.findOne();
    }
    let data = await redis_proc.get_config_cache("PTConfig");
    if(data){
        data = JSON.parse(data);
    }else{
        data = await models.PTConfig.findOne();
        await redis_proc.set_config_cache("PTConfig", data?JSON.stringify(data.dataValues):'');
    }
    return data;
};
global.CDNConfig = async function (isdb) {
    if(isdb){
        return await models.CDNConfig.findOne();
    }
    let data = await redis_proc.get_config_cache("CDNConfig");
    if(data){
        data = JSON.parse(data);
    }else{
        data = await models.CDNConfig.findOne();
        await redis_proc.set_config_cache("CDNConfig", data?JSON.stringify(data.dataValues):'');
    }
    return data;
};
global.ApikeyConfig = async function (isdb) {
    if(isdb){
        return await models.ApikeyConfig.findOne();
    }
    let data = await redis_proc.get_config_cache("ApikeyConfig");
    if(data){
        data = JSON.parse(data);
    }else{
        data = await models.ApikeyConfig.findOne();
        await redis_proc.set_config_cache("ApikeyConfig", data?JSON.stringify(data.dataValues):'');
    }
    return data;
};
global.HLConfig = async function (isdb) {
    if(isdb){
        return await models.HLConfig.findOne();
    }
    let data = await redis_proc.get_config_cache("HLConfig");
    if(data){
        data = JSON.parse(data);
    }else{
        data = await models.HLConfig.findOne();
        await redis_proc.set_config_cache("HLConfig", data?JSON.stringify(data.dataValues):'');
    }
    return data;
};
global.Lang=async function(){
    let langs = await models.Lang.findAll();
    for (let i in langs) {
        let lang = langs[i];
        global.Lang[lang.src] = lang;
    }
};