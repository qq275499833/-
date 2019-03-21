const zlib = require('zlib');
module.exports = {
    unzip: async function (text) {
        return new Promise((resolve, reject) => {
            zlib.unzip(new Buffer(text),(err,res)=>{err ? reject(err) : resolve(res)});
        })

    },
    deflate:async function (text) {
        return new Promise((resolve, reject) => {
            zlib.deflate(text,(err,res)=>{err ? reject(err) : resolve(res)});
        })
    }
};