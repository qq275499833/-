const redisProc = require('../help/redis/redis_proc');
const models = require('../models/index');
module.exports = {
    getTheme:async function(theme){
        if(!theme)return null;
        let theme_data = await redisProc.get_goodstheme_cache(theme);
        if(!theme_data){
            let themeinfo = await models.GoodsTheme.findOne({
                where: {filename: theme}
            });
            if (!themeinfo) return null;
            await redisProc.set_goodstheme_cache(theme, JSON.stringify(themeinfo));
            theme_data = themeinfo;
        }else{
            theme_data=JSON.parse(theme_data);
        }
        return theme_data;
    }
};