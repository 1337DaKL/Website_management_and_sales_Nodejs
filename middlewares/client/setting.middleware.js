const GeneralSetting = require("../../models/generalSetting");
module.exports.general = async (req, res, next) => {
    const generalSetting = await GeneralSetting.findOne();
    if(generalSetting) {
        res.locals.generalSetting = generalSetting;
    }
    
    next();
}