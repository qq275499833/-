const fs = require('fs');
module.exports = {
    init: async function () {
        let b = fs.readFileSync('./public/json/฿.json', 'utf8');
        if (b) global.AreaInfo['฿'] = JSON.parse(b);
        let RM = fs.readFileSync('./public/json/RM.json', 'utf8');
        if (RM) global.AreaInfo['RM'] = JSON.parse(RM);
        let NT = fs.readFileSync('./public/json/NT.json', 'utf8');
        if (NT) global.AreaInfo['NT'] = JSON.parse(NT);
        let HK = fs.readFileSync('./public/json/HK.json', 'utf8');
        if (HK) global.AreaInfo['HK'] = JSON.parse(HK);
        let Rp = fs.readFileSync('./public/json/Rp.json', 'utf8');
        if (Rp) global.AreaInfo['Rp'] = JSON.parse(Rp);
        let d = fs.readFileSync('./public/json/₫.json', 'utf8');
        if (d) global.AreaInfo['₫'] = JSON.parse(d);
        let jpn = fs.readFileSync('./public/json/円.json', 'utf8');
        if (jpn) global.AreaInfo['円'] = JSON.parse(jpn);
        let family = fs.readFileSync('./public/json/family.json', 'utf8');
        if (family) global.twStore['family'] = JSON.parse(family);
        let shop711 = fs.readFileSync('./public/json/711.json', 'utf8');
        if (shop711) global.twStore['shop711'] = JSON.parse(shop711);
    }
};