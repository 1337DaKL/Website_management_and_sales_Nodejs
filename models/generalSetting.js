const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const generalSettingSchema = new mongoose.Schema(
    {
        logo: String,
        name: String,
        email: String,
        telephone: String,
        address: String,
        footer: String
    }
);


const GeneralSetting = mongoose.model('GeneralSetting', generalSettingSchema, "generalSetting");


module.exports = GeneralSetting;