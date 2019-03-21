let express = require('express');
let router = express.Router();
let toolkit = require('../help/comm/toolkit');
router.post('/:shop',function (req, res) {
    (async () => {
        if(!req.body.type) return toolkit.sendError(res);
        let type=req.body.type;
        let city=req.body.city;
        let area=req.body.area;
        //获取城市
        let newList=[];
        let list=global.twStore[req.params.shop];
        if(!list||!list.length) return null;
        if(req.params.shop==="shop711"){
            if(type==="getCity"){
                newList.push({cityName:'城市',cityId:'0'});
                for(let info of list){
                    if (info) {
                        newList.push({cityName:info.city,cityId:info.cityid});
                    }
                }
            }else if(type==="getTown"){//获取区县
                newList.push({TownName:'區縣',TownID:'0'});
                for(let info of list){
                    if (info&&info.city===city) {
                        for(let town of info.towns){
                            newList.push({TownName:town.TownName,TownID:town.TownID});
                        }
                    }
                }
            }else if(type==="getStore"){//获取店铺
                for(let info of list){
                    if (info&&info.city===city) {
                        for(let town of info.towns){
                            if(town.TownName===area){
                                if(Array.isArray(town.store)){
                                    newList=town.store;
                                }else{
                                    newList.push(town.store);
                                }

                            }
                        }
                    }
                }
            }
        }else{
            if(type==="getCity"){
                newList.push({cityName:'城市'});
                for(let info of list){
                    if (info) {
                        newList.push({cityName:info.city});
                    }
                }
            }else if(type==="getTown"){//获取区县
                newList.push({TownName:'區縣'});
                for(let info of list){
                    if (info&&info.city===city) {
                        for(let town of info.towns){
                            newList.push({TownName:town.town});
                        }
                    }
                }
            }else if(type==="getStore"){//获取店铺
                for(let info of list){
                    if (info&&info.city===city) {
                        for(let town of info.towns){
                            if(town.town===area){
                                newList=town.store;
                            }
                        }
                    }
                }
            }
        }
        res.send(newList);
    })();
});
module.exports = router;