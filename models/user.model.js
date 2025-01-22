const mongoose = require("mongoose");
const generateToken = require("../helper/generate");
const userSchema = new mongoose.Schema(
    {
        fullName: String,
        avartar: String,
        email: String,
        password: String,
        tokenUser:
        {
            type: String,
            default: generateToken.generateToken(25)
        },
        telephone: String,
        address: String,
        status: {
            type: String,
            default: "active"
        },
        deleted: {
            type: Boolean,
            default: false
        },
    }
);
const User = mongoose.model('User', userSchema, "user");
module.exports = User;