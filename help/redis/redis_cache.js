module.exports = {
    set_cache: function (db, key, data) {
        return new Promise((resolve, reject) => {
            global.redisclient[db].set(key, data, (err, res) => {
                err ? reject(err) : resolve(res)
            });
        });
    },
    get_buffer_cache: function (db, key) {
        return new Promise((resolve, reject) => {
            global.redisclient[db].getBuffer(key,(err, res) => {
                err ? reject(err) : resolve(res)
            });
        });
    },
    get_cache:  function (db,key) {
        return new Promise((resolve, reject) => {
            global.redisclient[db].get(key,(err, res) => {
                err ? reject(err) : resolve(res)
            });
        });
    },
};