const mongoose = require("mongoose");
const generateToken = require("../helper/generate");
const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: {
            type: String,
            default: generateToken.generateOtp(8)
        },
        expireAt: {
            type: Date,
            default: () => new Date(Date.now() + 180 * 1000),
            index: { expires: 0 }
        }
    }
);
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgotPassword");
module.exports = ForgotPassword;