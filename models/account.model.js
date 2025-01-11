const mongoose = require("mongoose");
const generateToken = require("../helper/generate");
const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        avartar: String,
        email: String,
        password: String,
        token: 
        {
            type : String,
            default : generateToken.generateToken(25)
        },
        idRole: String,
        telephone: String,
        address: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        dateDeleted: Date,
    }, {
    timestamps: true
}
);
const Account = mongoose.model('Account', accountSchema, "account");
module.exports = Account;