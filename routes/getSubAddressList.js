let express = require('express');
let router = express.Router();
router.get('/',function (req, res) {
    (async () => {
        let countryCode = req.query.countryCode;
        let addressId = req.query.addressId;
        if(!countryCode){
            return res.send({error:true});
        }
        let newlist = [];
        if(!addressId){
            let list = global.AreaInfo[countryCode];
            if(list&&list.length>0){
                if(countryCode ==='฿'){
                    newlist.push({name:'จังหวัด/ Province',id:'1',displayName:'',parentId:'1'});
                    for(let info of list) {
                        if (info && info.parentId === 'R2067731') {
                            newlist.push(info);
                        }
                    }
                }
                if(countryCode ==='RM'){
                    newlist.push({name:'Province',id:'1',displayName:'',parentId:'1'});
                    for(let info of list) {
                        if(info&&info.parentId === 'R2108121'){
                            newlist.push(info);
                        }
                    }
                }
                if(countryCode ==='NT'){
                    newlist.push({name:'城市',id:'1',displayName:'',parentId:'1'});
                    for(let info of list) {
                        if(info&&info.parentId === '10'){
                            newlist.push(info);
                        }}
                }
                if(countryCode ==='HK'){
                    newlist.push({name:'区域',id:'1',displayName:'',parentId:'1'});
                    for(let info of list) {
                        if(info&&info.parentId === '111'){
                            newlist.push(info);
                        }}
                }
                if(countryCode ==='Rp'){
                    newlist.push({name:'Province',id:'1',displayName:'',parentId:'1'});
                    for(let info of list) {
                        if(info&&info.parentId === 'R304751'){
                            newlist.push(info);
                        }}
                }
                if(countryCode ==='₫'){
                    newlist.push({name:'Province',id:'1',displayName:'',parentId:'1'});
                    for(let info of list) {
                        if(info&&info.parentId === 'R49915'){
                            newlist.push(info);
                        }}
                }
                if(countryCode ==='円'){
                    for(let info of list) {
                        if(info){
                            newlist.push(info);
                        }}
                }
            }
        }else{
            let list = global.AreaInfo[countryCode];
            if(list&&list.length>0){
                if(countryCode ==='฿'){
                    newlist.push({name:'เมือง',id:'2',displayName:'',parentId:'2'});
                }else if(countryCode ==='RM'){
                    newlist.push({name:'City',id:'2',displayName:'',parentId:'2'});
                }else if(countryCode ==='NT'){
                    newlist.push({name:'區縣',id:'2',displayName:'',parentId:'2'});
                }else if(countryCode ==='HK'){
                    newlist.push({name:'區',id:'2',displayName:'',parentId:'2'});
                }else if(countryCode ==='Rp'){
                    newlist.push({name:'City',id:'2',displayName:'',parentId:'2'});
                }else if(countryCode ==='₫'){
                    newlist.push({name:'City',id:'2',displayName:'',parentId:'2'});
                }
                for(let info of list){
                    if(info&&info.parentId === addressId){
                        newlist.push(info);
                    }
                }
            }
        }
        res.send(newlist);
    })();
});
module.exports = router;