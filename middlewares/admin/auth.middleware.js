const prefixSystem = require("../../configs/systems");
const prefixAdmin = prefixSystem.prefixAdmin;
const Account = require("../../models/account.model");
const Role = require("../../models/role.model.js");
module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash("error", "Bạn cần phải đăng nhập đi zzz");
        res.redirect(`${prefixAdmin}/auth/login`);
    }
    else {
        const account = await Account.findOne({
            deleted : false,
            token : req.cookies.token
        }).select("-password -token");
        if(account)
        {
            const role = await Role.findOne({
                deleted : false,
                _id : account.idRole
            }).select("title permission");
            res.locals.roleLogin = role;
            res.locals.userLogin = account;
            next();
        }
        else
        {
            res.redirect(`${prefixAdmin}/auth/login`);
        }
    }
}