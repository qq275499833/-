const WebSocket = require('ws');
const ReconnectingWebSocket = require('reconnecting-websocket');
const redis_proc = require('../redis/redis_proc');
let ErpWebSocket = {};
/**
 * 创建WS服务
 *
 * @param {Object} server Node.js http实例
 */
ErpWebSocket.createServer = function(server){
    try {
        const wss = new WebSocket.Server({server});
        wss.on('connection', async function connection(ws, req) {
            if (req.url === '/') return ws.close();
            let session = await redis_proc.get_session_cache(req.url.replace("/",""));
            if(session){
                session= JSON.parse(session);
                global.WSCache[session.user.id] = ws;
            }
            ws.on('message', function incoming(msg) {
                try{
                    const message = JSON.parse(msg);
                    if(message.type === 0){
                        ws.send(JSON.stringify({type:0, msg: "I'm ok!"}));
                    }
                }catch (e) {

                }

            });
            ws.on('close', function incoming(msg) {
                //console.log("浏览器关闭链接：", msg);
            });
        });
    } catch (err) {
        console.error(err);
    }
};
/**
 * 发送数据给用户
 *
 * @param {any} data 要发送的数据
 * @param {int} userid 要发给的用户（为空群发）
 */
ErpWebSocket.sendToUser=function(data, userid){
    try {
        if(!data) return;
        if (userid) {
            if(global.WSCache[userid]){
                if(global.WSCache[userid].readyState === 1)
                    global.WSCache[userid].send(JSON.stringify(data));
            }
        }
        else  {
            for (let key in global.WSCache) {
                if (global.WSCache[key].readyState === 1)
                    global.WSCache[key].send(JSON.stringify(data));
            }
        }
    }catch (e) {
        console.error(e);
    }
};

/**
 * 链接导单服务器
 *
 */
ErpWebSocket.connExportServer = function () {
    (async()=>{
        try {
            const _this = this;
            if(global.exportServer&&global.exportServer.readyState ===1) return;
            const ExportConfig = await global.ExportConfig();
            let export_server = '';
            if(!ExportConfig){
                export_server = '127.0.0.1:8085';
            }else{
                export_server = ExportConfig.host?ExportConfig.host:'127.0.0.1:8085'
            }
            console.log("准备重连 导单服务器");
            global.exportServer = new ReconnectingWebSocket("ws://" + export_server + "/" + global.config.appid,[],{
                maxReconnectionDelay: 5000,
                WebSocket: WebSocket
            });
            global.exportServer.addEventListener('open', function() {
                console.log('导单服务器 链接成功');
            });
            global.exportServer.addEventListener('close', function() {
                console.log('导单服务器 链接已断开');
            });
            global.exportServer.addEventListener('message', function (msg) {
                try {
                    let message = JSON.parse(msg.data);
                    if(!message.userId) return;
                    if(message.filename){
                        message.filename = "http://"+export_server+"/"+message.filename;
                    }
                    _this.sendToUser(message, message.userId);
                } catch (err) {
                    console.error(err);
                }
            });
        }catch (e) {
            console.error(e);
        }
    })();
};

/**
 * 发送导单请求
 *
* @param {any} data 要发送的数据
 */
ErpWebSocket.sendToExportServer = function (data) {
    try {
        if (data&&global.exportServer.readyState === 1) {
            global.exportServer.send(JSON.stringify(data));
        }
    } catch (e) {
        console.error(e);
    }
},
module.exports = ErpWebSocket;