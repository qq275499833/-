const request = require('request');
const util = require('util');
const get = util.promisify(request.get);
module.exports = {
    getReal:async function (ip) {
        let ApikeyConfig=await global.ApikeyConfig();
        return get("https://way.jd.com/RTBAsia/nht?appkey=" + ApikeyConfig.jdwxapikey + "&ip=" + ip);
    },
    getType:async function (ip) {
        let ApikeyConfig=await global.ApikeyConfig();
        return get("https://way.jd.com/RTBAsia/iptype?appkey=" + ApikeyConfig.jdwxapikey + "&ip=" + ip);
    },
    getLocalInfoByTB: function (ip) {
        return get("http://ip.taobao.com/service/getIpInfo.php?ip=" + ip);
    },
    getLocalInfoByJD:async function (ip) {
        let ApikeyConfig=await global.ApikeyConfig();
        return get("https://way.jd.com/ip138/ip?appkey=" + ApikeyConfig.jdwxapikey + "&ip=" + ip);
    }
};