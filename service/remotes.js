const models = require('../models/index');
module.exports={
    /*获取偏远地区*/
    getremoteCity: async function(req,res) {
        let cityname = req.params.cityTest;
        let cityState = req.params.cityState;
        let cityArea = req.params.cityArea;
        let cityinfo = await models.RemoteArea.findOne({
            where:{
                area: cityname,
                status:cityState,
                city:cityArea
            },
            attributes: ['isArrive','extrapay','isallow']
        });
        return {
            cityinfo:cityinfo
        }
    },
    getremoteCode: async function(req,res){
        let citycode = req.params.code;
        let cityState1 = req.params.cityState1;
        let cityinfo = await models.RemoteArea.findOne({
            where:{
                zipCode: citycode,
                status: cityState1
            },
            attributes: ['isArrive','extrapay','isallow']
        });
        return {
            cityinfo:cityinfo
        }
    },
    getremoteAll:async function(req,res){
        let cityall = req.params.all;
        let cityState1 = req.params.cityState;
        let cityArea = req.params.cityArea;
        let cityinfo = await models.RemoteArea.findOne({
            where:{
                city: cityArea,
                status: cityState1,
                area: cityall,
            },
            attributes: ['isArrive','extrapay','isallow']
        });
        return {
            cityinfo:cityinfo
        }
    },
    getremoteZip:async function(req,res){
        let cityzip = req.params.zip;
        let cityState1 = req.params.cityState;
        let cityArea = req.params.cityArea;
        let cityTest = req.params.cityTest;
        let cityinfo = await models.RemoteArea.findOne({
            where:{
                city: cityArea,
                status: cityState1,
                zipCode: cityzip,
                area:cityTest
            },
            attributes: ['isArrive','extrapay','isallow']
        });
        return {
            cityinfo:cityinfo
        }
    },
};
