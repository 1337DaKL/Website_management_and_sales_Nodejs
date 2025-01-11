const prefixSystem = require("../../configs/systems");
const prefixAdmin = prefixSystem.prefixAdmin;
const Account = require("../../models/account.model");
module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash("error", "Bạn cần phải đăng nhập đi zzz");
        res.redirect(`${prefixAdmin}/auth/login`);
    }
    else {
        const account = await Account.findOne({
            deleted : false,
            token : req.cookies.token
        })
        if(account)
        {
            res.locals.userLogin = account;
            next();
        }
        else
        {
            res.redirect(`${prefixAdmin}/auth/login`);
        }
    }
}